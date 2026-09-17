import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiSearch, FiX, FiCheck } from "react-icons/fi";
import {
  BANGLADESH_DISTRICTS_BY_DIVISION,
  BANGLADESH_DISTRICTS,
} from "../constants/districts";

const DistrictSelect = ({ value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (district) => {
    onChange(district);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  // Filter districts when search term exists
  const filteredDistricts = searchTerm.trim()
    ? BANGLADESH_DISTRICTS.filter((d) =>
        d.toLowerCase().includes(searchTerm.trim().toLowerCase()),
      )
    : [];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`mt-1 flex items-center justify-between w-full px-3 py-2 bg-white border ${
          error
            ? "border-red-500 ring-1 ring-red-500"
            : isOpen
              ? "border-yellow-500 ring-1 ring-yellow-500"
              : "border-gray-300 hover:border-gray-400"
        } rounded-md shadow-sm cursor-pointer transition text-sm sm:text-sm`}
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value || "Select your district..."}
        </span>
        <div className="flex items-center gap-1.5 text-gray-400">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:text-red-500 rounded-full transition"
              title="Clear district"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          <FiChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-yellow-600" : ""
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <FiSearch className="w-4 h-4 text-gray-400 ml-1 flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 64 districts (e.g. Dhaka, Bogura)..."
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* District List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 text-sm">
            {searchTerm.trim() ? (
              // Flat Search Results
              filteredDistricts.length > 0 ? (
                filteredDistricts.map((district) => {
                  const isSelected = value === district;
                  return (
                    <button
                      key={district}
                      type="button"
                      onClick={() => handleSelect(district)}
                      className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition ${
                        isSelected
                          ? "bg-yellow-50 text-yellow-800 font-semibold"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <span>{district}</span>
                      {isSelected && (
                        <FiCheck className="w-4 h-4 text-yellow-600" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-gray-400 text-sm">
                  No district found matching "{searchTerm}"
                </div>
              )
            ) : (
              // Grouped by 8 Divisions
              Object.entries(BANGLADESH_DISTRICTS_BY_DIVISION).map(
                ([division, districts]) => (
                  <div key={division} className="py-1">
                    <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/80 sticky top-0">
                      {division}
                    </div>
                    {districts.map((district) => {
                      const isSelected = value === district;
                      return (
                        <button
                          key={district}
                          type="button"
                          onClick={() => handleSelect(district)}
                          className={`w-full text-left px-4 py-2 flex items-center justify-between transition ${
                            isSelected
                              ? "bg-yellow-50 text-yellow-800 font-semibold"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span>{district}</span>
                          {isSelected && (
                            <FiCheck className="w-4 h-4 text-yellow-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ),
              )
            )}
          </div>

          {/* Footer Info */}
          <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between">
            <span>64 Districts across 8 Divisions</span>
            <span className="text-gray-400">Dhaka: ৳70 | Others: ৳130</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictSelect;
