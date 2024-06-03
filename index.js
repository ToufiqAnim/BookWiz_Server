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

app.get("/", (req, res) => {
    res.send("Route is working");
  });
  
  app.listen(port, (req, res) => {
    console.log("App is listening on port :", port);
  });