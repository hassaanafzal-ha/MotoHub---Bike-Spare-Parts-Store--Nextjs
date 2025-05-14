// Import MongoDB client for database operations
import { MongoClient } from "mongodb";
// Import bcrypt for password hashing (not used in this file, can be removed)
import bcrypt from "bcryptjs";

// Define the API route handler function
async function handler(req, res) {
  // Handle GET request to fetch all categories
  if (req.method === 'GET') {
    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
      process.env.MONGODB_URI
    );

    try {
      // Get database instance
      const db = client.db();
      // Get categories collection
      const categoriesCollection = db.collection('categories');
      // Fetch all categories and convert to array
      const categories = await categoriesCollection.find({}).toArray();
      // Send categories as JSON response with 200 status
      res.status(200).json(categories);

    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    } finally {
      // Close MongoDB connection
      await client.close();
    }
  } 
  // Handle POST request to create new category
  else if (req.method === 'POST') {
    // Destructure category data from request body
    const { name, description } = req.body;
    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
      process.env.MONGODB_URI
    );
    try {
      // Get database instance
      const db = client.db();
      // Get categories collection
      const categoriesCollection = db.collection('categories');
      // Find the last category to get the highest ID
      const lastCategory = await categoriesCollection.find().sort({ id: -1 }).limit(1).toArray();
      console.log(lastCategory);
      // Initialize new ID as 1
      let newId = 1;
      // If categories exist, increment the last ID
      if (lastCategory.length > 0) {
        newId = lastCategory[0].id + 1;
      }
      // Insert new category with auto-incremented ID
      const result = await categoriesCollection.insertOne({ id: newId, name, description });
      // Send success response with new category ID
      res.status(200).json({ message: 'Category added successfully', categoryId: result.insertedId });
    }
    catch(error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
    finally {
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
