// Import axios for HTTP requests
import axios from 'axios';
// Import Link from Next.js for client-side navigation
import Link from 'next/link';
// Import Navbar component
import Navbar from '../../../components/Navbar';
// Import useCart hook from CartContext
import { useCart } from '../../../context/CartContext';

// Define the CategoryPage component
export default function CategoryPage({ categoryName, products }) {
  // Get addToCart function from CartContext
  const { addToCart } = useCart();
  
  // Return the JSX for the category page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link and Category Header */}
        <div className="mb-8">
          <Link href="/categories" className="text-blue-600 hover:text-blue-500">
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{categoryName}</h1>
        </div>

        {/* Empty State or Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">No products found in this category</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Map through products */}
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* Product Image Placeholder */}
                  <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200 rounded-lg mb-4">
                    {/* Image Placeholder */}
                  </div>
                  {/* Product Name Link */}
                  <Link href={`/products/${product.id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600">{product.name}</h3>
                  </Link>
                  {/* Product Price */}
                  <p className="mt-2 text-gray-500">RS {product.price}</p>
                  {/* Product Actions */}
                  <div className="mt-4 space-y-2">
                    {/* Add to Cart Button */}
                    <button onClick={() => addToCart(product)}
                     className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                      Add to Cart
                    </button>
                    {/* View Details Link */}
                    <Link
                      href={`/products/${product.id}`}
                      className="block w-full text-center border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Function to generate static paths for dynamic routes
export async function getStaticPaths() {
  try {
    // Fetch all categories
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await axios.get(`${baseUrl}/api/categories`);
    const categories = res.data;
    // Generate paths for each category
    const paths = categories.map((cat) => ({
      params: { id: String(cat.id)},
    }));

    return {
      paths,
      fallback: 'blocking', // return 404 if category not found
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

// Function to fetch static props for each category page
export async function getStaticProps({ params }) {
  const { id } = params;

  try {
    // Fetch category details
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const categoryRes = await axios.get(`${baseUrl}/api/categories/${id}`);
    const categoryData = categoryRes.data;

    // Fetch all products
    const productsRes = await axios.get(`${baseUrl}/api/products`);
    const allProducts = productsRes.data;

    // Filter products by category ID
    const filteredProducts = allProducts.filter(
      (product) => String(product.category) === id
    );

    return {
      props: {
        categoryName: categoryData.name || 'Category',
        products: filteredProducts,
      },
      revalidate: 60, // ISR: Revalidate every 60 sec
    };
  } catch (error) {
    console.error('Error fetching category/products:', error);
    return {
      props: {
        categoryName: 'Category',
        products: [],
      },
      revalidate: 60,
    };
  }
}
