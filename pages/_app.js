// Import global styles
import '../styles/globals.css';
// Import AuthProvider from AuthContext
import { AuthProvider } from '../context/AuthContext';
// Import CartProvider from CartContext
import { CartProvider } from '../context/CartContext';
// Import useRouter from Next.js for navigation
import { useRouter } from 'next/router';
// Import useAuth hook from AuthContext
import { useAuth } from '../context/AuthContext';
// Import useEffect from React
import { useEffect } from 'react';
// Import OrderProvider from OrderContext
import { OrderProvider } from '../context/OrderContext';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup','/admin/login'];

// Define the RouteGuard component to protect routes
function RouteGuard({ children }) {
  // Get the router object for navigation
  const router = useRouter();
  // Get user, loading, and admin from AuthContext
  const { user, loading, admin } = useAuth();

  // useEffect to check authentication status on route change
  useEffect(() => {
    // Check if the route is public
    const isPublicRoute = publicRoutes.includes(router.pathname);
    // If the route starts with '/admin', check for admin authentication
    if (router.pathname.startsWith('/admin')) {
      // If not admin and not loading, redirect to admin login
      if (!admin && !loading) {
        router.push('/admin/login');
      }
      // Return early to avoid running user route check
      return; // don't run user route check
    }
    // If not a public route and user is not authenticated, redirect to login
    if (!isPublicRoute && !user && !loading) {
      router.push('/login');
    }
  }, [router.pathname, user,admin, loading]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      // Centered loading spinner
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render children if authenticated or on public route
  return children;
}

// Define the MyApp component
function MyApp({ Component, pageProps }) {
  // Return the JSX for the app
  return (
    // Provide authentication context to the app
    <AuthProvider>
      {/* Provide cart context to the app */}
      <CartProvider>
        {/* Provide order context to the app */}
        <OrderProvider>
          {/* Protect routes with RouteGuard */}
          <RouteGuard>
            {/* Render the current page component with its props */}
            <Component {...pageProps} />
          </RouteGuard>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

// Export the MyApp component as default
export default MyApp;
