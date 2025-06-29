import React from "react";
import {
  FiHome,
  FiMessageSquare,
  FiUsers,
  FiUsers as FiCommunities,
  FiCreditCard,
  FiBell,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiFileText,
  FiFolder,
  FiShield,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "@/services/auth.service";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", icon: FiHome, path: "/" },
    {
      name: "Manage Affirmations",
      icon: FiMessageSquare,
      path: "/affirmations",
    },
    { name: "Posts Management", icon: FiFileText, path: "/posts" },
    { name: "Categories Management", icon: FiFolder, path: "/categories" },
    { name: "Users", icon: FiUsers, path: "/users" },
    { name: "Communities", icon: FiCommunities, path: "/communities" },
    // { name: "Subscriptions", icon: FiCreditCard, path: "/subscriptions" },
    {
      name: "Subscriptions",
      icon: FiShield,
      path: "/admin/subscriptions",
    },
    { name: "Notifications", icon: FiBell, path: "/notifications" },
    // { name: "Reports", icon: FiBarChart2, path: "/reports" },
    // { name: "Settings", icon: FiSettings, path: "/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div className="h-16 flex items-center justify-center border-b border-border">
        <h1 className="text-xl font-semibold text-primary">Affirmation App</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
