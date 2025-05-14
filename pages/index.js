// Import React hooks
import { useState } from 'react';
// Import Link from Next.js for client-side navigation
import Link from 'next/link';
// Import Navbar component
import Navbar from '../components/Navbar';
// Import axios for HTTP requests
import axios from 'axios';

// Define the Home component
export default function Home({categories, featuredProducts}) {
  // Return the JSX for the home page
  return (
    // Main container with minimum height and background color
    <div className="min-h-screen bg-gray-50">
      // Render the Navbar component
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
              Premium Motorcycle Parts
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Find the perfect parts for your ride. Quality components for every motorcycle enthusiast.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Browse Categories
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <Link href={`/categories/${category.id}`} className="mt-4 text-blue-600 hover:text-blue-500">
                  View Products →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-2 text-gray-500">${product.price}</p>
                  <Link href={`/products/${product.id}`}>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    View Product
                  </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About MotoHub</h3>
              <p className="text-gray-300">
                Your one-stop shop for premium motorcycle parts and accessories.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/categories" className="text-gray-300 hover:text-white">Categories</Link></li>
                <li><Link href="/products" className="text-gray-300 hover:text-white">Products</Link></li>
                <li><Link href="/cart" className="text-gray-300 hover:text-white">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300">
                Email: mq08460@gmail.com<br />
                Phone: 1112223334
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; 2024 MotoHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Function to fetch static props for the home page
export async function getStaticProps(){
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await axios.get(`${baseUrl}/api/categories`);
  const categories = res.data;
  const productsRes = await axios.get(`${baseUrl}/api/products`);
  const products = productsRes.data;
  const featuredProducts = products.filter((product) => product.price>5000);
  if(!categories){
    return {
      notFound: true,
    }
  }
  return {
    props: {
      categories,
      featuredProducts,
    },
    revalidate: 10,
  }
}