// Import MongoDB client for database operations
import { MongoClient } from "mongodb";

// Define the API route handler function
async function handler(req, res) {
  // Handle GET request to fetch all products
  if (req.method === 'GET') {
    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
      process.env.MONGODB_URI
    );

    try {
      // Get database instance
      const db = client.db();
      // Get products collection
      const productsCollection = db.collection('products');
      // Fetch all products and convert to array
      const products = await productsCollection.find({}).toArray();
      // Send products as JSON response with 200 status
      res.status(200).json(products);

    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    } finally {
      // Close MongoDB connection
      await client.close();
    }
  } 
  // Handle POST request to create new product
  else if (req.method === 'POST') {
    // Destructure product data from request body
    const { name, price, category, description, specifications, features } = req.body;
    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
      process.env.MONGODB_URI
    );
  
    try {
      // Get database instance
      const db = client.db();
      // Get products collection
      const productsCollection = db.collection('products');
  
      // Find the last product to get the highest ID
      const lastProduct = await productsCollection.find
      console.log(lastProduct);
      // Initialize ().sort({ id: -1 }).limit(1).toArray();new ID as 1
      let newId = 1;
      // If products exist, increment the last ID
      if (lastProduct.length > 0) {
        newId = lastProduct[0].id + 1;
      }
  
      // Insert new product with auto-incremented ID
      const result = await productsCollection.insertOne({
        id: newId,  
        name,
        price,
        category,
        description,
        specifications,
        features
      });
  
      // Send success response with new product ID
      res.status(200).json({ message: 'Product added successfully', productId: newId });
  
    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    } finally {
      // Close MongoDB connection
      await client.close();
    }
  }
  // Handle unsupported HTTP methods
  else {
    // Send 405 Method Not Allowed response
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Export the handler function as default
export default handler;
