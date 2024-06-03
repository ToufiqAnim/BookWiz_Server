const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  async function run() {
    try {
        await client.connect();
        const booksDB=client.db('booksDB');
        const userDB=client.db('userDB');
        const booksCollection = booksDB.collection("booksCollection");
        const userCollection = userDB.collection("userCollection");

        app.post("/books", async (req, res) => {
            const booksData = req.body;
            const result = await booksCollection.insertOne(booksData);
            res.send(result);
          });
          app.get("/books", async (req, res) => {
            const booksData = booksCollection.find();
            const result = await booksData.toArray();
            res.send(result);
          });
          app.get("/books/:id", async (req, res) => {
            const id = req.params.id;
            const booksData = await booksCollection.findOne({
              _id: new ObjectId(id),
            });
            res.send(booksData);
          });
          app.patch("/books/:id",  async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await booksCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: updatedData }
            );
            res.send(result);
          });
          app.delete("/books/:id", verifyToken, async (req, res) => {
            const id = req.params.id;
            const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
          });
        console.log("Database is connected");
    } catch (error) {
        
    }
  }

app.get("/", (req, res) => {
    res.send("Route is working");
  });
  
  app.listen(port, (req, res) => {
    console.log("App is listening on port :", port);
  });