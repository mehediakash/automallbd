import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Upload,
  Table,
  Modal,
  message,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "../Components/Axios";
import ServerLink from "../Components/ServerLink";


const AddBrand = () => {
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("brand/all");
      setBrands(response.data.brands);
    } catch (error) {
      message.error("Failed to fetch brands.");
    }
  };

  const openAddModal = () => {
    form.resetFields();
    setIsEditMode(false);
    setEditingBrand(null);
    setIsModalVisible(true);
  };



  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setIsEditMode(true);
    form.setFieldsValue({
      title: brand.title,
      color: brand.color,
    });
  
    // If the brand has a photo, set it as well in the form
    if (brand.photo) {
      form.setFieldsValue({
        photo: [{ url: `${ServerLink}${brand.photo}` }],
      });
    }
  
    setIsModalVisible(true);
  };
  

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("color", values.color);
  
    // If a new photo is selected, add it to the FormData
    if (values.photo && values.photo[0]) {
      formData.append("photo", values.photo[0].originFileObj);
    }
  
    setLoading(true);
  
    try {
      // If it's an edit, update the existing brand
      if (isEditMode && editingBrand) {
        const response = await axios.put(`/brand/edit/${editingBrand._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Brand updated successfully!");
      } else {
        // Otherwise, add a new brand
        const response = await axios.post("/brand/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Brand added successfully!");
      }
  
      fetchBrands();  // Reload brands
      setIsModalVisible(false);  // Close the modal
      form.resetFields();  // Reset the form
    } catch (error) {
      message.error(isEditMode ? "Failed to update brand." : "Failed to add brand.");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleDeleteBrand = async (id) => {
    try {
      await axios.delete(`brand/delete/${id}`);
      message.success("Brand deleted successfully!");
      fetchBrands();
    } catch (error) {
      message.error("Failed to delete brand.");
    }
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <img
          src={`${ServerLink}${photo}`}
          alt="Brand"
          style={{ width: 60, height: 60 }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBrand(record._id)}
            danger
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mt-5">
        <h2 className="text-2xl font-medium">Manage Brands</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
          style={{ marginBottom: 16 }}
        >
          Add Brand
        </Button>
      </div>
      <Table dataSource={brands} columns={columns} rowKey="_id" />

      <Modal
        title={isEditMode ? "Edit Brand" : "Add Brand"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.validateFields().then(handleFormSubmit)}
        okText={isEditMode ? "Save" : "Add"}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="title"
            label="Brand Title"
            rules={[{ required: true, message: "Please enter the brand title" }]}
          >
            <Input placeholder="Enter brand title" />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color Code"
            rules={[{ required: true, message: "Please enter the brand color code" }]}
          >
            <Input placeholder="Enter color code" />
          </Form.Item>
          <Form.Item
            name="photo"
            label="Photo"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Photo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddBrand;
