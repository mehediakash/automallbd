import React, { useState, useEffect } from "react";
import { Slider, Checkbox, Pagination, Dropdown, Menu } from "antd";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import ProductCard from "../Components/ProductCard";
import { RiListSettingsLine } from "react-icons/ri";
import axios from "../Components/Axios";
import ServerLink, { getImageUrl } from "../Components/Serverlink";

const ShopPage = () => {
  const [view, setView] = useState("grid"); // Grid or list view
  const [sortOption, setSortOption] = useState("default"); // Sorting option
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle
  const [products, setProducts] = useState([]); // Products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products
  const [categories, setCategories] = useState([]); // Categories
  const [brands, setBrands] = useState([]); // Brands
  const [selectedBrands, setSelectedBrands] = useState([]); // Selected brands
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [totalProducts, setTotalProducts] = useState(0);

  const pageSize = 12; // Products per page

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  // Update filtered products when filters or sorting change
  useEffect(() => {
    applyFilters();
  }, [products, selectedBrands, selectedCategories, sortOption]);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/product/allproduct");
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
        setTotalProducts(response.data.data.length);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category/getCategory");
      if (response.data.success) {
        setCategories(response.data.Categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      const response = await axios.get("/brand/all");
      if (response.data.success) {
        setBrands(response.data.brands);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Apply filters and sorting
  const applyFilters = () => {
    let filtered = [...products];

    // Filter by selected brands
    if (selectedBrands?.length > 0) {
      filtered = filtered?.filter((product) =>
        selectedBrands?.includes(product?.brand?._id),
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category?._id),
      );
    }

    // Apply sorting
    if (sortOption === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
    setTotalProducts(filtered.length);
  };

  // Handle brand filter change
  const handleBrandChange = (brandId, checked) => {
    const updatedBrands = checked
      ? [...selectedBrands, brandId]
      : selectedBrands?.filter((id) => id !== brandId);
    setSelectedBrands(updatedBrands);
  };

  // Handle category filter change
  const handleCategoryChange = (categoryId, checked) => {
    const updatedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((id) => id !== categoryId);
    setSelectedCategories(updatedCategories);
  };

  // Handle pagination change
  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  // Sorting dropdown menu
  const sortMenu = (
    <Menu onClick={(e) => setSortOption(e.key)}>
      <Menu.Item key="default">Default Sorting</Menu.Item>
      <Menu.Item key="price-asc">Price: Low to High</Menu.Item>
      <Menu.Item key="price-desc">Price: High to Low</Menu.Item>
    </Menu>
  );

  return (
    <div className="bg-root">
      <div className="container mx-auto py-8 px-4 flex mt-10 flex-col md:flex-row relative">
        {/* Sidebar */}
        <div
          className={`w-64 bg-white p-4 rounded-lg shadow-md md:relative md:translate-x-0 md:block fixed top-0 left-0 h-full md:z-[2] z-[999] transition-transform duration-300 ease-in-out ${
            isSidebarOpen
              ? "transform translate-x-0"
              : "transform -translate-x-full"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
            Filter By
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-red-500 md:hidden"
            >
              Close
            </button>
          </h3>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-black">Categories</h4>
            {categories.map((category) => (
              <div key={category._id}>
                <Checkbox
                  onChange={(e) =>
                    handleCategoryChange(category._id, e.target.checked)
                  }
                >
                  {category.name}
                </Checkbox>
              </div>
            ))}
          </div>

          {/* Brands */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2 text-black">Brands</h4>
            {brands.map((brand) => (
              <div key={brand._id}>
                <Checkbox
                  onChange={(e) =>
                    handleBrandChange(brand._id, e.target.checked)
                  }
                >
                  {brand.title}
                </Checkbox>
              </div>
            ))}
          </div>
        </div>

        {/* Product Section */}
        <div className="md:w-3/4 w-full md:p-4 p-0">
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
            {filteredProducts
              .slice((currentPage - 1) * pageSize, currentPage * pageSize)
              .map((product) => (
                <ProductCard
                  id={product._id}
                  product={product}
                  key={product._id}
                  title={product.title}
                  description={product.description}
                  img={getImageUrl(product.photo?.[0])}
                  price={product.price}
                />
              ))}
          </div>

          <div className="mt-8">
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={pageSize}
              onChange={handlePaginationChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
