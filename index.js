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
    const usersCollection = database.collection("users");
    const reviewCollection = database.collection("review");

    // add Product
    app.post("/addProduct", async (req, res) => {
      const result = await productCollection.insertOne(req.body);
      console.log(result);
      res.json(result);
    });

    //  Get all Product
    app.get("/allProduct", async (req, res) => {
      const allProduct = await productCollection.find({}).toArray();

      res.json(allProduct);
    });
    // Delete Product
    app.delete("/deleteProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
      console.log(result);
    });

    // GET Single Product
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

    //  Get all Orders
    app.get("/orders", async (req, res) => {
      const allOrders = await orderCollection.find({}).toArray();
      res.json(allOrders);
    });

    // Get all order by email
    app.get("/myorders", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query = { email: email };
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });

    //UPDATE API
    app.put("/updateOrder/:id", async (req, res) => {
      const id = req.params.id;
      const updatedOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedOrder.status,
        },
      };

      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("updating", id);
      res.json(result);
      console.log(req.body.status);
    });

    // Delete order
    app.delete("/deleteOrder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
      console.log(result);
    });

    // Insert user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // update user
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // Find user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // make admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });

    // Review add
    app.post("/addReview", async (req, res) => {
      const result = await reviewCollection.insertOne(req.body);
      console.log(result);
      res.json(result);
    });

    //  Get all review
    app.get("/allReview", async (req, res) => {
      const allReview = await reviewCollection.find({}).toArray();

      res.json(allReview);
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
