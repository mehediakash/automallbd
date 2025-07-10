import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "../Components/Axios";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/category/getCategory");
      setCategories(data.Categories || []);
    } catch (error) {
      setCategories([]);
      message.error("Failed to fetch categories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const { data } = await axios.get("/category/getSubCategory");
      if (data.success && Array.isArray(data.subCategories)) {
        setSubCategories(data.subCategories);
      } else {
        setSubCategories([]);
      }
    } catch (error) {
      setSubCategories([]);
      message.error(
        error.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  };

  const handleCategorySubmit = async (values) => {
    try {
      if (editingCategory) {
        await axios.put(`/category/UpdateCategory/${editingCategory._id}`, values);
        message.success("Category updated successfully");
      } else {
        await axios.post("/category/createCategory", values);
        message.success("Category added successfully");
      }
      fetchCategories();
      setIsCategoryModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save category");
    }
  };

  const handleSubCategorySubmit = async (values) => {
    try {
      if (editingSubCategory) {
        await axios.put(`category/UpdateSubCategory/${editingSubCategory._id}`, values);
        message.success("Subcategory updated successfully");
      } else {
        await axios.post("category/subcategory", values);
        message.success("Subcategory added successfully");
      }
      fetchSubCategories();
      setIsSubCategoryModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to save subcategory");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/category/deleteCategory/${id}`);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
    }
  };

  const handleDeleteSubCategory = async (id) => {
    try {
      await axios.delete(`/category/deleteSubCategory/${id}`);
      message.success("Subcategory deleted successfully");
      fetchSubCategories();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete subcategory"
      );
    }
  };

  const categoryColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Actions",
      render: (category) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(category);
              form.setFieldsValue(category);
              setIsCategoryModalOpen(true);
            }}
            className="mr-2"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDeleteCategory(category._id)}
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const subCategoryColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Category",
      render: (subCategory) => {
        const category = categories.find(
          (cat) => cat._id === subCategory.category
        );
        return category ? category.name : "Unknown";
      },
    },
    {
      title: "Actions",
      render: (subCategory) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSubCategory(subCategory);
              form.setFieldsValue(subCategory); // Make sure category is set for subcategory
              setIsSubCategoryModalOpen(true);
            }}
            className="mr-2"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this subcategory?"
            onConfirm={() => handleDeleteSubCategory(subCategory._id)}
          >
            <Button icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Category Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setIsCategoryModalOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <Table
        columns={categoryColumns}
        dataSource={categories}
        rowKey="_id"
        className="mb-8"
        locale={{
          emptyText: "No categories available. Add a new category to get started.",
        }}
      />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Subcategory Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingSubCategory(null);
            form.resetFields();
            setIsSubCategoryModalOpen(true);
          }}
        >
          Add Subcategory
        </Button>
      </div>

      <Table
        columns={subCategoryColumns}
        dataSource={subCategories}
        rowKey="_id"
        locale={{
          emptyText: "No subcategories available. Add a new subcategory to get started.",
        }}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCategorySubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please input the category name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCategory ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingSubCategory ? "Edit Subcategory" : "Add Subcategory"}
        open={isSubCategoryModalOpen}
        onCancel={() => setIsSubCategoryModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubCategorySubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Subcategory Name"
            rules={[{ required: true, message: "Please input the subcategory name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Parent Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select>
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingSubCategory ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCategory;
