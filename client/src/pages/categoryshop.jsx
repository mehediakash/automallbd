import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Dropdown, Menu, Pagination, Spin } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import ProductCard from "../Components/ProductCard";
import { RiListSettingsLine } from "react-icons/ri";
import axios from "../Components/Axios";
import ServerLink, { getImageUrl } from "../Components/Serverlink";

const CategoryShop = () => {
  const { id: categoryId } = useParams(); // Extract category ID from route
  const [products, setProducts] = useState([]); // Store fetched products
  const [categoryName, setCategoryName] = useState(""); // Store category name
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [view, setView] = useState("grid"); // Toggle grid/list view
  const [sortOption, setSortOption] = useState("default"); // Sorting option
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalProducts, setTotalProducts] = useState(0); // Total number of products
  const pageSize = 12; // Products per page

  useEffect(() => {
    // Fetch category products dynamically
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/category/getCategory/${categoryId}`,
          {
            params: { page: currentPage, limit: pageSize },
          },
        );
        const { category } = response.data;
        setProducts(category.product || []);
        setCategoryName(category.name || "Category");
        setTotalProducts(category.totalProducts || 0); // Assuming API provides total products
        setError(null);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId, currentPage, pageSize]);

  // Sorting options dropdown
  const sortMenu = (
    <Menu onClick={(e) => setSortOption(e.key)}>
      <Menu.Item key="default">Default Sorting</Menu.Item>
      <Menu.Item key="price-asc">Price: Low to High</Menu.Item>
      <Menu.Item key="price-desc">Price: High to Low</Menu.Item>
      <Menu.Item key="popularity">Popularity</Menu.Item>
    </Menu>
  );

  // Sorting functionality
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    return 0; // Default or other options
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-root">
      <div className="container mx-auto py-8 px-4 flex mt-10 flex-col md:flex-row relative">
        <div className="w-full md:p-4 p-0">
          <h1 className="text-3xl font-bold text-white mb-6">{categoryName}</h1>
          <div className="flex justify-between items-center mb-6">
            {/* Filter Button for Mobile */}
            <div
              className="my-5 flex items-center gap-x-2 md:hidden cursor-pointer text-white"
              onClick={() => console.log("Filter sidebar toggle")}
            >
              <RiListSettingsLine size={25} />
              <h1 className="text-xl">Filter By</h1>
            </div>

            {/* Sort Dropdown */}
            <Dropdown overlay={sortMenu}>
              <button className="px-4 py-2 text-black bg-gray-200 rounded-md">
                Sort by: {sortOption} ▼
              </button>
            </Dropdown>

            {/* View Toggle */}
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

          {/* Product Grid/List */}
          <div
            className={
              view === "grid"
                ? "grid md:grid-cols-4 grid-cols-2 gap-x-5 gap-y-8"
                : "space-y-6"
            }
          >
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  title={product.title}
                  discription={product.description}
                  img={getImageUrl(product.photo?.[0])}
                  price={product.price}
                  id={product._id}
                />
              ))
            ) : (
              <div className="text-white">
                No products found in this category.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={pageSize}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryShop;
