import React, { useEffect, useState } from "react";
import banner1 from "../assets/banner/banner3-1.webp";
import banner2 from "../assets/banner/banner3-2.webp";
import { Link } from "react-router-dom";
import axios from "./Axios"
import serverlink from "./Serverlink"
const BannerAdd = () => {

  const [secondBannerLeft, setSecondBannerLeft] = useState()
  const [secondBannerRight, setSecondBannerRight] = useState()
  useEffect(()=>{
    const fatchBanner = async () =>{
      let res = await axios.get("banner/all")
      let banneradd = res.data.banners.filter((secondBannerLeft)=>
      secondBannerLeft.position == "SecondBannerLeft"
      )
      let rightBannerAdd = res.data.banners.filter((secondBannerRight) =>
      secondBannerRight.position == "SecondBannerRight"
      )
      setSecondBannerLeft(banneradd)
      setSecondBannerRight(rightBannerAdd)

      console.log(banneradd)
      console.log(rightBannerAdd)
    }
    fatchBanner()
  },[])
  return (
    <div className="bg-root">
      <div className="container mx-auto justify-between gap-x-20 md:gap-y-0 gap-y-5 flex md:flex-row flex-col md:pt-20 pt-10">
        
          <picture className="md:w-[48%] transition-all duration-300 hover:scale-105 cursor-pointer md:mb-0 pb-10">
            {secondBannerLeft?.map((item)=>(
              <Link to={item.link}>
            <img className="rounded-xl" src={`${serverlink}${item.photo[0]}`} alt="banner1" />
             </Link>
            ))}
          </picture>
       
          <picture className="md:w-[48%]  h-auto relative z-0 rounded-lg  transition-all duration-300 hover:scale-105 cursor-pointer">
            {secondBannerRight?.map((item)=>
            <Link to={item.link}>
            <img className="rounded-xl" src={`${serverlink}${item.photo[0]}`} alt="banner1" />
            </Link>
            )}
          </picture>
       
      </div>
    </div>
  );
};

export default BannerAdd;
