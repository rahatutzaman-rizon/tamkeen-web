


import { useQuery } from "@tanstack/react-query";
import Filter from "../components/Filter";
import ProductCard from "../components/ProductCard";
import { fetchCategories } from "../services/services";
import { useEffect, useState, useMemo } from "react";
import LoadingCard from "../components/LoadingCard";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      category_id: params.get("category_id")?.split(",").map(Number) || [],
      min_price: params.get("min_price") || "",
      max_price: params.get("max_price") || "",
      color: params.get("color") || "",
      size: params.get("size") || "",
    });
  }, [location.search]);

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [filters, setFilters] = useState<{
    category_id: number[];
    min_price: string;
    max_price: string;
    color: string;
    size: string;
  }>({
    category_id: [],
    min_price: "",
    max_price: "",
    color: "",
    size: "",
  });

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        
        const response = await axios.get('https://api.tamkeen.center/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setProductData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProductData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtered products based on applied filters
  const filteredProducts = useMemo(() => {
    if (!productData || productData.length === 0) return [];

    return productData.filter(product => {
      // Category filter
      const categoryMatch = filters.category_id.length === 0 || 
        filters.category_id.includes(product.category_id);

      // Price filter
      const minPriceMatch = !filters.min_price || 
        parseFloat(product.price) >= parseFloat(filters.min_price);
      const maxPriceMatch = !filters.max_price || 
        parseFloat(product.price) <= parseFloat(filters.max_price);

      // Color filter
      const colorMatch = !filters.color || 
        product.color.toLowerCase() === filters.color.toLowerCase();

      // Size filter
      const sizeMatch = !filters.size || 
        product.size.toUpperCase() === filters.size.toUpperCase();

      return categoryMatch && minPriceMatch && maxPriceMatch && 
             colorMatch && sizeMatch;
    });
  }, [productData, filters]);

  const handleCategoryClick = (id: number) => {
    const isChildCategory = childCategories.some(
      (child: any) => child.id === id
    );

    if (isChildCategory) {
      setFilters((prevFilters: any) => {
        const updatedCategoryIds = prevFilters.category_id.includes(id)
          ? prevFilters.category_id.filter((catId: any) => catId !== id)
          : [...new Set([...prevFilters.category_id, id])];

        if (!updatedCategoryIds.includes(activeCategory)) {
          return {
            ...prevFilters,
            category_id: [...new Set([...updatedCategoryIds, activeCategory])],
          };
        }

        return {
          ...prevFilters,
          category_id: updatedCategoryIds,
        };
      });
    } else {
      setActiveCategory(id);
      setFilters((prevFilters) => {
        const isActive = prevFilters.category_id.includes(id);
        const updatedCategoryIds = isActive
          ? prevFilters.category_id.filter((catId) => catId !== id)
          : [...new Set([...prevFilters.category_id, id])];

        return {
          ...prevFilters,
          category_id: updatedCategoryIds,
        };
      });
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams();
    
    if (filters.category_id?.length > 0) {
      searchParams.append("category_id", filters.category_id.join(","));
    }
    
    if (filters.min_price) searchParams.append("min_price", filters.min_price);
    if (filters.max_price) searchParams.append("max_price", filters.max_price);
    if (filters.color) searchParams.append("color", filters.color);
    if (filters.size) searchParams.append("size", filters.size);
  
    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    });
  }, [filters, navigate, location.pathname]);
  
  const selectedParentCategory = categories?.find(
    (category: any) => category.id === activeCategory
  );
  const childCategories = selectedParentCategory?.children || [];

  return (
    <div className="container mx-auto px-6 py-12 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="md:col-span-1">
          <Filter
            isLoading={isCategoriesLoading}
            categories={categories}
            onCategoryClick={handleCategoryClick}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
        <div className="md:col-span-3">
          {childCategories?.length > 0 && (
            <div className="flex space-x-4 mb-6">
              {childCategories.map((child: any) => (
                <button
                  key={child.id}
                  onClick={() => handleCategoryClick(child.id)}
                  className={`py-2 px-4 rounded-lg ${
                    filters.category_id.includes(child.id)
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {child.category_name}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading ? (
              Array(9).fill(<LoadingCard />)
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <ProductCard key={product.title} {...product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-xl">
                Product not found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;


