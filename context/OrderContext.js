// Import React context and hooks
import { createContext, useContext, useState } from 'react';

// Create the OrderContext object
const OrderContext = createContext();

// Define the OrderProvider component that wraps children with OrderContext
export function OrderProvider({ children }) {
  // State to store the current order
  const [order, setOrder] = useState(null);

  // Function to save placed order
  const placeOrder = (orderData) => {
    setOrder(orderData);
  };

  // Return the OrderContext provider with value
  return (
    <OrderContext.Provider value={{ order, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

// Hook to use order context easily
export function useOrder() {
  return useContext(OrderContext);
}
