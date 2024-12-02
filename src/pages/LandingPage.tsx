import shoes from "../assets/blue sneakers.png";
import sofa from "../assets/sofa.png";
import toyTrain from "../assets/toyTrain.png";
import decor from "../assets/Decor.png";
import hats from "../assets/Hats.png";
import jewelry from "../assets/jewelry.png";
import ProductCard from "../components/ProductCard";

import { FaArrowRightLong } from "react-icons/fa6";
import NewArrivalProducts from "../components/NewArrival";
import AboutUs from "./AboutUs";
import { Link } from "react-router-dom";
import coloredBuckets from "../assets/coloredBuckets.png";
import PricingCard from "../components/PricingCard";
import {
  addToMyCoupons,
  fetchCoupons,
  fetchPricing,
  fetchTestimonials,
  getBestSelling,
  getFlashSales,

} from "../services/services";
import { useQuery } from "@tanstack/react-query";
import LoadingCard from "../components/LoadingCard";
import Testimonials from "../components/Testimonials";
import CouponCard from "../components/CouponCard";
import { useState } from "react";
import { authAtom } from "../atoms/authAtom";
import { useAtom } from "jotai";

const LandingPage = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [authState] = useAtom(authAtom);

  const handleShowToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
  };

  const bentoGrid = [
    {
      id: 1,
      class: "md:col-span-2 bg-[#d4edf8] rounded-xl flex-col md:flex-row", // Span 2 columns on medium+ screens, stack vertically on small screens
      img: shoes,
      title: "Clothing & Shoes",
      button: "bg-[#0A73A1] text-white hover:bg-[#0A73A1]",
      subtitle: "SNEAKERS",
    },
    {
      id: 2,
      class: "bg-[#EEEEEE] rounded-xl flex-col col-span-1", // One column by default
      img: sofa,
      title: "Home & Living",
      subtitle: "SOFA",
    },
    {
      id: 3,
      class: "bg-[#FEF9C4] rounded-xl flex-col col-span-1", // One column by default
      img: toyTrain,
      title: "Toys & Entertainment",
      subtitle: "TOY TRAIN",
    },
    {
      id: 4,
      class: "md:col-span-2 bg-[#f2e7e3] rounded-xl flex-col md:flex-row", // Span 2 columns on medium+ screens
      img: decor,
      title: "Toys & Entertainment",
      button: "bg-[#A46E1C] text-white hover:bg-[#A46E1C]",
      subtitle: "Decor",
    },
    {
      id: 5,
      class: "bg-[#E3F2E6] rounded-xl flex-col col-span-1", // One column by default
      img: hats,
      title: "Toys & Entertainment",
      subtitle: "PARTY DECORS",
    },
    {
      id: 6,
      class: "bg-[#FAE8E8] rounded-xl flex-col col-span-1", // One column by default
      img: jewelry,
      title: "Jewelry & Accessories",
      subtitle: "DIAMOND",
    },
  ];

  const { data: pricing, isLoading: isPricingLoading } = useQuery({
    queryKey: ["pricing"],
    queryFn: fetchPricing,
  });

  const { data: coupons, isLoading: isCouponsLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: fetchCoupons,
  });

  const { data: testimonials, isLoading: isTestimonialsLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });

  // const { data: packages, isLoading: isPackagesLoading } = useQuery({
  //   queryKey: ["packages"],
  //   queryFn: getPackages,
  // });

  const { data: bestSelling, isLoading: isBestSellingLoading } = useQuery({
    queryKey: ["bestSelling"],
    queryFn: getBestSelling,
  });

  console.log(bestSelling);
  

  const { data: flashSales, isLoading: isFlashSalesLoading } = useQuery({
    queryKey: ["flashSales"],
    queryFn: getFlashSales,
  });

  console.log(flashSales);
  

  return (
    <div className="flex flex-col gap-24 mt-28 sm:mt-28">
      <section className=" flex flex-col items-center gap-6">
        <p className="text-3xl text-primary">Monthly string values</p>
        <p className="text-gray-500">
          Making monthly purchases through our different investment packages
        </p>
        <div className="flex flex-wrap justify-center w-full gap-4 mt-10">
          {isPricingLoading
            ? Array(3).fill(<LoadingCard />)
            : pricing?.map((item: any) => <PricingCard {...item} />)}
        </div>
      </section>

      {/* Hero Section */}
      <section className="container max-w-7xl flex flex-col items-center p-6 sm:p-10 gap-6 ">
        <p className="text-3xl sm:text-5xl max-w-3xl leading-normal font-bold text-center">
          Shop everything you need online from the US businesses{" "}
          <p className="text-primary">you love</p>
        </p>
        <p className="text-gray-400">And for a limited time only...</p>
        <Link
          className="btn btn-primary text-white rounded-full px-12 sm:px-20"
          to={"/signup"}
        >
          Join The Tamkeen
        </Link>
        <Link to="/categories" className="btn btn-link text-black">
          Shop all products
        </Link>
      </section>

      <section className="container flex flex-col gap-10">
        <div className="md:flex px-4 sm:px-20">
          <p className="sm:text-5xl text-3xl font-black">
            WE REVOLUTIONIZE SHOPPING ONLINE
          </p>
          <div className="flex flex-col gap-4 ">
            <p>
              Lorem ipsum dolor sit amet consectetur. Quis vitae cras lacus orci
              enim id imperdiet. Purus sit aliquet donec sagittis scelerisque.
            </p>
            <div className="flex gap-2">
              <button className="btn btn-primary text-white">
                Shop Now <FaArrowRightLong />{" "}
              </button>
              <button className="btn btn-primary btn-outline">
                Learn more <FaArrowRightLong />
              </button>
            </div>
          </div>
        </div>
        <div className="w-full">
          <img className="w-full" src={coloredBuckets} alt="" />
        </div>
      </section>

      {/* <section className="container px-4 sm:px-20 flex flex-col gap-10 items-center mx-auto">
        <div className="w-full flex items-start justify-start">
          <p className="text-lg sm:text-xl text-primary">Savings baskets</p>
        </div>
        <div className="flex flex-wrap gap-6 place-items-start w-full"> */}
          {/* {isPackagesLoading
            ? Array(5).fill(
                <div className="flex w-64 flex-col gap-4">
                  <div className="skeleton h-32 w-full"></div>
                  <div className="skeleton h-4 w-28"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              )
            : packages?.map((basket: any) => <BasketCard {...basket} />)} */}
        {/* </div>
        <div>
          <Link to="/categories" className="btn btn-primary text-white">
            View all Baskets
          </Link>
        </div>
      </section> */}

      <section className="container px-4 sm:px-20 flex flex-col gap-10 items-center mx-auto">
        <div className="w-full flex items-start justify-start">
          <p className="text-lg sm:text-xl text-primary">Best Selling </p>
        </div>
        <div className="flex flex-wrap gap-6  place-items-start w-full">
          {isBestSellingLoading
            ? Array(4).fill(<LoadingCard />)
            : bestSelling?.map((product: any) => <ProductCard {...product} />)}
        </div>
        <div>
          <Link to="/categories" className="btn btn-primary text-white">
            View all Products
          </Link>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="container max-w-7xl sm:px-10 h-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bentoGrid.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col p-4 sm:p-8 justify-between items-center ${item.class} `}
            >
              <div className="flex flex-col justify-around">
                <div>
                  <p>{item.title}</p>
                  <p className="text-2xl sm:text-4xl text-gray-500 font-semibold">
                    {item.subtitle}
                  </p>
                </div>
                {item.button && (
                  <Link  to='/categories/17' className={`btn ${item.button} mt-4`}>
                    Shop Now<FaArrowRightLong />
                  </Link>
                )}
              </div>
              <div className="flex justify-center">
                <img
                  src={item.img}
                  alt={item.subtitle}
                  className="max-w-full h-auto object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container px-4 sm:px-20 flex flex-col gap-10 items-center mx-auto">
        <div className="w-full flex items-start justify-start">
          <p className="text-lg sm:text-xl text-primary">Flash Sales</p>
        </div>
        <div className="flex flex-wrap gap-6  place-items-start w-full">
          {isFlashSalesLoading
            ? Array(4).fill(<LoadingCard />)
            : flashSales?.map((product: any) => <ProductCard {...product} />)}
        </div>
        <div>
          <Link to="/flashSale" className="btn btn-primary text-white">
            View all Products
          </Link>
        </div>
      </section>

      {authState.isAuthenticated && (
        <section className="container px-4 sm:px-20 flex flex-col gap-10 items-center mx-auto">
          <h2 className="text-lg sm:text-xl text-primary">Available Coupons</h2>
          <div className="flex flex-wrap gap-6 place-items-start w-full">
            {isCouponsLoading
              ? Array(4).fill(
                  <div className="card p-10 border">
                    <div className=" flex w-52 flex-col gap-4 ">
                      <div className="flex items-center gap-4">
                        <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                        <div className="flex flex-col gap-4">
                          <div className="skeleton h-4 w-20"></div>
                          <div className="skeleton h-4 w-28"></div>
                        </div>
                      </div>
                      <div className="skeleton h-4 w-full"></div>
                      <div className="skeleton h-4 w-full"></div>
                      <div className="skeleton h-4 w-full"></div>
                    </div>
                  </div>
                )
              : coupons?.map((coupon: Coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    onSave={(type: string, id: number) =>
                      addToMyCoupons(type, id).then((message) => {
                        handleShowToast(message);
                        return message;
                      })
                    }
                  />
                ))}
          </div>
        </section>
      )}

      <section>
        {" "}
        <p className="text-primary text-center text-3xl">
          Latest Products
        </p>{" "}
        <NewArrivalProducts />
      </section>

      <AboutUs />

      <section className=" container gap-10">
        {isTestimonialsLoading ? (
          Array(4).fill(
            <div className="card p-10 border">
              <div className=" flex w-52 flex-col gap-4 ">
                <div className="flex items-center gap-4">
                  <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                  <div className="flex flex-col gap-4">
                    <div className="skeleton h-4 w-20"></div>
                    <div className="skeleton h-4 w-28"></div>
                  </div>
                </div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            </div>
          )
        ) : (
          <Testimonials testimonials={testimonials} />
        )}
      </section>
      {showToast && (
        <div className="toast toast-bottom toast-center min-w-96 z-50">
          <div className="alert bg-primary text-white">
            <div>
              <span>{toastMessage}</span>
            </div>
            <div className="cursor-pointer" onClick={() => setShowToast(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
