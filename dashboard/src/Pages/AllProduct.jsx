import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Modal, Form, Input, Tag, Upload, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  CloseCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import JoditEditor from "jodit-react";
import axios from "../Components/Axios"; // Adjust the path as per your folder structure
import ServerLink from "../Components/ServerLink";

const AllProduct = () => {
  const [sizes, setSizes] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Added inputValue state
  const inputRef = useRef(null);
  const [content, setContent] = useState("");
  const [colors, setColors] = useState([]);
  const [colorInputVisible, setColorInputVisible] = useState(false);
  const [colorInputValue, setColorInputValue] = useState("");
  const colorInputRef = useRef(null);


  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [form] = Form.useForm();
  const editor = useRef(null); // Editor reference

  const joditConfig = {
    readonly: false, // allows editing
    toolbarSticky: true,
    height:"400px",
    uploader: {
      insertImageAsBase64URI: true, // allows image uploads as base64
    },
    buttons: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "link",
      "image",
      "hr",
      "|",
      "undo",
      "redo",
      "|",
      "fullsize",
      "table", // Add table button for table functionality
      "source", // Add source button for code view
    ], // customized toolbar buttons
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/product/allproduct");
      setProducts(data.data);
    } catch (error) {
      message.error("Failed to fetch products");
    }
  };

  const handleSizeClose = (removedSize) => {
    setSizes(sizes.filter((size) => size !== removedSize));
  };

  const showSizeInput = () => {
    setInputVisible(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSizeInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSizeInputConfirm = () => {
    if (inputValue && !sizes.includes(inputValue)) {
      setSizes([...sizes, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  const handleColorClose = (removedColor) => {
    setColors(colors.filter((color) => color !== removedColor));
  };

  const showColorInput = () => {
    setColorInputVisible(true);
    setTimeout(() => colorInputRef.current?.focus(), 0);
  };

  const handleColorInputChange = (e) => {
    setColorInputValue(e.target.value);
  };

  const handleColorInputConfirm = () => {
    if (colorInputValue && !colors.includes(colorInputValue)) {
      setColors([...colors, colorInputValue]);
    }
    setColorInputVisible(false);
    setColorInputValue("");
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setRemovedPhotos([]);
    form.setFieldsValue({
      ...product,
      details: product.details.replace(/<\/?[^>]+(>|$)/g, ""),
    });
    setSizes(product.size || []); // Initialize sizes for editing
    setColors(product.color || []); // Initialize colors for editing
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/product/deleteProduct/${id}`);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSizes([]);
    setColors([]);
    form.resetFields();
  };

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("details", content);
      formData.append("price", values.price);
      formData.append("discountPrice", values.discountPrice);
      formData.append("description", values.description);
      // formData.append(
      //   "category",
      //   editingProduct?.category?._id || editingProduct?.category
      // );
      // formData.append(
      //   "subCategory",
      //   editingProduct?.subCategory?._id || editingProduct?.subCategory
      // );

      // Append color and size arrays
      sizes.forEach((size) => formData.append("size[]", size));
      colors.forEach((color) => formData.append("color[]", color));

      if (editingProduct.newPhotos) {
        editingProduct.newPhotos.forEach((file) => {
          formData.append("photos", file);
        });
      }

      if (removedPhotos.length > 0) {
        formData.append("removedPhotos", JSON.stringify(removedPhotos));
      }

      const { data } = await axios.put(
        `/product/editProduct/${editingProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Product updated successfully");
      fetchProducts();
      handleModalClose();
    } catch (error) {
      message.error("Failed to update product");
      console.error(error);
    }
  };

  const handlePhotoUpload = ({ file }) => {
    setEditingProduct((prev) => ({
      ...prev,
      newPhotos: [...(prev.newPhotos || []), file],
    }));
  };

  const handlePhotoRemove = (index) => {
    const updatedPhotos = [...editingProduct.newPhotos];
    updatedPhotos.splice(index, 1);
    setEditingProduct({
      ...editingProduct,
      newPhotos: updatedPhotos,
    });
  };

  const handleRemovePrevPhoto = (index) => {
    const updatedPrevPhotos = [...editingProduct.photo];
    const removedPhoto = updatedPrevPhotos.splice(index, 1);
    setEditingProduct({
      ...editingProduct,
      photo: updatedPrevPhotos,
    });
    setRemovedPhotos([...removedPhotos, ...removedPhoto]);
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      render: (photos) => (
        <>
          {photos.map((photo, index) => (
            <img
              key={index}
              src={`${ServerLink}${photo}`}
              alt="Product"
              className="w-16 h-16 object-cover mr-2"
            />
          ))}
        </>
      ),
    },
    { title: "Title", dataIndex: "title" },
    { title: "Price", dataIndex: "price" },
    { title: "Discount Price", dataIndex: "discountPrice" },
    {
      title: "Color",
      dataIndex: "color",
      render: (colors) => colors.map((color) => <Tag key={color}>{color}</Tag>),
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (sizes) => sizes.map((size) => <Tag key={size}>{size}</Tag>),
    },
    { title: "Category", dataIndex: ["category", "name"] },
    { title: "SubCategory", dataIndex: ["subCategory", "name"] },
    { title: "Brand", dataIndex: ["brand", "title"] },
    {
      title: "Actions",
      render: (product) => (
        <>
          <Button
            icon={<EditOutlined />}
            className="mr-2"
            onClick={() => handleEdit(product)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(product._id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={products} rowKey="_id" />

      <Modal
        title="Edit Product"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="discountPrice"
            label="Discount Price"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          {/* <Form.Item name="details" label="Details">
            <ReactQuill />
          </Form.Item> */}

          <Form.Item label="Details" name="details" required>
          <JoditEditor
            ref={editor}
            value={content}
            config={joditConfig}
            onBlur={(newContent) => setContent(newContent)} // Updates content on blur
          />
        </Form.Item>



          <div className="flex gap-x-2">
            {/* Size Tags with Input */}
            <Form.Item className="flex" label="Product Size">
              {sizes.map((size) => (
                <Tag
                  key={size}
                  closable
                  onClose={() => handleSizeClose(size)}
                  closeIcon={<CloseCircleOutlined />}
                >
                  {size}
                </Tag>
              ))}
              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  className="w-24"
                  value={inputValue}
                  onChange={handleSizeInputChange}
                  onBlur={handleSizeInputConfirm}
                  onPressEnter={handleSizeInputConfirm}
                />
              ) : (
                <Tag onClick={showSizeInput} className="cursor-pointer">
                  <PlusOutlined /> New Size
                </Tag>
              )}
            </Form.Item>

            {/* Color Tags with Input */}
            <Form.Item className="flex" label="Product Color">
              {colors.map((color) => (
                <Tag
                  key={color}
                  closable
                  onClose={() => handleColorClose(color)}
                  closeIcon={<CloseCircleOutlined />}
                >
                  {color}
                </Tag>
              ))}
              {colorInputVisible ? (
                <Input
                  ref={colorInputRef}
                  type="text"
                  size="small"
                  className="w-24"
                  value={colorInputValue}
                  onChange={handleColorInputChange}
                  onBlur={handleColorInputConfirm}
                  onPressEnter={handleColorInputConfirm}
                />
              ) : (
                <Tag onClick={showColorInput} className="cursor-pointer">
                  <PlusOutlined /> New Color
                </Tag>
              )}
            </Form.Item>
          </div>

          {/* Image Upload Section */}
          <div className="mb-4">
            <label>Current Photos:</label>
            <div className="flex gap-2 mt-2">
              {editingProduct?.photo?.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={`${ServerLink}${photo}`}
                    alt="Product"
                    className="w-16 h-16 object-cover"
                  />
                  <Button
                    icon={<CloseCircleOutlined />}
                    size="small"
                    danger
                    className="absolute top-0 right-0"
                    onClick={() => handleRemovePrevPhoto(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Form.Item label="Upload New Photos">
            <Upload
              listType="picture"
              multiple
              showUploadList={true}
              beforeUpload={() => false} // Prevent automatic upload
              onChange={handlePhotoUpload}
            >
              <Button icon={<UploadOutlined />}>Upload Photos</Button>
            </Upload>
          </Form.Item>

          {/* Display New Photos */}
          <div className="mb-4">
            <label>New Photos:</label>
            <div className="flex gap-2 mt-2">
              {editingProduct?.newPhotos?.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="New Product"
                    className="w-16 h-16 object-cover"
                  />
                  <Button
                    icon={<CloseCircleOutlined />}
                    size="small"
                    danger
                    className="absolute top-0 right-0"
                    onClick={() => handlePhotoRemove(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AllProduct;
