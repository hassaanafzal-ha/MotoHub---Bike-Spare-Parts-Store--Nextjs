// Import useState hook from React
import { useState } from 'react';
// Import Link from Next.js for client-side navigation
import Link from 'next/link';
// Import Navbar component
import Navbar from '../../components/Navbar';
// Import useAuth hook from AuthContext
import { useAuth } from '../../context/AuthContext';
// Import useRouter from Next.js for navigation
import { useRouter } from 'next/router';
// Import axios for HTTP requests
import axios from 'axios';

// Define the Login component
export default function Login() {
  // Get the router object for navigation
  const router = useRouter();
  // Get the login function from AuthContext
  const { login } = useAuth();
  // State to store form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // State to store error messages
  const [error, setError] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {email, password} = formData;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      // Make login request to API
      const res = await axios.post(`${baseUrl}/api/login`, {
        email,
        password,
      });
      console.log(res.data.firstname);
      if (res.status === 200) {
        // Login successful - update auth context and redirect
        login({firstname: res.data.firstname, lastname: res.data.lastname, email})
        router.push('/');
      } 
    } catch (err) {
      console.error(err);
      // Handle different error cases
      if (err.response?.status === 400) {
        setError('Email does not exist. Sign Up first')
      }else if (err.response?.status===500) {
        setError('Incorrect Password. Please try again.');
      }
       else {
        alert('Something went wrong. Please try again.');
      }
    }
  };

  // Return the JSX for the login page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
        {/* Login Header */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Login to MotoHub</h2>
        
        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Dont have an account?
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 