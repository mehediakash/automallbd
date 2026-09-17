import React from "react";
import { CiShoppingCart } from "react-icons/ci";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Components/store/slices/cartSlice";
import { trackEvent } from "../Components/FacebookPixel";

const ProductCard = ({
  title,
  discription,
  description,
  size,
  price,
  img,
  id,
  product,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        _id: id,
        name: title,
        size: size,
        quantity: 1,
        image: img,
        price: price,
      }),
    );

    trackEvent("AddToCart", {
      content_name: title,
      content_category: "Product",
      content_ids: [id],
      currency: "BDT",
      value: price,
    });
  };

  const productDescription = description || discription;

  return (
    <div className="w-full max-w-[280px] mx-auto rounded-xl overflow-hidden group relative bg-[#121b27]/60 hover:bg-[#182434] border border-white/10 hover:border-primary/40 transition-all duration-300 p-2 sm:p-2.5 md:p-3 flex flex-col justify-between">
      {/* Product Image */}
      <div className="w-full aspect-square bg-[#0c131c] rounded-lg overflow-hidden relative flex items-center justify-center">
        <Link to={`/product/${id}`} className="w-full h-full block">
          <img
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            src={img}
            alt={title || "Product"}
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="w-full mt-2 sm:mt-2.5 flex flex-col">
        <Link to={`/product/${id}`}>
          <h3
            className="text-white font-medium text-xs sm:text-sm md:text-base line-clamp-1 hover:text-primary transition-colors"
            title={title}
          >
            {title}
          </h3>
        </Link>

        {productDescription && (
          <p className="text-gray-400 text-[11px] sm:text-xs line-clamp-1 mt-0.5">
            {productDescription}
          </p>
        )}

        <p className="mt-1 font-bold text-xs sm:text-sm md:text-base text-primary flex items-center gap-0.5">
          <span>{price}</span>{" "}
          <TbCurrencyTaka className="text-base sm:text-lg" />
        </p>
      </div>

      {/* Slide-up Action Drawer on Desktop / Hover */}
      <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-2.5 w-full absolute bottom-0 left-0 transition-transform duration-300 translate-y-[102%] group-hover:translate-y-0 rounded-b-xl border-t border-primary/20 shadow-lg flex flex-col justify-between z-10">
        <h4 className="text-black font-semibold text-[11px] sm:text-xs md:text-sm line-clamp-1 mb-0.5">
          {title}
        </h4>
        <p className="font-bold text-primary text-xs sm:text-sm mb-1.5">
          {price} TK
        </p>
        <div className="flex items-center justify-between gap-1.5">
          <Link to={`/product/${id}`} className="flex-1">
            <button className="w-full bg-root hover:bg-primary py-1 sm:py-1.5 px-2 text-[11px] sm:text-xs font-semibold text-white rounded-full transition-colors text-center">
              Buy Now
            </button>
          </Link>
          <button
            onClick={handleAddToCart}
            className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 hover:bg-primary text-black hover:text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
            title="Add to Cart"
          >
            <CiShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
