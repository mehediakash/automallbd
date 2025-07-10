import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, InputNumber, Tabs, Spin } from "antd";
import { ShoppingCartOutlined, HeartOutlined } from "@ant-design/icons";
import Slider from "react-slick";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import axios from "../Components/Axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from "../Components/ProductCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../Components/store/slices/cartSlice";
import ServerLink from "../Components/Serverlink";
import { trackEvent } from "../Components/FacebookPixel"; // Import Facebook Pixel Event

const { TabPane } = Tabs;

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/product/singelproduct/${id}`);
        setProduct(response.data.product);
        setSelectedSize(response.data.product?.size[0]); 

        if (response.data.product?.category?._id) {
          const relatedResponse = await axios.get(
            `/category/getCategory/${response.data.product.category._id}`
          );
          setRelatedProducts(relatedResponse.data.category.product || []);
        }

        // **🔥 Fire ViewContent Event when Product Loads**
        if (response.data.product) {
          trackEvent("ViewContent", {
            content_name: response.data.product.title,
            content_category: response.data.product.category?.name || "Unknown",
            content_ids: [response.data.product._id],
            currency: "BDT",
            value: response.data.product.price,
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center mt-20 text-white">Product not found</div>;
  }

  const {
    title,
    details,
    price,
    discountPrice,
    description,
    photo,
    category,
    subCategory,
    size,
  } = product;

  const sliderSettings = {
    dots: true,
    infinite: photo.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      dispatch(
        addToCart({
          _id: id,
          name: title,
          size: selectedSize,
          quantity: quantity,
          image: `${ServerLink}${photo[0]}`,
          price: price,
        })
      );
      trackEvent("AddToCart", {
        content_name: title,
        content_category: category?.name || "Unknown",
        content_ids: [id],
        currency: "BDT",
        value: price,
      });
      trackEvent("InitiateCheckout", {
        content_name: title,
        content_category: category?.name || "Unknown",
        content_ids: [id],
        currency: "BDT",
        value: price * quantity,
        num_items: quantity,
      });
    } else {
      alert("Please select a size.");
    }
  };



  return (
    <div className="bg-root">
      <div className="container mx-auto p-6 mt-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <a href="/" className="hover:underline">Home</a> &gt;
          <a href={`/category/${category?._id}`} className="hover:underline">
            {category?.name}
          </a> &gt;
          <span className="text-white">{title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Slider {...sliderSettings}>
              {photo.map((img, index) => (
                <Zoom key={index}>
                  <img
                    src={`${ServerLink}${img}`}
                    alt={`Product ${index}`}
                    className="w-full h-auto cursor-pointer"
                  />
                </Zoom>
              ))}
            </Slider>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>

            <div className="text-3xl font-semibold text-red-600 mt-4">
              {price} TK
              {discountPrice && (
                <span className="text-gray-500 line-through"> {discountPrice} TK</span>
              )}
            </div>

            <div className="mt-6 text-white">
              <h3 className="text-lg font-bold">Available Sizes:</h3>
              <ul className="list-none mt-2">
                {size.map((s, index) => (
                  <Button
                    key={index}
                    className={`mt-1 ml-1 ${selectedSize === s ? "bg-primary" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </ul>
            </div>

            <div className="flex items-center mt-6">
              <InputNumber
                min={1}
                max={10}
                value={quantity}
                onChange={setQuantity}
                className="mr-4"
              />
              <Button
                onClick={handleAddToCart}
                className="bg-primary text-white"
                icon={<ShoppingCartOutlined />}
              >
                Add to Cart
              </Button>
              <Link to="/checkout">
                <Button
                onClick={
                  handleAddToCart}
                  className="ml-4"
                  type="default"
                  icon={<HeartOutlined />}
                >
                  Buy it Now
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-sm text-white">
              <p>Category: {category?.name}</p>
              <p>Sub-Category: {subCategory?.name}</p>
            </div>

            <div className="mt-4 text-white">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>
        </div>

        <div className="mt-12 !text-white">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Description" key="1">
              <div className="!text-white mt-4" dangerouslySetInnerHTML={{ __html: details }} />
            </TabPane>
          </Tabs>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl text-white font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  title={relatedProduct.title}
                  discription={relatedProduct.description}
                  img={`${ServerLink}${relatedProduct.photo[0]}`}
                  price={relatedProduct.price}
                  id={relatedProduct._id}
                />
              ))
            ) : (
              <p className="text-white">No related products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
