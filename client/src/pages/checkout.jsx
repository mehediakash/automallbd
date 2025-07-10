import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../Components/Axios";
import { resetCart } from "../Components/store/slices/cartSlice";

const CheckoutPage = () => {
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
  });
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const products = useSelector((state) => state.orebiReducer.products);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateSubtotal = () => {
    const productTotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const shippingCost = shippingMethod === "standard" ? 0 : 0;
    return productTotal + shippingCost;
  };

  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.streetAddress) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const shippingCost = shippingMethod === "standard" ? 0 : 0;
    const productTotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
    const totalAmount = productTotal + shippingCost;
  
    try {
      setLoading(true);
  
      // Store product IDs to send as orderNumber
      const productIds = [];
  
      // Loop through each product and send individual requests
      for (const product of products) {
        const payload = {
          product: product._id,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          streetAddress: formData.streetAddress,
          size: product.size,
          quantity: product.quantity,
          totalPrice: (product.price * product.quantity).toFixed(2) ,
        };
  
        // Send the POST request for each product
        await axios.post("/order/createOrder", payload);
  
        // Add product ID to the productIds array
        productIds.push(product._id);
        dispatch(resetCart())
      }
  
      setLoading(false);
  
      // Navigate to the order success page with product IDs as orderNumber
      navigate("/orderSucces", {
        state: {
          orderNumber: productIds, // Pass product IDs
          products,
          shippingMethod,
          total: totalAmount,
          
          customer: formData, // Pass customer details

        },
      });
    } catch (error) {
      setLoading(false);
      console.error("Error placing order:", error.response?.data || error.message);
      alert("Failed to place the order. Please try again.");
    }
  };
  
  
  
  

  return (
    <div className="bg-root">
      <div className="container mx-auto py-12 px-6 mt-10">
        <h1 className="text-3xl font-semibold mb-8 text-center text-white">
          Checkout
        </h1>

        <div className="lg:flex lg:gap-12">
          {/* Left: Billing and Shipping Info */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Billing Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="Your full name"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="your@gmail.com"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="01608371000"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                    placeholder="House: 08, Road no: 1, Kaderabad housing, Mohammadpur, Dhaka"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="standard-shipping"
                    type="radio"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
                  />
                  <label
                    htmlFor="standard-shipping"
                    className="ml-3 text-sm font-medium text-gray-700"
                  >
                    Inside Dhaka - 00 Taka
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="express-shipping"
                    type="radio"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                    className="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300"
                  />
                  <label
                    htmlFor="express-shipping"
                    className="ml-3 text-sm font-medium text-gray-700"
                  >
                    Outside Dhaka - 00 Taka
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary and Payment */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 mt-5">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {products.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <p className="text-gray-700">{item.name}</p>
                        <p className="text-gray-500">
                          {item.price.toFixed(2)} ৳ x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {(item.price * item.quantity).toFixed(2)} ৳
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4 space-y-4">
                <div className="flex justify-between text-gray-700">
                  <p>Shipping</p>
                  <p>{shippingMethod === "standard" ? "00" : "00"} ৳</p>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-800">
                  <p>Total</p>
                  <p>{calculateSubtotal().toFixed(2)} ৳</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white shadow-md rounded-lg p-6 ">
              <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
              <div>
                <p>Cash on Delivery</p>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 w-full bg-primary text-white py-3 rounded-md text-lg font-medium hover:bg-primary transition"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
