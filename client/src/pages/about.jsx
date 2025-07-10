import React, { useEffect } from "react";
import AboutBanners from "../components/AboutBanner";
import AboutInfos from "../components/AboutInfo";

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
