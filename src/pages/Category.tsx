import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Notebook, Layers, ShoppingBag } from 'lucide-react';

// Define TypeScript interfaces
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface Category {
  id: number;
  category_name: string;
  parent_id: number | null;
  products_count?: number;
  children?: Category[];
}

const CategoriesDisplay: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>('https://api.tamkeen.center/api/categories');
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchCategoryProducts = async (categoryId: number) => {
    try {
      setProductLoading(true);
      const response = await axios.get<Product[]>(`https://api.tamkeen.center/api/categories/${categoryId}/products`);
      setSelectedCategoryProducts(response.data);
      setProductLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setProductLoading(false);
    }
  };

  const renderCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'book':
        return <Book className="w-10 h-10 text-sky-600" />;
      case 'notebooks':
        return <Notebook className="w-10 h-10 text-sky-500" />;
      default:
        return <Layers className="w-10 h-10 text-sky-400" />;
    }
  };

  const handleViewProducts = (category: Category) => {
    setSelectedCategory(category);
    fetchCategoryProducts(category.id);
  };

  const closeProductModal = () => {
    setSelectedCategory(null);
    setSelectedCategoryProducts([]);
  };

  // Select only top-level categories
  const topLevelCategories = categories.filter(category => category.parent_id === null);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-sky-50">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-sky-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-sky-600 text-white px-6 py-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Product Categories
            </h1>
            <p className="mt-2 text-sky-100">
              Explore our comprehensive range of product categories
            </p>
          </div>

          <div className="p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topLevelCategories.map(category => (
                <div 
                  key={category.id} 
                  className="bg-white border-2 border-sky-100 rounded-2xl shadow-lg hover:shadow-2xl hover:border-sky-200 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {renderCategoryIcon(category.category_name)}
                      <h2 className="ml-4 text-2xl font-bold text-sky-800 capitalize">
                        {category.category_name}
                      </h2>
                    </div>

                    <div className="space-y-3 text-gray-600">
                      {category.products_count !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sky-700">Total Products</span>
                          <span className="bg-sky-100 text-sky-800 px-2 py-1 rounded-full text-xs">
                            {category.products_count}
                          </span>
                        </div>
                      )}

                      {/* {category.children && category.children.length > 0 && (
                       
                      )} */}

                      <button 
                        onClick={() => handleViewProducts(category)}
                        className="w-full mt-4 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center"
                      >
                        <ShoppingBag className="mr-2 w-5 h-5" />
                        View Products
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-11/12 md:w-3/4 lg:w-2/3 max-h-[80vh] overflow-y-auto">
              <div className="bg-sky-600 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {selectedCategory.category_name} Products
                </h2>
                <button 
                  onClick={closeProductModal}
                  className="text-white hover:text-sky-200"
                >
                  Close
                </button>
              </div>

              {productLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
                </div>
              ) : (
                <div className="p-6">
                  {selectedCategoryProducts.length === 0 ? (
                    <p className="text-center text-gray-500">No products found in this category.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {selectedCategoryProducts.map(product => (
                        <div 
                          key={product.id} 
                          className="bg-sky-50 p-4 rounded-lg border border-sky-100 hover:shadow-md transition-shadow"
                        >
                          <h3 className="text-lg font-semibold text-sky-800 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {product.description || 'No description available'}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sky-700 font-bold">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesDisplay;