import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchStores } from "../services/services";
import { FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";

const StoreGrid = () => {
  const { data: stores, isLoading } = useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: fetchStores,
  });

  return (
    <div className="container min-h-screen px-4 sm:px-10 md:px-20 py-10 mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isLoading ? (
          // Skeleton loader for each store card
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card rounded-lg border border-gray-300 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-10 items-center p-4">
                <div className="w-full md:w-1/4 flex flex-col gap-3">
                  <div className="skeleton h-8 bg-gray-200 rounded"></div>
                  <div className="skeleton h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="skeleton h-5 bg-gray-200 rounded w-2/4"></div>
                  <div className="skeleton h-5 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="w-full md:w-3/4">
                  <div className="skeleton h-[240px] bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stores?.map((store: any) => (
            <Link
              key={store.id}
              to={`/stores/${store.id}`}
              className="card rounded-lg border border-gray-300 overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/4 pl-8 p-4 flex flex-col gap-3">
                  <h2 className="text-gray-900 text-2xl">{store.store_name}</h2>
                  <p className="text-gray-900 text-sm flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    {store.location}
                  </p>
                  <p className="text-gray-900 text-sm flex items-center">
                    <FaBriefcase className="mr-1" />
                    {store.type}
                  </p>
                  <p className="text-gray-900 text-sm flex items-center">
                    <FaClock className="mr-1" />
                    {store.working_hours}
                  </p>
                </div>
                <div className="w-full md:w-3/4">
                  <img
                    src={store.image || "https://via.placeholder.com/600"}
                    alt={store.store_name}
                    className="object-cover h-[240px] md:h-[320px] w-full"
                  />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default StoreGrid;
