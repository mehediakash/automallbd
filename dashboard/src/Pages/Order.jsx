import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import axios from "../Components/Axios";
import logoImage from "../assets/White.png";

const Order = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/order/getOrder");
      console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleEdit = (record) => {
    console.log(record);
    setCurrentOrder(record);
    form.setFieldsValue({
      name: record.name,
      phoneNumber: record.phoneNumber,
      email: record.email,
      district: record.district,
      shippingMethod: record.shippingMethod,
      shippingCharge: record.shippingCharge,
      streetAddress: record.streetAddress,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/order/deleteOrder/${id}`);
      message.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to delete order");
      console.error("Error deleting order:", error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      await axios.put(`/order/editOrder/${currentOrder?._id}`, {
        ...currentOrder, // spread existing order details to preserve unchanged fields
        ...values, // override with updated values from the form
      });

      message.success("Order updated successfully");
      setIsModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order");
      console.error("Error updating order:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/order/editOrder/${orderId}`, { status: newStatus });
      message.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  const handlePrintInvoice = async (order) => {
    try {
      const response = await axios.get(`/order/getOrder/${order._id}`);
      const anOrder = response.data.order;

      const invoiceWindow = window.open("");

      const invoiceHTML = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
              .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .invoice-header h1 { margin: 0; }
              .invoice-details { margin-bottom: 20px; }
              .invoice-details p { margin: 5px 0; }
              .invoice-products { width: 100%; border-collapse: collapse; margin-top: 20px; }
              .invoice-products th, .invoice-products td { border: 1px solid #eee; padding: 10px; text-align: center; }
              .invoice-total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="invoice-box">
            <img src=${logoImage}></img>
              <div class="invoice-header">
              
                <h1>Invoice</h1>
                <div>
                  <p><strong>Order ID:</strong> ${anOrder?._id}</p>
                  <p><strong>Date:</strong> ${new Date(anOrder?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div class="invoice-details">
                <p><strong>Name:</strong> ${anOrder?.name}</p>
                <p><strong>Phone:</strong> ${anOrder?.phoneNumber}</p>
                <p><strong>Email:</strong> ${anOrder?.email}</p>
                <p><strong>District:</strong> ${anOrder?.district || "N/A"}</p>
                <p><strong>Shipping Method:</strong> ${anOrder?.shippingMethod || "Standard"} (${anOrder?.shippingCharge ?? 0} TK)</p>
                <p><strong>Address:</strong> ${anOrder?.streetAddress}</p>
              </div>
              <table class="invoice-products">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${anOrder?.product?.title || "N/A"}</td>
                    <td>${anOrder?.size || "N/A"}</td>
                    <td>${anOrder?.quantity || 1}</td>
                    <td>${anOrder?.product?.price || "N/A"}</td>
                    <td>${anOrder?.totalPrice || "N/A"}</td>
                  </tr>
                </tbody>
              </table>
              <div class="invoice-total">
                <p style="font-size: 14px; font-weight: normal; color: #555;"><strong>Shipping Charge:</strong> ${anOrder?.shippingCharge ?? 0} TK</p>
                <p><strong>Total Price:</strong> ${anOrder?.totalPrice} TK</p>
              </div>
            </div>
          </body>
        </html>
      `;

      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();

      invoiceWindow.onload = () => {
        invoiceWindow.print();
        invoiceWindow.close();
      };
    } catch (error) {
      console.error("Error printing invoice:", error);
    }
  };

  const columns = [
    {
      title: "SR",
      dataIndex: "index",
      key: "sr",
      render: (text, record, index) => <a>{index + 1}</a>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Product Name",
      dataIndex: ["product", "title"],
      key: "productName",
      render: (text) => <a>{text || "N/A"}</a>,
    },
    {
      title: "Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    // {
    //   title: "Color Name",
    //   dataIndex: ["product", "color"],
    //   key: "colorName",
    //   render: (text) => <a>{text || "N/A"}</a>,
    // },
    {
      title: "Size",
      dataIndex: ["product", "size"],
      key: "size",
    },
    {
      title: "Customer & Address",
      dataIndex: "streetAddress",
      key: "streetAddress",
      render: (text, record) => (
        <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
          <p>
            <strong>Name:</strong> {record.name}
          </p>
          <p>
            <strong>Phone:</strong> {record.phoneNumber}
          </p>
          <p>
            <strong>Email:</strong> {record.email}
          </p>
          <p>
            <strong>District:</strong>{" "}
            <span style={{ color: "#1890ff", fontWeight: 600 }}>
              {record.district || "N/A"}
            </span>
          </p>
          <p>
            <strong>Address:</strong> {record?.streetAddress}
          </p>
        </div>
      ),
    },
    {
      title: "Shipping",
      key: "shipping",
      render: (text, record) => (
        <div style={{ fontSize: "12px" }}>
          <p style={{ fontWeight: 600 }}>
            {record.shippingMethod || "Standard"}
          </p>
          <p style={{ color: "#888" }}>৳{record.shippingCharge ?? 0}</p>
        </div>
      ),
    },
    {
      width: "10%",
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Select
          className="w-[100%]"
          value={record.status} // Show current status
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Delivered", value: "delivered" },
            { label: "Shipped", value: "shipped" },
            { label: "Canceled", value: "canceled" },
          ]}
        />
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
          <Button type="primary" onClick={() => handlePrintInvoice(record)}>
            Print Invoice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Edit Order"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={currentOrder}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phoneNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="District" name="district">
            <Input />
          </Form.Item>
          <Form.Item label="Shipping Method" name="shippingMethod">
            <Input />
          </Form.Item>
          <Form.Item label="Shipping Charge" name="shippingCharge">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Address" name="streetAddress">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Order;
