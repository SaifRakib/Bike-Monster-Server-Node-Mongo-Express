// Require Express Js
const express = require("express");
const app = express();
const ObjectId = require("mongodb").ObjectId;
// Port setup
const port = process.env.PORT || 8080;
// Cors require
const cors = require("cors");
// Require mongoDB
const { MongoClient } = require("mongodb");
// Configure dotenv
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// user : saif_rakib_1
// pass : BWfA9Jvzimtowak1

// Connect with mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzt4u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Create a new mongo client
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connection in mongo
async function run() {
  try {
    await client.connect();
    const database = client.db("monsterBike");
    const productCollection = database.collection("bikeItem");
    const orderCollection = database.collection("orderItem");

    // add services
    app.post("/addProduct", async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      console.log(result);
      res.json(result);
    });

    //  Get all services
    app.get("/allProduct", async (req, res) => {
      const allProduct = await productCollection.find({}).toArray();

      res.json(allProduct);
    });

    // GET Single Service
    app.get("/allProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.json(product);
    });

    // Get order information
    app.post("/order", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.json(result);
      console.log(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
