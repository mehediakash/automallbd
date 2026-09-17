import React, { useEffect } from "react";
import AboutBanners from "../Components/AboutBanner";
import AboutInfos from "../Components/AboutInfo";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <AboutBanners />
      <AboutInfos />
    </>
  );
};

export default About;
