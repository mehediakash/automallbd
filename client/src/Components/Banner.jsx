import React, { useEffect, useState } from "react";
import axios from "./Axios"; // For API calls
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules"; // Import from modules
import ServerLink, { getImageUrl } from "./Serverlink";
import { Link } from "react-router-dom";
const Banner = () => {
  const [banners, setBanners] = useState([]);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("banner/all");
        const mainBanners = response.data.banners.filter(
          (banner) => banner.position === "MainBanner",
        );
        setBanners(mainBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="relative mx-auto overflow-hidden md:mt-[56px] mt-[43px]">
      {/* Swiper Banner Slider */}
      <Swiper
        modules={[Navigation, Autoplay]} // Use Swiper modules here
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }} // Use these classes for custom styling
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        className="h-full"
      >
        {banners.map((banner) => {
          const desktopPhoto = banner.photo?.[0] || banner.desktopPhoto || "";
          const mobilePhoto =
            banner.mobilePhoto ||
            (banner.photo && banner.photo.length > 1
              ? banner.photo[1]
              : null) ||
            desktopPhoto;

          return (
            <SwiperSlide key={banner._id}>
              <div className="banner-item relative w-full overflow-hidden">
                <Link to={banner.link}>
                  <picture>
                    {mobilePhoto && (
                      <source
                        media="(max-width: 767px)"
                        srcSet={getImageUrl(mobilePhoto)}
                      />
                    )}
                    <img
                      src={getImageUrl(desktopPhoto)}
                      alt={`Banner ${banner._id}`}
                      className="w-full h-auto block"
                    />
                  </picture>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}

        <div className="swiper-button-prev custom-swiper-button text-primary"></div>
        <div className="swiper-button-next custom-swiper-button text-primary"></div>
      </Swiper>
    </div>
  );
};

export default Banner;
