import React, { useEffect, useState } from "react";
import axios from "./Axios";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // Import modules
import "swiper/swiper-bundle.css";
import ServerLink from "./Serverlink";

const Product = () => {
  const [products, setProducts] = useState([]);

  // Fetch data from both endpoints
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categoryResponse = await axios.get("/category/getCategory");
        const subCategoryResponse = await axios.get("/category/getSubCategory");
  
        // Combine products from categories and subcategories
        const categories = categoryResponse.data.Categories || [];
        const subCategories = subCategoryResponse.data.subCategories || [];
  
        // Flatten all products into a single array
        const allProducts = [
          ...categories.flatMap((category) => category.product || []),
          ...subCategories.flatMap((subCategory) => subCategory.product || [])
        ];
  
        // Debug: Log products to check if `photo` is populated correctly
        console.log(allProducts);
  
        setProducts(allProducts.reverse());
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);
  
  // Group products into chunks of 3 for SwiperSlide
  const chunkedProducts = [];
  for (let i = 0; i < products.length; i += 3) {
    chunkedProducts.push(products.slice(i, i + 3));
  }
  console.log( {chunkedProducts})

  return (
    <>
      <div className="bg-root py-20">
        <div className="container relative mx-auto flex flex-wrap justify-start border border-[rgba(225,225,225,0.25)] pt-10 px-10 rounded-lg">
          <div className="absolute top-[0%] left-[50%] translate-y-[-50%] translate-x-[-50%] bg-root py-3 px-5">
            <h2 className="text-white text-2xl">New Arrivals</h2>
          </div>

          {/* Swiper Slider */}
          <Swiper
            spaceBetween={30}
            slidesPerView={1} // Default for mobile
            breakpoints={{
              640: {
                slidesPerView: 2, // Mobile view
              },
              768: {
                slidesPerView: 4, // Tablets
              },
              1024: {
                slidesPerView: 4, // Larger screens
              },
            }}
            navigation={false}
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            className="mySwiper relative pb-10 md:pb-20"
          >
            {/* Dynamically create SwiperSlides */}
           
            {chunkedProducts?.map((chunk, index) => (
              <SwiperSlide key={index} className="flex flex-col gap-y-5">
                {chunk?.map((product) => (
                  <ProductCard
                    id={product._id}
                    product={product}
                    key={product._id}
                    title={product.title}
                    size={product.size}
                    description={product.description}
                    img={`${ServerLink}${product.photo[0]}`}
                    price={product.price}
                  />
                ))}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default Product;
