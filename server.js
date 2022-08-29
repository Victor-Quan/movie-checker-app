const express = require('express');
const app = express();
const cors = require('cors');
const {MongoClient, ObjectId} = require('mongodb');
require('dotenv').config();
const PORT = 9001;

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix',
    collection

MongoClient.connect(dbConnectionStr) // allows connection to MongoDB. MongoDB parses the dbConnectionStr variable and determines that this client is authorized to access the selected database.
    .then(client => {
        console.log('Connection to database successful. SCV ready.')
        db = client.db(dbName); // sets db variable to the database name.
        collection = db.collection('movies') // sets collection variable equal to client.db(dbName).collection('movies'), allows quick shortcut to accessing the collection called "movies" in the database.
    })

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get("/search", async (req, res) => {
    try {
        let result = await collection.aggregate([
            {
                "$search": {
                    "autocomplete": {
                        "query": `${req.query.query}`,
                        "path": "title",
                        "fuzzy": {
                            "maxEdits": 2,
                            "prefixLength": 3
                        }
                    }
                }
            }
        ]).toArray();
        res.send(result)
    } catch (err) {
        res.status(500).send({message: err.message});
    }
})

app.get("/get/:id", async (req, res) => {
    try {
        let result = await collection.findOne({
            "_id": ObjectId(req.params.id)
        })
        res.send(result)
    } catch (error) {
        res.status(500).send({message: err.message});
    }
})

app.listen(process.env.PORT || PORT, () => {
    console.log('Server is up and running. All good to go, commander.')
})