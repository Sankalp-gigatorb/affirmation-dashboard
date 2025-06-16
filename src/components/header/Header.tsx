import React, { useState, useRef, useEffect } from "react";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiBell,
} from "react-icons/fi";

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
    <header className="bg-card border-b border-border">
      <div className="px-6 h-16 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Admin Dashboard
        </h2>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
            <FiBell className="w-5 h-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none hover:bg-primary/10 hover:text-primary p-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">JD</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-foreground">
                  Admin
                </span>
                <FiChevronDown
                  className={`w-4 h-4 ml-1 text-foreground transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg py-1 z-50 border border-border">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    Admin User
                  </p>
                  <p className="text-xs text-muted-foreground">
                    admin@example.com
                  </p>
                </div>

                <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  Profile
                </a>

                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <FiSettings className="w-4 h-4 mr-2" />
                  Settings
                </a>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
