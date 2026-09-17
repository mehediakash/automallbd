import React, { useEffect } from "react";
import MapConatacts from "../Components/MapConatacts";
import ContactInfo from "../Components/ContactInfo";
import BradCumbs from "../Components/BradCumbs";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <BradCumbs title={"Contact Us"} />
      <MapConatacts />
      <ContactInfo />
    </>
  );
};

export default Contact;
