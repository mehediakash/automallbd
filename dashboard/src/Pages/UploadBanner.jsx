import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Upload, Select, Popconfirm, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "../Components/Axios";
import ServerLink from "../Components/ServerLink";


const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // Fixed positions for the dropdown
  const positions = ["MainBanner", "SecondBannerLeft", "SecondBannerRight", "ServiceBanner"];

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get("/banner/all");
      setBanners(data.banners || []);
    } catch (error) {
      message.error("Failed to fetch banners");
    }
  };

  const handleBannerSubmit = async (values) => {
    const formData = new FormData();
    formData.append("position", values.position);
    formData.append("link", values.link);

    fileList.forEach((file) => {
      formData.append("photo", file.originFileObj); // Ensure "photo" matches backend key
    });

    try {
      if (editingBanner) {
        await axios.put(`/banner/edit/${editingBanner._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Banner updated successfully");
      } else {
        await axios.post("/banner/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Banner added successfully");
      }
      fetchBanners();
      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to save banner");
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`/banner/delete/${id}`);
      message.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      message.error("Failed to delete banner");
    }
  };

  const columns = [
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photos) => (
        <div className="flex">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={`${ServerLink}${photo}`}
              alt="Banner"
              className="w-20 h-12 object-cover rounded"
            />
          ))}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (banner) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBanner(banner);
              form.setFieldsValue({ position: banner.position, link: banner.link });
              setFileList([]);
              setIsModalOpen(true);
            }}
            className="mr-2"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this banner?"
            onConfirm={() => handleDeleteBanner(banner._id)}
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
        <h1 className="text-xl font-bold">Banner Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingBanner(null);
            form.resetFields();
            setFileList([]);
            setIsModalOpen(true);
          }}
        >
          Add Banner
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={banners}
        rowKey="_id"
        locale={{
          emptyText: "No banners available. Add a new banner to get started.",
        }}
        className="mb-8"
      />

      <Modal
        title={editingBanner ? "Edit Banner" : "Add Banner"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleBannerSubmit} layout="vertical">
          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: "Please select the banner position" }]}
          >
            <Select>
              {positions.map((position) => (
                <Select.Option key={position} value={position}>
                  {position}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="link"
            label="Link"
            rules={[{ required: true, message: "Please input the banner link" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Photo">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingBanner ? "Update" : "Add"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManager;
