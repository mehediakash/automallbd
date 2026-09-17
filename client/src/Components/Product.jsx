import React, { useEffect, useState } from "react";
import axios from "./Axios";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { getImageUrl } from "./Serverlink";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from authoritative endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/product/allproduct");
        if (response.data.success && Array.isArray(response.data.data)) {
          const rawProducts = response.data.data;
          // Deduplicate by _id to guarantee each unique product appears only once
          const seenIds = new Set();
          const uniqueProducts = [];
          for (let i = rawProducts.length - 1; i >= 0; i--) {
            const p = rawProducts[i];
            if (p && p._id && !seenIds.has(p._id.toString())) {
              seenIds.add(p._id.toString());
              uniqueProducts.push(p);
            }
          }
          setProducts(uniqueProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="bg-root py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="relative border border-[rgba(225,225,225,0.2)] rounded-xl sm:rounded-2xl pt-7 pb-4 px-3 sm:pt-9 sm:pb-6 sm:px-5 md:pt-12 md:pb-8 md:px-8">
          {/* Centered Section Title Header Badge */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-root px-4 sm:px-6 py-0.5 sm:py-1 whitespace-nowrap z-10">
            <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
              New Arrivals
            </h2>
          </div>

          {/* Desktop Navigation Arrows */}
          <button
            className="new-arrivals-prev hidden md:flex absolute top-1/2 -left-4 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-root/90 border border-white/20 text-white hover:bg-primary hover:border-primary items-center justify-center transition-all shadow-lg cursor-pointer"
            aria-label="Previous Products"
          >
            &#10094;
          </button>
          <button
            className="new-arrivals-next hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-root/90 border border-white/20 text-white hover:bg-primary hover:border-primary items-center justify-center transition-all shadow-lg cursor-pointer"
            aria-label="Next Products"
          >
            &#10095;
          </button>

          {/* Swiper Slider */}
          <Swiper
            spaceBetween={12}
            slidesPerView={2}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 14,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 18,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            navigation={{
              prevEl: ".new-arrivals-prev",
              nextEl: ".new-arrivals-next",
            }}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination, Autoplay]}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="mySwiper relative pb-10 sm:pb-12"
          >
            {products.map((product) => (
              <SwiperSlide key={product._id} className="h-auto pb-1">
                <ProductCard
                  id={product._id}
                  product={product}
                  title={product.title}
                  size={product.size}
                  description={product.description}
                  img={getImageUrl(product.photo?.[0])}
                  price={product.price}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Product;
