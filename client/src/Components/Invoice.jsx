import React, { forwardRef } from "react";

const Invoice = forwardRef(
  (
    {
      billingInfo,
      products,
      subtotal,
      taxRate,
      total,
      invoiceNumber,
      shippingMethod,
      shippingCharge,
    },
    ref,
  ) => {
    const formattedShipping =
      shippingCharge !== undefined
        ? `${Number(shippingCharge).toFixed(2)} ৳`
        : shippingMethod === "Inside Dhaka"
          ? "70.00 ৳"
          : shippingMethod === "Outside Dhaka"
            ? "130.00 ৳"
            : "0.00 ৳";

    return (
      <div ref={ref} className="p-8 bg-white max-w-2xl mx-auto">
        {/* Invoice Header */}
        <h1 className="text-2xl font-bold mb-4">Invoice #{invoiceNumber}</h1>

        {/* Billing Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-1">Billing Information</h2>
          <p className="text-gray-800 font-medium">{billingInfo?.name}</p>
          {billingInfo?.district && (
            <p className="text-gray-700">
              <span className="font-semibold">District:</span>{" "}
              {billingInfo.district}
            </p>
          )}
          <p className="text-gray-700">{billingInfo?.streetAddress}</p>
          <p className="text-gray-600">Email: {billingInfo?.email}</p>
          {billingInfo?.phoneNumber && (
            <p className="text-gray-600">Phone: {billingInfo.phoneNumber}</p>
          )}
        </div>

        {/* Product Details */}
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Product</th>
              <th className="py-2 px-4 border-b text-center">Size</th>
              <th className="py-2 px-4 border-b text-center">Quantity</th>
              <th className="py-2 px-4 border-b text-right">Price</th>
              <th className="py-2 px-4 border-b text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b text-center">
                  {product.size || "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {product.quantity}
                </td>
                <td className="py-2 px-4 border-b text-right">
                  {Number(product.price || 0).toFixed(2)} ৳
                </td>
                <td className="py-2 px-4 border-b text-right">
                  {(Number(product.price || 0) * product.quantity).toFixed(2)} ৳
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="mt-6 text-right space-y-1">
          <p className="font-medium text-gray-700">
            Shipping Charge ({shippingMethod || "Standard"}):{" "}
            {formattedShipping}
          </p>
          <p className="font-bold text-lg text-gray-900">
            Total: {total !== undefined ? Number(total).toFixed(2) : "0.00"} ৳
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">Thank you for your purchase!</p>
        </div>
      </div>
    );
  },
);

export default Invoice;
