import React, { useState } from "react";
import { Link } from "react-router-dom";

const EnginOilCard = ({ img, link, title, discription }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-full group">
      <Link
        to={link || "#"}
        className="w-full h-full flex flex-col justify-between items-center rounded-xl p-2.5 sm:p-3 md:p-3.5 bg-[#121b27]/80 hover:bg-[#182434] border border-white/10 hover:border-primary/50 transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-lg md:hover:shadow-primary/5 cursor-pointer"
      >
        {/* Brand Logo Container */}
        <div className="w-full bg-white rounded-lg sm:rounded-xl flex items-center justify-center p-2 sm:p-2.5 md:p-3 h-[65px] sm:h-[75px] md:h-[85px] lg:h-[95px] overflow-hidden">
          {img && !hasError ? (
            <img
              className="max-h-[44px] sm:max-h-[52px] md:max-h-[62px] lg:max-h-[68px] max-w-[85%] w-auto h-auto object-contain block mx-auto transition-transform duration-300 group-hover:scale-105"
              src={img}
              alt={title || "Brand Logo"}
              onError={() => setHasError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center text-gray-800 font-bold text-xs sm:text-sm md:text-base tracking-wider uppercase select-none">
              {title || "Brand"}
            </div>
          )}
        </div>

        {/* Brand Name */}
        <p
          className="text-white text-xs sm:text-sm md:text-base font-semibold text-center mt-2 sm:mt-2.5 mb-1 line-clamp-1 w-full px-1 group-hover:text-primary transition-colors duration-200"
          title={title}
        >
          {title}
        </p>

        {/* View Details CTA */}
        <div className="flex items-center justify-center gap-1 text-primary text-[11px] sm:text-xs md:text-sm font-medium whitespace-nowrap mt-auto pt-0.5">
          <span>View Details</span>
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </div>
      </Link>
    </div>
  );
};

export default EnginOilCard;
