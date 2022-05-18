const express = require("express")
const app = express()
require('dotenv').config()
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 8000

// middleware
app.use(cors())
app.use(express.json())

// connect with mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ab5rv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const collectionTask = client.db('todo').collection('task')
        // const myBooksCollection = client.db('warehouse').collection('mybooks')

        app.get('/task', async (req, res) => {
            const query = {}
            const cursor = collectionTask.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await collectionTask.findOne(query)
            res.send(result)

        })



        // Add new Task
        app.post('/task', async (req, res) => {
            const newTask = req.body
            const result = await collectionTask.insertOne(newTask)
            res.send(result)
        })




        // Delete Task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await collectionTask.deleteOne(query)
            res.send(result)

        })


    }
    finally {

    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Hello Node")
})



app.listen(port, () => {
    console.log("Listing Server from", port)
})