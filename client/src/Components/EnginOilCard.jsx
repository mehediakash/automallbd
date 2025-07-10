import React from "react";
import { Link } from "react-router-dom";

const EnginOilCard = ({ img, link, title, discription }) => {
  return (
    <div className="slider-item w-full cursor-pointer">
      <Link to={link}>
        <div className="bg-white px-10 py-20 rounded-md">
          <picture>
            <img className="mx-auto" src={img} alt="Mobil Oil" />
          </picture>
        </div>
        <p className="text-white text-base text-center my-1">{title}</p>
        <h2 className="text-primary font-medium text-xl text-center">
        View Details
        </h2>
      </Link>
    </div>
  );
};

export default EnginOilCard;
