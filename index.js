const express = require("express");
const cors = require("cors");
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


// **************************** MongoDB Connection Start *****************************

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
		const cartCollection = database.collection("carts");
		const userCollection = database.collection("users");

        
        // ****************** Data Base Operation Start ****************

		//create user
		app.post('/users',async(req,res) => {
			const user = req.body;
			const query = {email:user.email}
			const isUserExist  = await userCollection.findOne(query);
			if(isUserExist)
			{
				return res.send({message:"User Already Exist", insertedId : null})
			}
			const result = await userCollection.insertOne(user);
			res.send(result);
		})

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

		// add cart data to data of a specific user
		app.post('/carts', async(req,res) => {
			const newCart = req.body;
			const result = await cartCollection.insertOne(newCart);
			res.send(result);
		});
		//get users cart data
		app.get('/carts', async(req,res) => {
			const email = req.query.email;
			const query = {userEmail:email} 
			const cursor = cartCollection.find(query);
			const result = await cursor.toArray();
			res.send(result);
		})
		//delete specific user cart data
		app.delete('/carts/:id',async(req,res) => {
			const id =  req.params.id;
			const query = {_id: new ObjectId(id)};
			const result = await cartCollection.deleteOne(query);
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
