// Import MongoDB client for database operations
import { MongoClient } from "mongodb";
// Import bcrypt for password hashing
import bcrypt from "bcryptjs";

// Define the API route handler function
async function handler(req, res) {
  // Only handle POST requests for signup
  if (req.method === 'POST') {
    // Destructure user data from request body
    const { firstName, lastName, email, password } = req.body;
    
    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
      process.env.MONGODB_URI
    );

    try {
      // Get database instance
      const db = client.db();
      // Get users collection
      const usersCollection = db.collection('users');
      
      // Check if user already exists in database
      const existingUser = await usersCollection.findOne({ userEmail: email });
      // If user exists, return error
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password with bcrypt using 12 rounds of salting
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new user document with hashed password
      await usersCollection.insertOne({
        firstName,
        lastName,
        userEmail: email,
        password: hashedPassword,
        createdAt: new Date() // Add timestamp for user creation
      });

      // Send success response
      res.status(201).json({ message: 'Signed Up!' });

    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    } finally {
      // Close MongoDB connection
      await client.close();
    }
  } else {
    // Send 405 Method Not Allowed for non-POST requests
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Export the handler function as default
export default handler;
