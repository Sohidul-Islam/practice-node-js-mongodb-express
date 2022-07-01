const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://mymongodb1:zvtQKk7M4ipeVfeC@cluster0.yq19m.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     console.log("MongoDB Connected");
//     const user = { name: "John", age: 30 };
//     collection.insertOne(user, (err, res) => {
//         if (err) throw err;
//         console.log("1 document inserted");
//         client.close();
//     })
// });

const run = async () => {
    try {
        await client.connect();
        const database = client.db("Restaurant");
        const userCollection = database.collection("Food");
        // create a document to insert
        // const user = { name: "Shufol", age: 30 };
        // const result = await userCollection.insertOne(user);

        /*----------------------------------------------------------------*/
        // GET METHOD
        /*----------------------------------------------------------------*/
        app.get("/users", async (req, res) => {
            const users = await userCollection.find({}).toArray();
            res.send(users);
        })
        app.get("/users/:id", async (req, res) => {
            console.log("req.params.id ", req.params.id);
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            console.log("query ", query);
            const users = await userCollection.findOne(query);
            console.log("Users ", users);
            res.send(users);
        })
        /*----------------------------------------------------------------*/
        // POST METHOD
        /*----------------------------------------------------------------*/
        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result);
        })

        /*----------------------------------------------------------------*/
        // DELETE METHOD
        /*----------------------------------------------------------------*/
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            console.log("in app.delete deleted id: ", id);
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        /*----------------------------------------------------------------*/
        // UPDATE METHOD-
        /*----------------------------------------------------------------*/
        app.put("/users/:id", async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log("in app.put updated id: ", id);
            const query = { _id: ObjectId(id) };
            console.log("user in app.put ", user);
            const updateDocs = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            };
            const options = { upsert: true }
            const result = await userCollection.updateOne(query, updateDocs, options);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}

run().catch(console.error);

app.get("/", (req, res) => {
    res.send("Hello World");
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})