import React, { useState, useEffect, useRef } from "react";
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
import { CiCirclePlus } from "react-icons/ci";
import axios from "../Components/Axios";
import { ImCancelCircle } from "react-icons/im";
import JoditEditor from "jodit-react";
import "react-quill/dist/quill.snow.css";

const { Dragger } = Upload;

const UploadProduct = () => {
  const [brandForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [variantFileList, setVariantFileList] = useState([]);
  const [brandFileList, setBrandFileList] = useState([]);
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const [colors, setColors] = useState([]); // Colors state for tracking
  const [colorInputVisible, setColorInputVisible] = useState(false);
  const [colorInputValue, setColorInputValue] = useState("");
  const colorInputRef = useRef(null);
  const [content, setContent] = useState("");
  const editor = useRef(null); // Editor reference

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

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category/getCategory");
      console.log(response.data.Categories);
      setCategories(response.data.Categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get("/category/getSubCategory");
      console.log(response.data.subCategories);

      setSubCategories(response.data.subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get("/brand/all");

      setBrands(response.data.brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleImagePreview = (file) => {
    if (file && file.originFileObj) {
      // Check if the file is valid
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file.originFileObj); // Use originFileObj for the correct file object
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

  const handleProductSubmit = async (values) => {
    if (variantFileList.length === 0) {
      message.error("Please upload at least one variant image!");
      return;
    }
    const formData = new FormData();

    if (values.category) formData.append("category", values.category);
    if (values.subCategory) formData.append("subCategory", values.subCategory);
    if (values.brand) formData.append("brand", values.brand);

    // formData.append("category", values.category);
    // formData.append("subCategory", values.subCategory);
    // formData.append("brand", values.brand);
    formData.append("title", values.title);
    formData.append("discountPrice", values.discountPrice);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("details", content);
    // formData.append("details", values.details);

    sizes.forEach((size) => formData.append("size[]", size));
    colors.forEach((color) => formData.append("color[]", color));

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

      message.success("Product created successfully");
      productForm.resetFields();
      setVariantFileList([]);
      setVariants([]);
      setDescription("");
      setImagePreviewUrls([]);
    } catch (error) {
      console.error("Error creating product:", error.response || error.message);
      message.error("Something went wrong, Try again!");
    } finally {
      setLoading(false);
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
    formData.append("color", values.color);
    formData.append("description", values.description);
    formData.append("photo", brandFileList[0]);

    try {
      await axios.post("/brand/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Brand created successfully");
      setImagePreviewUrls([]);
      brandForm.resetFields();
      setBrandFileList([]);

      fetchBrands();
    } catch (error) {
      message.error("Failed to create brand");
    }
  };
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

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-xl py-10">
        Upload Products
      </h2>
    
    

       
          <Card title="Add Product" bordered={false}>
            <Form form={productForm} onFinish={handleProductSubmit}>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input the product title!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Product Description" name="description">
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

              <div className="flex gap-x-2">
                <div className="flex gap-x-5 items-center">
                  <Form.Item className="w-[95px]" label="price" name="price">
                    <Input />
                  </Form.Item>
                  <Form.Item
                    className="w-[150px]"
                    label="Discount Price"
                    name="discountPrice"
                  >
                    <Input />
                  </Form.Item>
                </div>
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

              {/* <Form.Item label="Details" name="details">
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
              <Dragger {...variantUploadProps} onChange={handleImagePreview}>
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

              <div className="flex gap-x-5 justify-center mt-10">
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
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={loading}
                  className="mt-10"
                >
                  {loading ? <LoadingOutlined /> : "Upload Product"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
     
   
    </>
  );
};

export default UploadProduct;
