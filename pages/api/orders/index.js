// Import MongoDB client for database operations
import { MongoClient } from "mongodb";

// Define the API route handler function
async function handler(req, res) {
  // Connect to MongoDB using the connection string from environment variables
  const client = await MongoClient.connect(
    process.env.MONGODB_URI
  );

  // Get database instance
  const db = client.db();
  // Get orders collection
  const ordersCollection = db.collection("orders");

  // Handle POST request to create new order
  if (req.method === "POST") {
    // Destructure order data from request body
    const { userEmail, shippingInfo, items, subtotal, shipping, tax, total, date } = req.body;
    // Log order details for debugging
    console.log(userEmail, shippingInfo, items, subtotal, shipping, tax, total, date);
    // Generate unique order ID using random string
    const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();

    try {
      // Insert new order into database
      const order = await ordersCollection.insertOne({
        orderId,
        userEmail,
        shippingInfo,
        items,
        subtotal,
        shipping,
        tax,
        total,
        date
      });
      // Send success response with order ID
      res.status(200).json({ message: "Order Placed", orderId: orderId });
    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      // Close MongoDB connection
      await client.close();
    }

  } 
  // Handle GET request to fetch user's orders
  else if (req.method === "GET") {
    // Get user email from query parameters
    const { email } = req.query;

    // Validate email parameter
    if (!email) {
      await client.close();
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      // Find all orders for the specified user email
      const orders = await ordersCollection.find({ userEmail: email }).toArray();
      // Send orders as JSON response with 200 status
      res.status(200).json({ orders });
    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      // Close MongoDB connection
      await client.close();
    }

  } 
  // Handle unsupported HTTP methods
  else {
    // Close MongoDB connection
    await client.close();
    // Send 405 Method Not Allowed response
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

// Export the handler function as default
export default handler;
