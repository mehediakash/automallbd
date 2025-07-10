import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For route parameters
import axios from "../Components/Axios";
import { Pagination, Dropdown, Menu } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import ProductCard from "../Components/ProductCard";
import ServerLink from "../Components/Serverlink";

const BrandShop = () => {
  const { id } = useParams(); // Get brand ID from route
  const [brand, setBrand] = useState(null);
  const [color, setColor] = useState("#091017")
  const [view, setView] = useState("grid"); // State to toggle between grid and list view
  const [sortOption, setSortOption] = useState("default"); // State for sorting
  const [isLoading, setIsLoading] = useState(true); // Loading state
console.log(color)
  // Fetch brand data
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await axios.get(`/brand/getby/${id}`);
        setBrand(response.data.brand);
        set
        console.log(response.data.brand)
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandData();
  }, [id]);

  // Sorting options dropdown
  const sortMenu = (
    <Menu onClick={(e) => setSortOption(e.key)}>
      <Menu.Item key="default">Default Sorting</Menu.Item>
      <Menu.Item key="price-asc">Price: Low to High</Menu.Item>
      <Menu.Item key="price-desc">Price: High to Low</Menu.Item>
      <Menu.Item key="popularity">Popularity</Menu.Item>
    </Menu>
  );

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (!brand) {
    return <div className="text-center text-white">Brand not found</div>;
  }
  const backgroundColor = brand.color || "#091017";
  return (
    <div style={{ backgroundColor }}>
      {color}
      <div className="container mx-auto py-8 px-4 flex mt-20 flex-col md:flex-row relative">
        <div className="w-full md:p-4 p-0">
          <div className="flex justify-between items-center mb-6">
           

            <Dropdown overlay={sortMenu}>
              <button className="px-4 py-2 text-black bg-gray-200 rounded-md">
                Sort by: {sortOption} ▼
              </button>
            </Dropdown>

            <div className="flex space-x-4">
              <button onClick={() => setView("grid")}>
                <AppstoreOutlined
                  className={`text-2xl ${
                    view === "grid" ? "text-blue-500" : "text-white"
                  }`}
                />
              </button>
              <button onClick={() => setView("list")}>
                <BarsOutlined
                  className={`text-2xl ${
                    view === "list" ? "text-blue-500" : "text-white"
                  }`}
                />
              </button>
            </div>
          </div>

          <div
            className={
              view === "grid"
                ? "grid md:grid-cols-4 grid-cols-2 gap-x-5"
                : "space-y-6"
            }
          >
            {brand.product.map((product) => (
              
              <ProductCard
                key={product._id}
                title={product.title}
                discription={product.description}
                img={`${ServerLink}${product.photo[0].replace("\\", "/")}`}
               
                price={product.price}
                id={product._id}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination defaultCurrent={1} total={brand.product.length} pageSize={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandShop;
