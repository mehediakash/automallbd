import React, { useEffect, useState } from "react";
import axios from "./Axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules"; // Import from modules
import ServerLink from "./Serverlink";
import "swiper/swiper-bundle.css";
import EnginOilCard from "./EnginOilCard";

const EngineOil = () => {
  const [brands, setBrands] = useState([]);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("/brand/all");
        setBrands(response.data.brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="bg-root py-20">
      <div className="container relative mx-auto flex flex-wrap justify-start border border-[rgba(225,225,225,0.25)] pt-10 px-10 rounded-lg">
        <div className="absolute top-[-5%] left-[50%] translate-x-[-50%] bg-root py-3 px-5">
          <h2 className="text-white text-2xl">Our Brand</h2>
        </div>

        {/* Swiper Slider */}
        <Swiper
          spaceBetween={30}
          slidesPerView={2} // Default for mobile
          breakpoints={{
            // Responsive breakpoints
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
          {brands.map((brand) => (
            <SwiperSlide key={brand._id} className="flex flex-col gap-y-5">
              <EnginOilCard
              link={`/brandshop/${brand._id}`}
                discription={brand.description || "No description available"}
                title={brand.title}
                img={`${ServerLink}${brand.photo.replace("\\", "/")}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default EngineOil;
