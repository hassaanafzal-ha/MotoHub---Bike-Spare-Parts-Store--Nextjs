// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the ShoppingCartIcon from Heroicons for the cart icon
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
// Import the useAuth hook from the AuthContext to access authentication state
import { useAuth } from '../context/AuthContext';

// Define the Navbar functional component
const Navbar = () => {
  // Destructure user and logout from the useAuth hook
  const { user, logout } = useAuth();

  // Return the JSX for the navigation bar
  return (
    // Navigation container with background and shadow
    <nav className="bg-white shadow-lg">
      {/* Wrapper for content with max width and padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container to space out logo and links */}
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex">
            {/* Link to the homepage with styled brand name */}
            <Link href="/" className="flex items-center">
              {/* Brand name text */}
              <span className="text-2xl font-bold text-blue-600">MotoHub</span>
            </Link>
          </div>

          {/* Navigation links and user actions */}
          <div className="flex items-center space-x-4">
            {/* If user is logged in, show these links */}
            {user ? (
              <>
                {/* Link to categories page */}
                <Link href="/categories" className="text-gray-700 hover:text-blue-600">
                  {/* Categories text */}
                  Categories
                </Link>
                {/* Link to products page */}
                <Link href="/products" className="text-gray-700 hover:text-blue-600">
                  {/* Products text */}
                  Products
                </Link>
                {/* Link to cart page with cart icon */}
                <Link href="/cart" className="text-gray-700 hover:text-blue-600">
                  {/* Shopping cart icon */}
                  <ShoppingCartIcon className="h-6 w-6" />
                </Link>
                {/* Link to user profile page */}
                <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                  {/* Profile text */}
                  Profile
                </Link>
                {/* Logout button triggers logout function */}
                <button
                  onClick={logout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {/* Logout text */}
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Link to login page */}
                <Link href="/login" className="text-gray-700 hover:text-blue-600">
                  {/* Login text */}
                  Login
                </Link>
                {/* Link to signup page with button styling */}
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  {/* Sign Up text */}
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Export the Navbar component as default
export default Navbar; 