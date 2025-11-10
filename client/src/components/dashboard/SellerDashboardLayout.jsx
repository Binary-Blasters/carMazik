import React from "react";
import {
  User,
  FileText,
  CheckCircle2,
  XCircle,
  DollarSign,
  Upload,
  Clock,
} from "lucide-react";

const SellerDashboardLayout = ({ activeTab, setActiveTab, children }) => {
  const menuItems = [
    { key: "profile", label: "Personal Info", icon: <User className="h-5 w-5" /> },
    { key: "draft", label: "Draft Cars", icon: <FileText className="h-5 w-5" /> },
    { key: "pending", label: "Pending Cars", icon: <Clock className="h-5 w-5" /> }, // ⏰ New Pending Cars Tab
    { key: "approved", label: "Approved Cars", icon: <CheckCircle2 className="h-5 w-5" /> },
    { key: "rejected", label: "Rejected Cars", icon: <XCircle className="h-5 w-5" /> },
    { key: "sold", label: "Sold Cars", icon: <DollarSign className="h-5 w-5" /> },
    { key: "upload", label: "Upload Car", icon: <Upload className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
     
      <aside className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-md">
        <h2 className="text-xl font-bold text-center py-3 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
          Seller Panel
        </h2>
        <nav className="flex overflow-x-auto gap-2 px-2 py-3 scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm whitespace-nowrap">
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 🖥️ Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white shadow-xl border-r border-gray-100 p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-8 text-center">
          Seller Panel
        </h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === item.key
                  ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CarMazik
        </div>
      </aside>

      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default SellerDashboardLayout;
