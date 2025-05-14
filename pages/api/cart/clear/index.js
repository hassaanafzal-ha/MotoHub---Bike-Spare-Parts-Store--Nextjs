// Import MongoDB client for database operations
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

// Define the API route handler function
async function handler(req, res) {
  // Only allow POST requests for clearing cart
  if (req.method !== 'POST') {
    // Send 405 Method Not Allowed response for non-POST requests
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get user email from request body
  const { userEmail } = req.body;

  // Validate user email
  if (!userEmail) {
    // Send 400 Bad Request if user email is missing
    return res.status(400).json({ message: 'Missing userEmail' });
  }

  // Connect to MongoDB using the connection string from environment variables
  const client = await MongoClient.connect(process.env.MONGODB_URI);

  try {
    // Get database instance
    const db = client.db();
    // Get carts collection
    const cartCollection = db.collection('carts');
    // Delete all cart items for the user
    const result = await cartCollection.deleteMany({ userEmail });

    // Send success response with number of items deleted
    res.status(200).json({ 
      message: 'Cart cleared successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    // Log error and send 500 status with error message
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while clearing the cart' });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
}

// Export the handler function as default
export default handler;
