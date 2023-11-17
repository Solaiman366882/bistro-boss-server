const express = require("express");
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


// **************************** MongoDB Connection Start *****************************

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ea4znei.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
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

        const database = client.db("bistroDB");
        const menuCollection = database.collection("menus");
        const reviewCollection = database.collection("reviews");

        
        // ****************** Data Base Operation Start ****************

        //get all kind of menus
        app.get('/menus',async(req,res) => {
            const cursor = menuCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        //get all kind of reviews
        app.get('/reviews',async(req,res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });


        // ****************** Data Base Operation End ****************





		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		//await client.close();
	}
}
run().catch(console.dir);

// ****************************** MongoDB Connection End *****************************

app.get("/", (req, res) => {
	res.send("Bistro Boss Server is running");
});
app.listen(port, () => {
	console.log(`Server is running on Port = ${port}`);
});
