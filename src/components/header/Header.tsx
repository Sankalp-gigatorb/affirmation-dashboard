import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiBell,
} from "react-icons/fi";
import AuthService from "@/services/auth.service";
import { toast } from "sonner";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
  }, [location.pathname]); // Refresh when route changes (e.g., after profile update)

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

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser?.firstName) {
      return currentUser.firstName;
    }
    if (currentUser?.username) {
      return currentUser.username;
    }
    return "Admin";
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
                <span className="text-sm font-medium text-primary">
                  {getInitials(currentUser?.firstName, currentUser?.lastName)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-foreground">
                  {getDisplayName()}
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
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.email || "admin@example.com"}
                  </p>
                </div>

                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  Profile
                </Link>

                {/* <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <FiSettings className="w-4 h-4 mr-2" />
                  Settings
                </a> */}

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
