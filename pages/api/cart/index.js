// pages/api/cart.js
import { MongoClient } from "mongodb";

// Define the API route handler function
async function handler(req, res) {
  // Handle GET request to fetch user's cart items
  if (req.method === 'GET') {
    // Get user email from query parameters
    const { userEmail } = req.query;
    console.log(userEmail);
    // Validate user email
    if (!userEmail) {
        return res.status(400).json({ message: 'Missing userEmail' });
    }
    
    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
        process.env.MONGODB_URI
    );

    try {
      // Get database instance
      const db = client.db();
      // Get carts collection
      const cartCollection = db.collection('carts');
      // Find all cart items for the user
      const cartItems = await cartCollection.find({ userEmail}).toArray();
      console.log(cartItems);
      // Send cart items as JSON response with 200 status
      res.status(200).json(cartItems);
    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while retrieving cart items' });
    } finally {
      // Close MongoDB connection
      await client.close();
    }
  } 
  // Handle POST request to add item to cart
  else if (req.method === 'POST') {
    // Destructure request body data
    const { product, userEmail, quantity } = req.body;

    // Validate required fields
    if (!userEmail || !product || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
      process.env.MONGODB_URI
    );

    try {
      // Get database instance
      const db = client.db();
      // Get carts collection
      const cartCollection = db.collection('carts');

      // Check if the product already exists in the user's cart
      const existingItem = await cartCollection.findOne({ userEmail, productId: product.id });

      if (existingItem) {
        // Update the quantity if the product exists
        await cartCollection.updateOne(
          { userEmail, productId: product.id, productName: product.name, productPrice: product.price },
          { $set: { quantity: existingItem.quantity + quantity } }
        );
        // Send success response
        res.status(200).json({ message: 'Item quantity updated' });
      } else {
        // Add new product to the cart
        const newItem = { userEmail, productId: product.id, productName: product.name, productPrice: product.price, quantity };
        await cartCollection.insertOne(newItem);
        // Send success response with new item
        res.status(201).json({ message: 'Item added to cart', newItem });
      }
    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while adding item to the cart' });
    } finally {
      // Close MongoDB connection
      await client.close();
    }
  } 
  // Handle DELETE request to remove item from cart
  else if (req.method === 'DELETE') {
    // Destructure request body data
    const { productId, userEmail } = req.body;
    console.log(productId, userEmail);
    // Validate required fields
    if (!userEmail || !productId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(
      process.env.MONGODB_URI
    );

    try {
      // Get database instance
      const db = client.db();
      // Get carts collection
      const cartCollection = db.collection('carts');
      // Delete the item from cart
      const result = await cartCollection.deleteOne({ userEmail, productId });

      if (result.deletedCount === 1) {
        // Send success response if item was deleted
        res.status(200).json({ message: 'Item removed from cart' });
      } else {
        // Send 404 if item was not found
        res.status(404).json({ message: 'Item not found in the cart' });
      }
    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while removing item from the cart' });
    } finally {
      // Close MongoDB connection
      await client.close();
    }
  } 
  // Handle PUT request to update item quantity
  else if (req.method === 'PUT') {
    // Destructure request body data
    const { productId, userEmail, quantity } = req.body;
    console.log(productId, userEmail, quantity);
    // Validate required fields
    if (!userEmail || !productId || quantity === undefined || quantity === null) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
      
    // Connect to MongoDB using the connection string from environment variables
    const client = await MongoClient.connect(process.env.MONGODB_URI)
      
    try {
      // Get database instance
      const db = client.db();
      // Get carts collection
      const cartCollection = db.collection('carts');
      
      // If quantity is 0, remove the item from cart
      if (quantity === 0) {
        await cartCollection.deleteOne({ userEmail, productId });
        return res.status(200).json({ message: 'Item removed from cart' });
      }
      
      // Update the item quantity
      await cartCollection.updateOne({ userEmail, productId }, { $set: { quantity } });
      // Send success response
      res.status(200).json({ message: 'Item quantity updated' });
    } catch (error) {
      // Log error and send 500 status with error message
      console.error(error);
      res.status(500).json({ message: 'Something went wrong while updating item quantity' });
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
