import React from "react";
import servicesAdd from "../assets/servicesAdd/services.png";
const ServicesAdd = () => {
  return (
    <>
      <div className=" mx-auto w-full  ">
        <picture>
          <img
            src={servicesAdd}
            className="md:w-full md:h-fit w-full h-full block p-0 m-0 relative"
            alt="servicess Add"
          />
        </picture>
      </div>
    </>
  );
};

export default ServicesAdd;
