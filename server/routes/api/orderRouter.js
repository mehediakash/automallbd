const express = require("express");
const { createOrder, getAllOrder, editOrder, deleteOrder, getBrandById } = require("../../Controller/OrderController");
const _ = express.Router()


_.post('/createOrder', createOrder)
_.get('/getOrder', getAllOrder)
_.get('/getOrder/:id', getBrandById)
_.put("/editOrder/:id", editOrder);
_.delete("/deleteOrder/:id", deleteOrder);



module.exports = _