import React, { forwardRef } from "react";

const Invoice = forwardRef(({ billingInfo, products, subtotal, taxRate, total, invoiceNumber ,shippingMethod }, ref) => {
  console.log(billingInfo)

  return (
    <div ref={ref} className="p-8 bg-white max-w-2xl mx-auto">
      {/* Invoice Header */}
      <h1 className="text-2xl font-bold mb-4">Invoice #{invoiceNumber}</h1>


      {/* Billing Information */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Billing Information</h2>
        <p>{billingInfo?.name}</p>
        <p>{billingInfo?.streetAddress}</p>
        <p>Email: {billingInfo?.email}</p>
      </div>

      {/* Product Details */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Product</th>
            <th className="py-2 px-4 border-b">size</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.size}</td>
              <td className="py-2 px-4 border-b">{product.quantity}</td>
              <td className="py-2 px-4 border-b">{product.price?.toFixed(2)} ৳</td>
              <td className="py-2 px-4 border-b">{(product.price * product.quantity)?.toFixed(2)} ৳</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="mt-6 text-right">
        <p className="font-semibold">Shiping Charge:  {shippingMethod === "standard"
                    ? "60.00 ৳"
                    : "150.00 ৳"} </p>
        <p className="font-bold text-lg">Total: {total.toFixed(2)} ৳</p>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-500">Thank you for your purchase!</p>
      </div>
    </div>
  );
});

export default Invoice;
