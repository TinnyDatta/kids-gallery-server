const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wlyr1jn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

   const productsCollection = client.db('productsDB').collection('product');

  //  get all products from db
  // app.get('/product', async(req, res) => {
  //   let size = parseInt(req.query.size) || 6
  //   let page = parseInt(req.query.page) || 1
  //   let skip = (page - 1) * size
  //   const filter = req.query;
  //   const search = filter.search ? String(filter.search) : '';
  //   const query = {
  //     className: {$regex: search, $options: 'i'}
  //   }
  //   const result = await productsCollection.find(query).skip(skip).limit(size).toArray();
  //   res.send(result);
  // })
  app.get('/product', async (req, res) => {
    let size = parseInt(req.query.size) || 6;
    let page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * size;
    const filter = req.query;
    const search = filter.search ? String(filter.search) : '';
    
    // Adjust 'category' to the field you're searching by.
    const query = {
      category: { $regex: search, $options: 'i' } // Case-insensitive search
    };
    
    const result = await productsCollection.find(query).skip(skip).limit(size).toArray();
    res.send(result);
  });
  

  app.get('/product-count', async(req, res) => {
    const count = await productsCollection.estimatedDocumentCount();
    res.send({count});
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('kids gallery server is running')
})

app.listen(port, () => {
    console.log(`kids gallery server is running on port : ${port}`)
})