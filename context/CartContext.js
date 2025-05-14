// Import React context and hooks
import { createContext, useContext, useState, useEffect } from 'react';
// Import the useAuth hook from AuthContext
import { useAuth } from './AuthContext';
// Import axios for HTTP requests
import axios from 'axios';

// Create the CartContext object
const CartContext = createContext();

// Define the CartProvider component that wraps children with CartContext
export function CartProvider({ children }) {
  // State to store cart items
  const [cartItems, setCartItems] = useState([]);
  // Get the user from AuthContext
  const { user } = useAuth();

  // Log the user for debugging
  console.log(user);
  // Fetch cart from DB when user logs in
  useEffect(() => {
    if (user ) {
      fetchCartFromDB();
    } else {
      setCartItems([]); // Clear cart if user logs out
    }
  }, [user]);

  // Function to fetch cart from the database
  const fetchCartFromDB = async () => {
    try {
      const response = await axios.get('/api/cart', {
        params: { userEmail: user.email }, // Send user email as query param
      });
      console.log(response.data);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart from DB:', error);
    }
  };

  // Function to add a product to the cart
  const addToCart = async (product) => {
    if (!user) {
      return;
    }
    // Update local state immediately for instant UI feedback
    setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.productId === product.id);
        
        if (existingItem) {
          return prevItems.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [
            ...prevItems,
            {
              productId: product.id,
              productName: product.name,
              productPrice: product.price,
              userEmail: user.email ,  // Provide user email here
              quantity: 1
            }
          ];
        }
      });
      
    console.log("In Add function",cartItems);
    // Sync to DB
    try {
      await axios.post('/api/cart', {
        product,
        userEmail: user.email,
        quantity: 1,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Function to update the quantity of a cart item
  const updateQuantity = async (id, newQuantity) => {
    console.log("In Update function", newQuantity);
    if (newQuantity === 0) {
        await removeItem(id);
        return;
    }
    const existingItem = cartItems.find((item) => item.productId === id);

    if (!existingItem) {
      // Item is missing locally, fetch product info from backend
      try {
        const productResponse = await axios.get(`/api/products/${id}`); // Make sure you have this API
        const products = productResponse.data;
        const product = products.find((product) => product.id === Number(id));
  
        // Now call addToCart
        await addToCart(product);
      } catch (error) {
        console.error('Error fetching product info to re-add to cart:', error);
      }
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === id ? { ...item, quantity: newQuantity } : item
      )
    );

    console.log("In Update function",cartItems);

    // Send updated quantity to DB (Optional)
    try {
      await axios.put('/api/cart', {
        productId: id,
        userEmail: user.email,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  // Function to remove an item from the cart
  const removeItem = async (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== id));
    try {
      await axios.delete('/api/cart', {
        data: {
          productId: id,
          userEmail: user.email,
        },
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  // Function to clear the cart locally
  const clearCart = async () => {
    setCartItems([]);
  }

  // Function to clear the cart from the database
  const clearCartFromDB = async () => {
    if (!user) return;

    try {
      await axios.post('/api/cart/clear', {
        userEmail: user.email,
      });
      console.log("Cart cleared from database");
    } catch (error) {
      console.error('Error clearing cart from DB:', error);
    }
  };

  // Return the CartContext provider with value
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeItem, clearCartFromDB, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context easily
export function useCart() {
  return useContext(CartContext);
}
