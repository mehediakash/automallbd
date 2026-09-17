const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  name: {
    type: String,
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: [true, "phone Number is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
  },
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Delivered", "Cancelled"],
    default: "Pending",
  },
  streetAddress: {
    type: String,
    required: [true, "Address must be is required"],
  },
  district: {
    type: String,
    required: [true, "District is required"],
  },
  shippingMethod: {
    type: String,
    required: [true, "Shipping method is required"],
  },
  shippingCharge: {
    type: Number,
    required: [true, "Shipping charge is required"],
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
