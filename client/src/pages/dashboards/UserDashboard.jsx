import React, { useState } from "react";
import {
  User,
  FileText,
  CheckCircle2,
  XCircle,
  DollarSign,
  Upload,
  Menu,
  X,
} from "lucide-react";

const SellerDashboardLayout = ({ activeTab, setActiveTab, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { key: "profile", label: "Personal Info", icon: <User className="h-5 w-5" /> },
    { key: "draft", label: "Draft Cars", icon: <FileText className="h-5 w-5" /> },
    { key: "approved", label: "Approved Cars", icon: <CheckCircle2 className="h-5 w-5" /> },
    { key: "rejected", label: "Rejected Cars", icon: <XCircle className="h-5 w-5" /> },
    { key: "sold", label: "Sold Cars", icon: <DollarSign className="h-5 w-5" /> },
    { key: "upload", label: "Upload Car", icon: <Upload className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
          Seller Panel
        </h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-md hover:bg-orange-50 transition"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-orange-500" />
          ) : (
            <Menu className="h-6 w-6 text-blue-600" />
          )}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-white/95 backdrop-blur-xl border-r border-gray-100 shadow-lg p-6 flex flex-col transform transition-transform duration-300 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h2 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-6 text-center">
          Seller Panel
        </h2>

        <nav className="space-y-2 md:space-y-3 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setMenuOpen(false);
              }}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === item.key
                  ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CarMazik
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 min-h-[80vh] transition-all duration-300">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboardLayout;
