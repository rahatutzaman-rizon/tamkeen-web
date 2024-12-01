import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaClock, 
  FaWhatsapp, 
  FaMapMarkerAlt, 
  FaStar, 
  FaUser,
  FaShoppingBag,
  FaMapMarker
} from "react-icons/fa";
import { IoStorefront } from "react-icons/io5";

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: 'https://api.tamkeen.center/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor to add token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('authToken'); // Use js-cookie to get token
  console.log('Request Token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Types for Store and Products
interface Store {
  id: number;
  store_name: string;
  location: string;
  type: string;
  working_hours: string;
  image: string;
  store_email: string;
  store_phone: string;
  followers?: number;
  rating?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

const StoreDetails: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  
  // State management
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch store details and products
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        setIsLoading(true);
        
        // Fetch store details
        const storeResponse = await api.get(`/stores/${storeId}`);
        console.log('Store Details Response:', storeResponse.data);
        setStore(storeResponse.data.data);

        // Fetch store products (adjust endpoint as needed)
        const productsResponse = await api.get(`/stores/${storeId}/products`);
        console.log('Store Products Response:', productsResponse.data);
        setProducts(productsResponse.data.data);

        setIsLoading(false);
      } catch (err: any) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Failed to fetch store details');
        setIsLoading(false);
      }
    };

    if (storeId) {
      fetchStoreDetails();
    }
  }, [storeId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex flex-col items-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-xl text-gray-600">Loading Store Details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // No store found
  if (!store) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <FaMapMarker className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Store Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        {/* Store Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="md:flex">
            {/* Store Image */}
            <div className="md:w-1/2">
              <img 
                src={store.image || '/default-store.jpg'} 
                alt={store.store_name}
                className="w-full h-80 object-cover"
              />
            </div>
            
            {/* Store Details */}
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {store.store_name}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <IoStorefront className="mr-3 text-2xl text-primary" />
                <span className="text-lg">{store.type || 'General Store'}</span>
              </div>
              
              <div className="flex space-x-4">
                <button className="btn btn-primary text-white flex items-center">
                  <FaShoppingBag className="mr-2" /> Shop Now
                </button>
                <button className="btn btn-outline btn-primary flex items-center">
                  <FaWhatsapp className="mr-2" /> Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Store Information Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Detailed Store Info */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <FaMapMarkerAlt className="mr-3 text-primary" /> 
              Store Details
            </h2>
            <div className="space-y-4">
              {[
                { 
                  icon: <FaEnvelope className="text-blue-500" />, 
                  label: 'Email',
                  text: store.store_email  
                },
                { 
                  icon: <FaClock className="text-green-500" />, 
                  label: 'Working Hours',
                  text: store.working_hours || 'Hours Not Specified' 
                },
                { 
                  icon: <FaWhatsapp className="text-green-600" />, 
                  label: 'Phone',
                  text: store.store_phone 
                },
                { 
                  icon: <FaMapMarkerAlt className="text-red-500" />, 
                  label: 'Location',
                  text: store.location 
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                  {item.icon}
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <span className="text-gray-800 font-medium">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Statistics */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
              <FaStar className="mr-3 text-primary" /> 
              Store Statistics
            </h2>
            <div className="space-y-4">
              {[
                { 
                  icon: <FaUser className="text-purple-500" />, 
                  label: 'Followers', 
                  value: store.followers?.toString() || 'N/A' 
                },
                { 
                  icon: <FaStar className="text-yellow-500" />, 
                  label: 'Rating', 
                  value: store.rating || '0.00' 
                }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {stat.icon}
                    <span className="text-gray-700">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-gray-900 bg-primary/10 px-3 py-1 rounded-full">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Store Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <p className="text-gray-500 text-xl">No products available</p>
                </div>
              </div>
            ) : (
              products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <button className="btn btn-sm btn-primary">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;