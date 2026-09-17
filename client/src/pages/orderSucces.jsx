import React, { useEffect, useRef } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { useLocation, Link } from "react-router-dom";
import Invoice from "../Components/Invoice";

const OrderSuccessPage = () => {
  const invoiceRef = useRef();
  const location = useLocation();
  const {
    orderNumber,
    products,
    shippingMethod,
    shippingCharge,
    total,
    customer,
  } = location.state || {};

  const displayShippingCharge =
    shippingCharge !== undefined
      ? Number(shippingCharge).toFixed(2)
      : shippingMethod === "Inside Dhaka"
        ? "70.00"
        : shippingMethod === "Outside Dhaka"
          ? "130.00"
          : "0.00";

  useEffect(() => {
    if (window.fbq && orderNumber && customer) {
      // Prepare advanced matching parameters
      const advancedMatching = {
        em: customer.email ? customer.email?.toLowerCase().trim() : undefined,
        fn: customer.name ? customer.name?.toLowerCase().trim() : undefined,

        ph: customer.phoneNumber
          ? customer.phoneNumber?.replace(/\D/g, "")
          : undefined, // Remove non-numeric characters
        external_id: customer?.id || undefined, // Unique customer ID (if available)
        user_agent: navigator?.userAgent || undefined, // Capture user agent
      };

      // Remove undefined fields
      Object.keys(advancedMatching).forEach(
        (key) =>
          advancedMatching[key] === undefined && delete advancedMatching[key],
      );

      window.fbq("track", "Purchase", {
        value: total || 0,
        currency: "BDT", // Change currency if needed
        contents: products?.map((product) => ({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
        content_type: "product",
        ...advancedMatching, // Include advanced matching parameters
      });
    }
  }, [orderNumber, total, products, customer]);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${orderNumber || "Order"}`,
  });

  return (
    <div className="bg-root">
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <FaRegCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase! Your order number is{" "}
            <span className="font-semibold">#{orderNumber || "N/A"}</span>. You
            will receive an email confirmation shortly with your order details.
          </p>

          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-white rounded-md font-medium hover:bg-yellow-600 transition"
              onClick={handlePrint}
            >
              Download Invoice
            </button>
            <Link to="/shop">
              <button className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition">
                Continue Shopping
              </button>
            </Link>
          </div>

          <div className="mt-12 border-t pt-6 text-left">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Order Summary
            </h2>
            <div className="space-y-2">
              {products &&
                products.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-gray-600"
                  >
                    <span>{product.name}</span>
                    <span>
                      {(product.price * product.quantity).toFixed(2)} ৳
                    </span>
                  </div>
                ))}
              <div className="flex justify-between text-gray-600">
                <span>Shipping ({shippingMethod || "Standard"})</span>
                <span>{displayShippingCharge} ৳</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-700">
                <span>Total</span>
                <span>{total ? Number(total).toFixed(2) : "N/A"} ৳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Component (hidden, only used for printing) */}
        <div className="hidden">
          <Invoice
            billingInfo={customer}
            invoiceNumber={orderNumber}
            ref={invoiceRef}
            orderNumber={orderNumber}
            products={products}
            shippingMethod={shippingMethod}
            shippingCharge={shippingCharge}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
