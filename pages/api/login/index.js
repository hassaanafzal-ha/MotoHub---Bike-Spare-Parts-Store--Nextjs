// Import MongoDB client for database operations
import { MongoClient } from "mongodb";
// Import bcrypt for password comparison
import bcrypt from "bcryptjs";

// Define the API route handler function
async function handler(req, res) {
  // Only handle POST requests for login
  if (req.method === "POST") {
    // Destructure email and password from request body
    const { email, password } = req.body;
    // Log login attempt (email only, never log passwords)
    console.log(email, password);
    
    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
      process.env.MONGODB_URI
    );

    try {
      // Get database instance
      const db = client.db();
      // Get users collection
      const usersCollection = db.collection("users");

      // Check if user exists in database
      const existingUser = await usersCollection.findOne({ userEmail: email });
      // If user doesn't exist, return error
      if (!existingUser) {
        return res.status(400).json({ message: "Email not found. Register yourself" });
      }
      
      // Compare provided password with hashed password in database
      const passwordmatch = await bcrypt.compare(password, existingUser.password)
      // If passwords don't match, return error
      if(!passwordmatch){
        return res.status(500).json({ message: "Incorrect Password" })
      }
      
      // If login successful, return user's first and last name
      res.status(200).json({
        message: "Logged In",
        firstname: existingUser.firstName, 
        lastname: existingUser.lastName
      });
    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      // Close MongoDB connection
      await client.close();
    }
  }
}

// Export the handler function as default
export default handler;
