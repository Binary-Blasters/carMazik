import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);

  
  const menuItems = {
    guest: [
      { name: "Home", path: "/" },
      { name: "Featured", path: "/featured" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" },
    ],
    user: [
      { name: "Home", path: "/" },
      { name: "Featured", path: "/featured" },
      { name: "Wishlist", path: "/user/wishlist" },
      { name: "Sell Car", path: "/sell" },
      { name: "Profile", path: "/user/profile" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Pending Sellers", path: "/admin/sellers/pending" },
      { name: "Manage Users", path: "/admin/users" },
    ],
  };

  const links = menuItems[userRole || "guest"];

  return (
    <nav className="fixed w-full z-40 top-0 left-0 backdrop-blur-md bg-black/40 border-b border-red-800/20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-400 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-white font-extrabold">CM</span>
            </div>
            <div className="text-white font-semibold tracking-wide text-lg">
              CarMazik
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-200">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `hover:text-white transition ${isActive ? "text-red-500 font-semibold" : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Buttons & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-200 hover:text-white transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 border-t border-red-800/30 px-6 py-4 space-y-3 text-gray-300"
          >
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block hover:text-white transition ${isActive ? "text-red-500 font-semibold" : ""}`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
