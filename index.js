require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT ;

app.use(cors({
  origin: 'https://book-wiz.vercel.app/', // Replace with your actual Vercel domain
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}));
app.use(express.json());

function createToken(user) {
    const token = jwt.sign(
      {
        email: user.email,
      },
      "secret",
      { expiresIn: "7d" }
    );
    return token;
  }
  
  function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, "secret");
    if (!verify?.email) {
      return res.send("You are not authorized");
    }
    req.user = verify.email;
    next();
  }


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
        // await client.connect();
        const booksDB=client.db('booksDB');
        const userDB=client.db('userDB');
        const booksCollection = booksDB.collection("booksCollection");
        const userCollection = userDB.collection("userCollection");

        app.post("/books", verifyToken, async (req, res) => {
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
          app.patch("/books/:id",verifyToken, async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const result = await booksCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: updatedData }
            );
            res.send(result);
          });
          app.delete("/books/:id",verifyToken,  async (req, res) => {
            const id = req.params.id;
            const result = await booksCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
          });

    // USER
    app.post("/user",verifyToken, async (req, res) => {
        const user = req.body;
  
        const token = createToken(user);
        const isUserExist = await userCollection.findOne({ email: user?.email });
        if (isUserExist?._id) {
          return res.send({
            statu: "success",
            message: "Login success",
            token,
          });
        }
        await userCollection.insertOne(user);
        return res.send({ token });
      });
      app.get("/user/get/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const result = await userCollection.findOne({ _id: new ObjectId(id) });
        res.send(result);
      });
  
      app.get("/user/:email", async (req, res) => {
        const email = req.params.email;
        const result = await userCollection.findOne({ email });
        res.send(result);
      });
  
      app.patch("/user/:email", async (req, res) => {
        const email = req.params.email;
        const userData = req.body;
        const result = await userCollection.updateOne(
          { email },
          { $set: userData },
          { upsert: true }
        );
        res.send(result);
      });
        console.log("Database is connected");
    } finally {
        
    }
  }
  run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Route is working");
  });
  
  app.listen(port, (req, res) => {
    console.log("App is listening on port :", port);
  });