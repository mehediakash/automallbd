import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Select,
  Form,
  Button,
  message,
  Upload,
  Tag,
} from "antd";
import {
  PlusOutlined,
  LoadingOutlined,
  UploadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import axios from "../Components/Axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Dragger } = Upload;

const UploadProduct = () => {
  const [productForm] = Form.useForm();
  const [variantFileList, setVariantFileList] = useState([]);
  const [description, setDescription] = useState("");
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brandForm] = Form.useForm();
  const [brandFileList, setBrandFileList] = useState([]);

  // State to manage tags for product size and color
  const [sizes, setSizes] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const [colors, setColors] = useState([]);
  const [colorInputVisible, setColorInputVisible] = useState(false);
  const [colorInputValue, setColorInputValue] = useState("");
  const colorInputRef = useRef(null);

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

  const handleImagePreview = (file) => {
    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file.originFileObj);
    }
  };

  const variantUploadProps = {
    fileList: variantFileList,
    multiple: true,
    onRemove: (file) => {
      const index = variantFileList.indexOf(file);
      if (index !== -1) {
        setVariantFileList((prevList) => {
          const newFileList = [...prevList];
          newFileList.splice(index, 1);
          return newFileList;
        });
        setImagePreviewUrls((prevPreviews) => {
          const newPreviews = [...prevPreviews];
          newPreviews.splice(index, 1);
          return newPreviews;
        });
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not an image file!`);
        return Upload.LIST_IGNORE;
      }
      setVariantFileList((prevList) => [...prevList, file]);
      handleImagePreview({ originFileObj: file });
      return false;
    },
  };

  const handleBrandSubmit = async (values) => {
    if (brandFileList.length === 0) {
      message.error("Please upload a brand image!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("color", values.color);
    formData.append("photo", brandFileList[0]);

    try {
      await axios.post("/brand/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Brand created successfully");
      brandForm.resetFields();
      setBrandFileList([]);
      fetchBrands();
    } catch (error) {
      message.error("Failed to create brand");
    }
  };
  const handleVariantSubmit = async (values) => {
    if (variantFileList.length === 0) {
      message.error("Please upload at least one variant image!");
      return;
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("category", values.category);
    formData.append("subCategory", values.subCategory);
    formData.append("brand", values.brand);
    formData.append("discription", values.discription);
    formData.append("details", values.details);
    formData.append("color", values.color);
    variantFileList.forEach((file) => {
      formData.append("photo", file);
    });

    setLoading(true);
    try {
      const response = await axios.post("/product/uploadProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      message.success("Product created successfully");
      productForm.resetFields();
      setVariantFileList([]);
      setVariants([]);
      setDescription("");
      setImagePreviews([]);
    } catch (error) {
      console.error("Error creating product:", error.response || error.message);
      message.error("Something went wrong, Try again!");
    } finally {
      setLoading(false);
    }
  };
  const brandUploadProps = {
    fileList: brandFileList,
    onRemove: (file) => {
      setBrandFileList((prevList) => {
        const index = prevList.indexOf(file);
        const newFileList = prevList.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file) => {
      setBrandFileList([file]);
      return false;
    },
  };

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-xl py-10">
        Upload Products
      </h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Add Brand" bordered={false}>
            <Form form={brandForm} onFinish={handleBrandSubmit}>
              <Form.Item
                label="Brand Name"
                name="title"
                rules={[
                  { required: true, message: "Please input the brand name!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Color"
                name="color"
                rules={[
                  { required: true, message: "Please input the brand name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <Input />
              </Form.Item>
              <p className="py-2">Brand Image size = 400 x 400 px</p>
              <Upload {...brandUploadProps}>
                <Button icon={<UploadOutlined />}>Select Brand Image</Button>
              </Upload>
              <br />
              <Button type="primary" htmlType="submit">
                Add Brand
              </Button>
            </Form>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="Add Product" bordered={false}>
            <Form form={productForm} onFinish={handleVariantSubmit}>
              <Form.Item
                label="Title"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input the product title!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Product Description" name="discription">
                <Input />
              </Form.Item>

              <Form.Item
                className="mt-14"
                label="Select Category"
                name="category"
              >
                <Select
                  style={{ width: "100%" }}
                  options={categories.map((category) => ({
                    label: category.name,
                    value: category._id,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Sub Category" name="subCategory">
                <Select
                  style={{ width: "100%" }}
                  options={subCategories.map((subCategory) => ({
                    label: subCategory.name,
                    value: subCategory._id,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Brand" name="brand">
                <Select
                  style={{ width: "100%" }}
                  options={brands.map((brand) => ({
                    label: brand.title,
                    value: brand._id,
                  }))}
                />
              </Form.Item>

              <Form.Item label="Details">
                <ReactQuill />
              </Form.Item>
              <div className="flex">
                <Form.Item className="flex" label="Product Size" name="size">
                  {sizes.map((size) => (
                    <Tag
                      key={size}
                      closable
                      onClose={() => handleSizeClose(size)}
                    >
                      {size}
                    </Tag>
                  ))}

                  {inputVisible ? (
                    <Input
                      ref={inputRef}
                      type="text"
                      size="small"
                      value={inputValue}
                      onChange={handleSizeInputChange}
                      onBlur={handleSizeInputConfirm}
                      onPressEnter={handleSizeInputConfirm}
                    />
                  ) : (
                    <Tag onClick={showSizeInput} className="tag-add">
                      <PlusOutlined /> New Size
                    </Tag>
                  )}
                </Form.Item>

                <Form.Item
                  className=" !flex"
                  label="Product Color"
                  name="color"
                >
                  {colors.map((color) => (
                    <Tag
                      key={color}
                      closable
                      onClose={() => handleColorClose(color)}
                    >
                      {color}
                    </Tag>
                  ))}

                  {colorInputVisible ? (
                    <Input
                      ref={colorInputRef}
                      type="text"
                      size="small"
                      value={colorInputValue}
                      onChange={handleColorInputChange}
                      onBlur={handleColorInputConfirm}
                      onPressEnter={handleColorInputConfirm}
                    />
                  ) : (
                    <Tag onClick={showColorInput} className="tag-add">
                      <PlusOutlined /> Add Color
                    </Tag>
                  )}
                </Form.Item>
              </div>
              <Form.Item label="Details">
                <ReactQuill />
              </Form.Item>

              <Dragger {...variantUploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Dragger>

              <div className="flex gap-x-5 justify-center mt-5">
                {imagePreviewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="Preview"
                    className="w-[150px] h-[150px] object-cover rounded-md shadow-lg"
                  />
                ))}
              </div>

              <Form.Item>
                <Button type="primary" htmlType="submit" disabled={loading}>
                  {loading ? <LoadingOutlined /> : "Upload Product"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UploadProduct;
