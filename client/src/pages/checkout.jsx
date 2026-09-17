import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../Components/Axios";
import { resetCart } from "../Components/store/slices/cartSlice";
import DistrictSelect from "../Components/DistrictSelect";
import { calculateShipping } from "../constants/districts";
import { FaTruck, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    district: "",
    streetAddress: "",
  });
  const [districtError, setDistrictError] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const products = useSelector((state) => state.orebiReducer.products);
  const navigate = useNavigate();

  // Dynamically calculate shipping based on selected district
  const shippingInfo = calculateShipping(formData.district);
  const shippingCost = shippingInfo.shippingCharge;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDistrictChange = (district) => {
    setFormData({ ...formData, district });
    if (district) {
      setDistrictError(false);
    }
  };

  const calculateProductTotal = () => {
    return products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );
  };

  const productTotal = calculateProductTotal();
  const grandTotal = productTotal + shippingCost;

  const handlePlaceOrder = async () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.streetAddress
    ) {
      alert("Please fill in all required billing information fields.");
      return;
    }

    if (!formData.district || !formData.district.trim()) {
      setDistrictError(true);
      alert("Please select your district to calculate shipping.");
      return;
    }

    if (products.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      // Store product IDs to send as orderNumber
      const productIds = [];

      // Loop through each product and send individual requests
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        // Apply full shipping to the first item; 0 for subsequent items in a multi-item cart
        const itemShipping = i === 0 ? shippingCost : 0;
        const itemTotal =
          Number(product.price * product.quantity) + itemShipping;

        const payload = {
          product: product._id,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          district: formData.district,
          shippingMethod: shippingInfo.shippingMethod,
          shippingCharge: itemShipping,
          streetAddress: formData.streetAddress,
          size: product.size || "",
          color: product.color || "",
          quantity: product.quantity,
          totalPrice: itemTotal.toFixed(2),
        };

        // Send the POST request for each product
        await axios.post("/order/createOrder", payload);

        // Add product ID to the productIds array
        productIds.push(product._id);
      }

      dispatch(resetCart());
      setLoading(false);

      // Navigate to the order success page with full order details
      navigate("/orderSucces", {
        state: {
          orderNumber: productIds,
          products,
          shippingMethod: shippingInfo.shippingMethod,
          shippingCharge: shippingCost,
          total: grandTotal,
          customer: formData,
        },
      });
    } catch (error) {
      setLoading(false);
      console.error(
        "Error placing order:",
        error.response?.data || error.message,
      );
      alert(
        error.response?.data?.message ||
          "Failed to place the order. Please try again.",
      );
    }
  };

  return (
    <div className="bg-root min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 mt-10">
        <h1 className="text-3xl font-semibold mb-8 text-center text-white">
          Checkout
        </h1>

        <div className="lg:flex lg:gap-12">
          {/* Left: Billing and Shipping Info */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" /> Billing Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2.5"
                    placeholder="Your full name"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2.5"
                    placeholder="your@gmail.com"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2.5"
                    placeholder="01608371000"
                  />
                </div>

                {/* District Selection Dropdown */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    District <span className="text-red-500">*</span>
                  </label>
                  <DistrictSelect
                    value={formData.district}
                    onChange={handleDistrictChange}
                    error={districtError}
                  />
                  {districtError && (
                    <p className="mt-1 text-xs text-red-600">
                      Please select your district to calculate shipping charge.
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Street / Detailed Shipping Address{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm p-2.5"
                    placeholder="House: 08, Road no: 1, Area / Thana, Landmark"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaTruck className="text-primary" /> Shipping Method
              </h2>
              <p className="text-xs text-gray-500 mb-4">
                Shipping method and charge are automatically calculated based on
                your selected district.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Inside Dhaka Option */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all relative ${
                    shippingInfo.isDhaka
                      ? "border-primary bg-red-50/50 shadow-sm"
                      : "border-gray-200 bg-gray-50 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          Inside Dhaka
                        </span>
                        {shippingInfo.isDhaka && (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-primary text-white px-2 py-0.5 rounded-full font-medium">
                            <FaCheckCircle className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Only for Dhaka district
                      </p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">৳70</span>
                  </div>
                </div>

                {/* Outside Dhaka Option */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all relative ${
                    formData.district && !shippingInfo.isDhaka
                      ? "border-primary bg-red-50/50 shadow-sm"
                      : "border-gray-200 bg-gray-50 opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          Outside Dhaka
                        </span>
                        {formData.district && !shippingInfo.isDhaka && (
                          <span className="inline-flex items-center gap-1 text-[11px] bg-primary text-white px-2 py-0.5 rounded-full font-medium">
                            <FaCheckCircle className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        All other 63 districts across Bangladesh
                      </p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      ৳130
                    </span>
                  </div>
                </div>
              </div>

              {!formData.district && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs flex items-center gap-2">
                  <span>ℹ️</span>
                  <span>
                    Please select your district above to apply the shipping
                    rate.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary and Payment */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 mt-5 lg:mt-0">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {products.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </p>
                        {item.size && (
                          <p className="text-xs text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {item.price.toFixed(2)} ৳ × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      {(item.price * item.quantity).toFixed(2)} ৳
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <p>Subtotal</p>
                  <p className="font-medium text-gray-800">
                    {productTotal.toFixed(2)} ৳
                  </p>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <div>
                    <p>Shipping</p>
                    {formData.district ? (
                      <span className="text-[11px] text-gray-400">
                        ({shippingInfo.shippingMethod} - {formData.district})
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-600">
                        (Select district)
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-800">
                    {formData.district
                      ? `${shippingCost.toFixed(2)} ৳`
                      : "0.00 ৳"}
                  </p>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <p>Total</p>
                  <p className="text-primary">{grandTotal.toFixed(2)} ৳</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Payment Information
              </h2>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between">
                <span className="font-medium text-gray-700 text-sm">
                  Cash on Delivery
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                  Available
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 w-full bg-primary text-white py-3 rounded-md text-lg font-medium hover:opacity-95 transition disabled:opacity-50 shadow-md"
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
