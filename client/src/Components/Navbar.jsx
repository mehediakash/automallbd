import React, { useState, useEffect } from "react";
import logo from "../assets/logo/logo-white.png";
import { IoIosCart } from "react-icons/io";
import { HiMenuAlt2 } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { IoCarSport } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "./Axios";
import { MdCategory } from "react-icons/md";
import ServerLink, { getImageUrl } from "./Serverlink";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const products = useSelector((state) => state.orebiReducer.products);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fetch categories from API
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
    <>
      {/* Main Navbar */}
      <header className="w-full absolute top-0 left-0 z-40 bg-root">
        <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Left Section: Hamburger on mobile; Hamburger + Logo on desktop */}
            <div className="flex items-center gap-3 md:gap-5 flex-1 md:flex-none justify-start">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="p-1 -ml-1 text-primary hover:text-red-400 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <HiMenuAlt2 size={26} className="text-primary" />
              </button>

              {/* Desktop Logo */}
              <div className="hidden md:flex items-center">
                <Link to="/" className="inline-block">
                  <img
                    src={logo}
                    className="w-36 lg:w-44 h-auto max-h-9 lg:max-h-10 object-contain block"
                    alt="Auto Mall"
                  />
                </Link>
              </div>
            </div>

            {/* Center Section: Centered Mobile Logo; Desktop Navigation Links */}
            <div className="flex items-center justify-center flex-shrink-0">
              {/* Mobile Logo */}
              <div className="flex md:hidden items-center justify-center">
                <Link to="/" className="inline-block">
                  <img
                    src={logo}
                    className="w-24 sm:w-28 h-auto max-h-8 object-contain block"
                    alt="Auto Mall"
                  />
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:block">
                <ul className="text-white flex items-center justify-center gap-x-6 lg:gap-x-8 text-sm lg:text-base font-medium">
                  <li>
                    <Link
                      to="/"
                      className="hover:text-primary transition-colors py-1 inline-block"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-primary transition-colors py-1 inline-block"
                    >
                      About US
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-primary transition-colors py-1 inline-block"
                    >
                      Contact US
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Right Section: Search & Cart */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-4 flex-1 md:flex-none">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-1 text-primary hover:text-red-400 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                aria-label="Open search"
              >
                <CiSearch size={26} className="text-primary stroke-[0.5]" />
              </button>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-1 text-white hover:text-primary transition-colors flex items-center justify-center"
                aria-label="Shopping cart"
              >
                <IoIosCart size={26} />
                {products && products.length > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] font-bold text-white bg-primary rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {products.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Popup Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start pt-16 sm:pt-20 px-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <MdOutlineCancel size={22} />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-3 max-h-60 overflow-y-auto divide-y divide-gray-100 border-t border-gray-100 pt-2">
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    onClick={handleProductClick}
                    className="p-2 hover:bg-gray-50 flex items-center justify-between rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img
                        src={getImageUrl(product.photo?.[0])}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                        alt={product.title}
                      />
                      <span className="text-sm text-gray-800 truncate">
                        {product.title}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-primary ml-2 flex-shrink-0">
                      {product.price} ৳
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Modern Mobile Navigation Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[85vw] max-w-[340px] sm:max-w-[360px] bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation drawer"
      >
        {/* Drawer Header with Close Button strictly contained inside */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <IoCarSport className="text-primary text-xl" />
            <span className="font-bold text-gray-900 tracking-wider text-base">
              AUTO MALL
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-red-50 transition-all duration-200 focus:outline-none cursor-pointer"
            aria-label="Close menu"
          >
            <MdOutlineCancel size={22} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Category Section */}
          <div>
            <div className="flex items-center gap-2 px-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              <span>Categories</span>
            </div>

            <div className="space-y-1.5">
              {categories.map((category) => (
                <div key={category._id} className="rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 hover:bg-red-50/50 border border-gray-100 hover:border-red-100 transition-all duration-200 group">
                    <Link
                      onClick={() => setOpen(false)}
                      to={`/category/${category._id}`}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 flex-1 text-gray-700 group-hover:text-primary text-sm font-medium transition-colors"
                    >
                      <MdCategory className="text-primary/70 group-hover:text-primary text-base flex-shrink-0" />
                      <span className="truncate">{category.name}</span>
                    </Link>

                    {category.subCategories &&
                      category.subCategories.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen((prev) =>
                              prev === category._id ? "" : category._id,
                            );
                          }}
                          className="p-2.5 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                          aria-label={`Toggle ${category.name} subcategories`}
                        >
                          <IoIosArrowDown
                            className={`text-sm transition-transform duration-200 ${
                              dropdownOpen === category._id
                                ? "rotate-180 text-primary"
                                : ""
                            }`}
                          />
                        </button>
                      )}
                  </div>

                  {/* Subcategories accordion */}
                  {category.subCategories &&
                    category.subCategories.length > 0 &&
                    dropdownOpen === category._id && (
                      <ul className="pl-6 pr-2 py-1.5 mt-1 space-y-1 border-l-2 border-primary/20 ml-4">
                        {category.subCategories.map((subCategory) => (
                          <li key={subCategory._id}>
                            <Link
                              onClick={() => setOpen(false)}
                              to={`/subCategory/${subCategory._id}`}
                              className="block px-3 py-1.5 text-xs text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-colors"
                            >
                              {subCategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              ))}
            </div>
          </div>

          {/* Important Links Section */}
          <div>
            <div className="flex items-center gap-2 px-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
              <span>Navigation</span>
            </div>

            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-red-50/50 border border-gray-100 hover:border-red-100 text-sm font-medium text-gray-700 hover:text-primary transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-red-50/50 border border-gray-100 hover:border-red-100 text-sm font-medium text-gray-700 hover:text-primary transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  About US
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-red-50/50 border border-gray-100 hover:border-red-100 text-sm font-medium text-gray-700 hover:text-primary transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                  Contact US
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 text-center">
          <p className="text-xs text-gray-400 font-medium">
            © Auto Mall BD. All rights reserved.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
