// Import MongoDB client and ObjectId for database operations
import { MongoClient, ObjectId } from "mongodb";

// Define the API route handler function
async function handler(req, res) {
  // Get category ID from request query parameters
  const { id } = req.query;

  // Handle GET request to fetch specific category
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

      // Find category by id (convert id to number if you're using numeric ids)
      const category = await categoriesCollection.findOne({ id: Number(id) });

      // If category not found, return 404 status
      if (!category) {
        res.status(404).json({ message: 'Category not found' });
        return;
      }

      // Send category as JSON response with 200 status
      res.status(200).json(category);

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
