import React, { useState, useEffect } from "react";
import logo from "../assets/logo/logo-white.png";
import { IoIosCart } from "react-icons/io";
import { HiMenuAlt2 } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
import { FaTools } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "./Axios";
import { MdCategory } from "react-icons/md";
import ServerLink from "./Serverlink";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const products = useSelector((state) => state.orebiReducer.products);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("category/getCategory");
        setCategories(response.data.Categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`find/search?query=${query}`);
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleProductClick = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full absolute top-0 left-0 z-50 bg-root px-5">
      <div className="container mx-auto py-3">
        <div className="flex md:justify-between gap-3 items-center justify-evenly">
          {/* Menu Icon */}
          <div className="w-[10%]">
            <HiMenuAlt2
              onClick={() => setOpen(!open)}
              size={28}
              className="text-primary md:mr-10 cursor-pointer"
            />
          </div>

          {/* Logo */}
          <div className="">
            <Link to={"/"}>
              <div className="w-[100%]">
                <img src={logo} className="md:w-[100%] w-[100%]" alt="logo" />
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="w-[30%] hidden md:block">
            <ul className="text-white flex items-center justify-center gap-x-5">
              <Link to={"/"}><li>Home</li></Link>
              <Link to={"/about"}><li>About US</li></Link>
              {/* <Link to={"/ourteam"}><li>Our Team</li></Link> */}
              <Link to={"/contact"}><li>Contact US</li></Link>
            </ul>
          </div>

          {/* Search and Cart */}
          <div className="md:w-[20%] w-[10%] gap-x-5 flex md:justify-end items-center justify-center relative">
            <div className="relative">
              <CiSearch
                size={28}
                onClick={() => setIsSearchOpen(true)}
                className="text-primary cursor-pointer"
              />
            </div>

            {/* Search Popup */}
            {isSearchOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20">
                <div className="bg-white p-4 rounded-lg w-full max-w-md">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search your items"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="flex-1 p-2 border rounded"
                      autoFocus
                    />
                    <MdOutlineCancel
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="ml-2 cursor-pointer"
                      size={24}
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                          onClick={handleProductClick}
                        >
                          <div className="p-2 hover:bg-gray-100 flex items-center justify-between">
                            <img
                              src={`${ServerLink}${product.photo[0]}`}
                              className="w-16 h-16 object-cover"
                              alt={product.title}
                            />
                            <span className="ml-2">{product.title}</span>
                            <span className="ml-2">{product.price} ৳</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cart Icon */}
            <Link to="cart">
              <IoIosCart size={28} className="text-white mr-0" />
              {products.length > 0 && (
                <span className="absolute -top-2 -right-2 text-xs text-white bg-red-600 rounded-full px-2 py-1">
                  {products.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`h-screen bg-white w-[200px] absolute top-0 left-0 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MdOutlineCancel
          onClick={() => setOpen(false)}
          size={25}
          className="text-primary absolute top-3 right-3 cursor-pointer"
        />
    
        <ul className="mt-10 p-2">
        <p className="text-lg font-medium mb-3 text-center">Category        </p>
          {categories.map((category) => (
            <li
              key={category._id}
              className={`border rounded-lg py-2 px-2 flex items-center gap-x-2 mb-2 ${
                category.subCategories.length > 0 ? "cursor-pointer" : ""
              }`}
              onClick={() =>
                category.subCategories.length > 0 &&
                setDropdownOpen((prev) => (prev === category._id ? "" : category._id))
              }
            >
              <MdCategory />
              <Link onClick={() => setOpen(false)} to={`/category/${category._id}`}>
                {category.name}
              </Link>
              {category.subCategories.length > 0 && (
                <IoIosArrowDown className="ml-auto" />
              )}
            </li>
          ))}

          {categories.map((category) =>
            category.subCategories.length > 0 && dropdownOpen === category._id ? (
              <ul key={category._id} className="pl-8 mt-2">
                {category.subCategories.map((subCategory) => (
                  <Link
                    onClick={() => setOpen(false)}
                    to={`/subCategory/${subCategory._id}`}
                    key={subCategory._id}
                  >
                    <li className="py-2">
                      {subCategory.name}
                    </li>
                  </Link>
                ))}
              </ul>
            ) : null
          )}
        </ul>
        <div className="px-3 md:hidden block">
          <p className="text-lg font-medium mb-3 text-center">Important Link</p>
          <ul className="flex flex-col gap-y-2">
            <Link to={"/"}><li className="border rounded-lg py-2 px-2 flex items-center gap-x-2 mb-2">Home</li></Link>
            <Link to={"/about"}><li className="border rounded-lg py-2 px-2 flex items-center gap-x-2 mb-2">About US</li></Link>
            {/* <li className="border rounded-lg py-2 px-2 flex items-center gap-x-2 mb-2">Our Team</li> */}
            <Link to={"/contact"}><li className="border rounded-lg py-2 px-2 flex items-center gap-x-2 mb-2">Contact US</li></Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;