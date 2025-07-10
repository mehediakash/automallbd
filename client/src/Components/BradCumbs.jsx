import React from "react";


const BradCumbs = ({ title, className }) => {
  return (
    <section className={`py-7 mt-5 md:mt-10 sm:py-10 md:py-14 ${className ? className : ""}`}>
      <div className="flex items-center justify-center">
        <h3 className="text-[24px] md:text-[28px] text-center font-medium inline-block">
          {title}
        </h3>
      </div>
    </section>
  );
};

export default BradCumbs;
