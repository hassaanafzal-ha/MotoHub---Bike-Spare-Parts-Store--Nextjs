// Import React hooks
import { useState } from 'react';
// Import Link from Next.js for client-side navigation
import Link from 'next/link';
// Import useRouter from Next.js for navigation
import { useRouter } from 'next/router';
// Import Navbar component
import Navbar from '../../components/Navbar';
// Import axios for HTTP requests
import axios from 'axios';

// Define the Signup component
export default function Signup() {
  // Get the router object for navigation
  const router = useRouter();
  // State to store form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  // State to store error messages
  const [error, setError] = useState('');
  // State to store password warning
  const [passwordWarning, setPasswordWarning] = useState('');
  // State to store confirm password warning
  const [confirmWarning, setConfirmWarning] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { firstName, lastName, email, password, confirmPassword } = formData;
  
    // Reset warnings first
    setPasswordWarning('');
    setConfirmWarning('');
    setError('');
  
    let hasError = false;
  
    // Password length check
    if (password.length < 7) {
      setPasswordWarning('Password must be at least 7 characters long.');
      hasError = true;
    }
  
    // Confirm password match check
    if (password !== confirmPassword) {
      setConfirmWarning('Passwords do not match.');
      hasError = true;
    }
  
    if (hasError) return;
  
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.post(`${baseUrl}/api/signup`, {
        firstName,
        lastName,
        email,
        password,
      });
  
      if (res.status === 201) {
        alert('Account created successfully! Redirecting to login...');
        router.push('/login');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Email already registered!');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };
  

  // Return the JSX for the signup page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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
          {passwordWarning && <p style={{ color: 'red', marginTop: '5px' }}>{passwordWarning}</p>}


          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
          {confirmWarning && <p style={{ color: 'red', marginTop: '5px' }}>{confirmWarning}</p>}

        {/* General error */}
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}


          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
