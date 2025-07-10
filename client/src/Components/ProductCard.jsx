import React from "react";
import { CiShoppingCart } from "react-icons/ci";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCart } from '../Components/store/slices/cartSlice';
import { trackEvent } from "../Components/FacebookPixel"; // Import Pixel Event Function

// import { addToCart } from '../Components/store/slices/cartSlice'; 

const ProductCard = ({ title, discription,size, price, img, id,product }) => {
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    // Add to Cart Function
    dispatch(
      addToCart({
        _id: id,
        name: title,
        size: size,
        quantity: 1,
        image: img,
        price: price,
      })
    );

    // Track Facebook Pixel Event
    trackEvent("AddToCart", {
      content_name: title,
      content_category: "Product",
      content_ids: [id],
      currency: "BDT",
      value: price,
    });
  };

 
  return (
    <div className=" rounded-md max-w-[280px] overflow-hidden group relative mt-5">
      <img className=" rounded-md" src={img} alt="product" />
      <Link to={`/product/${id}`}>
      <h1 className="text-white mt-5 mb-2 text-base">{title}</h1>
      </Link>
      <p className="text-white text-sm">{discription}</p>

      <p className=" mt-2 font-medium text-base text-primary flex items-center gap-x-1">
        {price} <TbCurrencyTaka size={18} />
      </p>

      <div className="bg-white py-4 w-full h-[70%] px-2 absolute bottom-0 left-[0] transition-transform duration-300 -translate-y-[-101%] border-red-300 border group-hover:translate-y-[0%] ">
        <h1 className="text-black mt-5 font-medium mb-2 text-base ">{title}</h1>
        {/* <p className="!text-white text-sm font-medium hover:text-primary transition-colors">
          {discription}
        </p> */}

        <p className=" mt-2 font-bold  text-primary text-base">{price} TK</p>
        <div className="flex  justify-between items-center mt-5">
          <Link to={`/product/${id}`}>
            <button  className="bg-root hover:bg-primary md:w-[100px] md:h-[100px] w-[70px] h-[70px]  transition-colors rounded-full px-4 py-1 text-white font-medium  text-center ">
              Buy Now
            </button>
          </Link>

          <div  onClick={handleAddToCart}className="bg-gray-300 cursor-pointer w-[50px] h-[50px] flex rounded-full justify-center items-center text-black hover:bg-primary    font-bold hover:text-white transition-colors ">
            <CiShoppingCart size={25} className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
