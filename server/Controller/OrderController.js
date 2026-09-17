const orderModel = require("../model/orderModel");
const ejs = require("ejs");
const path = require("path");
const sendEmail = require("../utils/sendEmail");
const uploadProductModel = require("../model/uploadProductModel");
const { calculateShipping } = require("../utils/districts");

async function createOrder(req, res) {
  try {
    const {
      product,
      phoneNumber,
      quantity,
      totalPrice,
      streetAddress,
      email,
      size,
      color,
      name,
      district,
      shippingCharge: clientShippingCharge,
    } = req.body;

    // Validate Bangladesh district
    const shippingCalc = calculateShipping(district);
    if (!shippingCalc.isValid) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid district from Bangladesh.",
      });
    }

    // Determine final shipping charge server-side to prevent tampering
    // If client explicitly passed 0 for subsequent products in a multi-item cart, allow 0;
    // otherwise use the server-calculated rate (70 for Dhaka, 130 for outside Dhaka).
    const finalShippingCharge =
      clientShippingCharge !== undefined && Number(clientShippingCharge) === 0
        ? 0
        : shippingCalc.shippingCharge;

    const productDetails = await uploadProductModel.find({
      _id: { $in: product },
    });

    const unitPrice =
      productDetails.length > 0 && productDetails[0].price
        ? Number(productDetails[0].price)
        : 0;

    const finalTotalPrice =
      unitPrice > 0
        ? Number(
            (unitPrice * Number(quantity) + finalShippingCharge).toFixed(2),
          )
        : Number(totalPrice || 0);

    const newOrder = new orderModel({
      product,
      quantity,
      phoneNumber,
      totalPrice: finalTotalPrice,
      streetAddress,
      district: shippingCalc.district,
      shippingMethod: shippingCalc.shippingMethod,
      shippingCharge: finalShippingCharge,
      size: size || "",
      color: color || "",
      email,
      name,
    });
    await newOrder.save();

    try {
      const invoiceTemplatePath = path.join(
        __dirname,
        "../views/invoiceTemplate.ejs",
      );
      const invoiceHtml = await ejs.renderFile(invoiceTemplatePath, {
        order: { ...newOrder.toObject(), product: productDetails },
        email,
      });

      await sendEmail(email, "Your Order Invoice", invoiceHtml);
      await sendEmail(
        "automallbdltd@gmail.com",
        "New Order Invoice",
        invoiceHtml,
      );
    } catch (emailErr) {
      console.error(
        "Order invoice email dispatch error (order saved):",
        emailErr.message,
      );
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function getAllOrder(req, res) {
  try {
    const orders = await orderModel.find().populate("product");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function getBrandById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id).populate("product");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
      error: error.message,
    });
  }
}

async function editOrder(req, res) {
  try {
    const { id } = req.params; // Order ID
    const {
      name,
      streetAddress,
      quantity,
      totalPrice,
      status,
      district,
      shippingMethod,
      shippingCharge,
      phoneNumber,
      email,
    } = req.body;

    const updateFields = {
      name,
      totalPrice,
      streetAddress,
      quantity,
      status,
    };

    if (district !== undefined) updateFields.district = district;
    if (shippingMethod !== undefined)
      updateFields.shippingMethod = shippingMethod;
    if (shippingCharge !== undefined)
      updateFields.shippingCharge = Number(shippingCharge);
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
    if (email !== undefined) updateFields.email = email;

    // Update the order in the database
    const updatedOrder = await orderModel
      .findByIdAndUpdate(id, updateFields, { new: true })
      .populate("product"); // Populate product details

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If the status has been updated, send an email notification
    if (status) {
      const statusUpdateTemplatePath = path.join(
        __dirname,
        "../views/statusUpdateTemplate.ejs",
      );

      const statusUpdateHtml = await ejs.renderFile(statusUpdateTemplatePath, {
        order: updatedOrder,
        status,
      });

      await sendEmail(
        updatedOrder.email,
        "Your Order Status Update",
        statusUpdateHtml,
      );
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update order", error: error.message });
  }
}

async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const deletedOrder = await orderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
}

module.exports = {
  createOrder,
  getAllOrder,
  editOrder,
  deleteOrder,
  getBrandById,
};
