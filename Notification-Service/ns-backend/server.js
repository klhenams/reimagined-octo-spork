//dependencies
const express = require("express");
const dotenv = require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const MONGO_URL = process.env.MONGO_DB_URL

const mainRoutes = require('./routes/routes.js')

const app = express();
app.use(express.json());

//routes
app.use("/", mainRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(MONGO_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },

  });
  
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
});