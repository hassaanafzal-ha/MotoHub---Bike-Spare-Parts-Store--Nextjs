// Import Link from Next.js for client-side navigation
import Link from 'next/link';
// Import Navbar component
import Navbar from '../../components/Navbar';
// Import axios for HTTP requests
import axios from 'axios';

// Define the Categories component
export default function Categories({categories}) {
  // Return the JSX for the categories page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories Header */}
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">Browse Categories</h1>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Map through categories */}
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                {/* Category Name */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{category.name}</h2>
                {/* Category Description */}
                <p className="text-gray-600 mb-4">{category.description}</p>
                
                {/* Subcategories Section (currently commented out) */}
                <div className="mb-4">
                  {/* <h3 className="text-sm font-medium text-gray-900 mb-2">Subcategories:</h3> */}
                  <div className="flex flex-wrap gap-2">
                  </div>
                </div>

                {/* View Products Link */}
                <Link
                  href={`/categories/${category.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Products
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Function to fetch static props for the categories page
export async function getStaticProps(){
  // Get categories from API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await axios.get(`${baseUrl}/api/categories`);
  const categories = res.data;
  
  // Return 404 if no categories found
  if(!categories){
    return {
      notFound: true,
    }
  }
  
  // Return categories with revalidation
  return {
    props: {
      categories
    },
    revalidate: 10,
  }
}