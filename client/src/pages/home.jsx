import React from "react";
import Banner from "../Components/Banner";
import BannerAdd from "../Components/BannerAdd";
import EngineOil from "../Components/EngineOil";
import ServicesAdd from "../Components/ServicesAdd";
import Product from "../Components/Product";
import Facebookchatbot from "../Components/Facebookchatbot";

const home = () => {
  return (
    <>
      <Banner />
      <BannerAdd />
      <EngineOil />
      {/* <ServicesAdd /> */}
      <Product />
      
      
    </>
  );
};

export default home;
