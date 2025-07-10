import React from "react";

const MapConatacts = () => {
  return (
    <div className="">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d322.78365567621546!2d90.36061925034849!3d23.751651538157663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjPCsDQ1JzA2LjIiTiA5MMKwMjEnMzguNiJF!5e0!3m2!1sen!2sbd!4v1739104855615!5m2!1sen!2sbd"
        className="w-full h-[180px] sm:h-[300px] lg:h-[500px]"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>


    </div>
  );
};

export default MapConatacts;
