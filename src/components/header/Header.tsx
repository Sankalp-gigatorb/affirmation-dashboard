import React, { useState, useRef, useEffect } from "react";
import { FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logout clicked");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 h-16 flex items-center justify-end">
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <FiUser className="w-5 h-5" />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <FiChevronDown
                className={`w-4 h-4 ml-1 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>

              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiUser className="w-4 h-4 mr-2" />
                Profile
              </a>

              <a
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiSettings className="w-4 h-4 mr-2" />
                Settings
              </a>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
