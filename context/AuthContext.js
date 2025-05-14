// Import React hooks and context utilities
import { createContext, useContext, useState, useEffect } from 'react';
// Import the useRouter hook from Next.js for navigation
import { useRouter } from 'next/router';

// Create the AuthContext object
const AuthContext = createContext();

// Define the AuthProvider component that wraps children with AuthContext
export function AuthProvider({ children }) {
  // State to store the current user
  const [user, setUser] = useState(null);
  // State to store the current admin token
  const [admin, setAdmin] = useState(null);
  // State to indicate if authentication is loading
  const [loading, setLoading] = useState(true);
  // Get the router object for navigation
  const router = useRouter();

  // useEffect to check authentication status on mount
  useEffect(() => {
    // Function to check authentication from localStorage
    const checkAuth = () => {
      // Get stored user from localStorage
      const storedUser = localStorage.getItem('user');
      // Get stored admin token from localStorage
      const storedAdmin = localStorage.getItem('adminToken');

      // If a user is stored, set it in state
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // If an admin token is stored, set it in state
      if (storedAdmin) {
        setAdmin(storedAdmin);
      }

      // Set loading to false after checking
      setLoading(false);
    };

    // Call the checkAuth function
    checkAuth();
  }, []);

  // User login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/');
  };

  // User logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // If not admin, redirect to login page
    if(!admin){
      router.push('/login');
    }
  };

  // Admin login function
  const loginAdmin = (token) => {
    setAdmin(token);
    localStorage.setItem('adminToken', token);
    router.push('/admin/dashboard');
  };

  // Admin logout function
  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
    // If not user, redirect to admin login page
    if(!user){
      router.push('/admin/login');
    }
  };

  // Value object to provide through context
  const value = {
    user,
    admin,
    loading,
    login,
    logout,
    loginAdmin,
    logoutAdmin,
  };

  // Return the AuthContext provider with value
  return (
    <AuthContext.Provider value={value}>
      {/* Render children only when not loading */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  // Get the context value
  const context = useContext(AuthContext);
  // Throw error if used outside AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // Return the context value
  return context;
}
