// Import Link from Next.js for client-side navigation
import Link from 'next/link';
// Import Navbar component
import Navbar from '../../../components/Navbar';
// Import axios for HTTP requests
import axios from 'axios';
// Import useCart hook from CartContext
import { useCart } from '../../../context/CartContext';

// Define the ProductDetail component
export default function ProductDetail({ product }) {
  // Get the addToCart function from CartContext
  const { addToCart } = useCart();

  // Check if product exists
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Product not found</h1>
            <Link href="/products" className="mt-4 inline-block text-blue-600 hover:text-blue-500">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Return the JSX for the product detail page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/products" className="text-blue-600 hover:text-blue-500">
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg">
              {/* Image placeholder */}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {/* <p className="mt-2 text-sm text-gray-500">{product.category}</p> */}
              <p className="mt-4 text-2xl font-bold text-gray-900">RS {product.price}</p>
              
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
                <p className="mt-2 text-gray-600">{product.specification}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Features</h2>
                <ul className="mt-2 list-disc list-inside text-gray-600">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 space-y-4">
                <button 
                onClick={() => addToCart(product)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

// Function to generate static paths for dynamic routes
export async function getStaticPaths() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await axios.get(`${baseUrl}/api/products`);
  const products = res.data;
  const paths = products.map((product) => ({
    params: { id: String(product.id) },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
}

// Function to fetch static props for the product detail page
export async function getStaticProps({ params }) {
  const { id } = params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await axios.get(`${baseUrl}/api/products`);
  const products = res.data;
  const product = products.find((product) => product.id === Number(id));
  return {
    props: { product },
  };
}
