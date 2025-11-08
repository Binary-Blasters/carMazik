import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../app/slice/profile.slice";
import {
  Loader2,
  User,
  Building2,
  FileText,
  CreditCard,
  Briefcase,
  XCircle,
  CheckCircle2,
  DollarSign,
  UploadCloud,
} from "lucide-react";
import SellerDashboardLayout from "../../components/dashboard/SellerDashboardLayout";
import UploadCarForm from "../seller/UploadCarForm";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    dispatch(fetchProfile("seller"));
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
      </div>
    );

  if (error)
    return <div className="text-center text-red-500 mt-10 font-medium">{error}</div>;

  if (!data) return null;

  const seller = data;
  const user = data.userid;

  return (
    <SellerDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* 👤 PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2 flex-wrap">
            <User className="h-6 w-6 text-orange-500" /> Welcome,{" "}
            <span className="font-semibold">{user?.name}</span>
          </h2>

          {/* 🧩 Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            {/* Personal Info */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-blue-600" /> Personal Info
              </h3>
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phonenumber}</p>
            </div>

            {/* Business Info */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-orange-600" /> Business Info
              </h3>
              <p><strong>Shop:</strong> {seller.shopName || "N/A"}</p>
              <p><strong>GST:</strong> {seller.gstNumber}</p>
              <p><strong>Address:</strong> {seller.address}</p>
            </div>

            {/* Documents */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" /> Documents
              </h3>
              <p><strong>PAN:</strong> {seller.panNumber}</p>
              <p><strong>Aadhaar:</strong> {seller.aadhaarNumber}</p>
            </div>

            {/* Bank Details */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-orange-600" /> Bank Details
              </h3>
              <p><strong>Account No:</strong> {seller.bankDetails?.accountNumber || "N/A"}</p>
              <p><strong>IFSC:</strong> {seller.bankDetails?.ifscCode || "N/A"}</p>
            </div>

            {/* Subscription */}
            <div className="sm:col-span-2 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5 text-blue-600" /> Subscription
              </h3>
              <p>
                <strong>Plan:</strong> {seller.subscription?.plan || "Free"}{" "}
                {seller.subscription?.isActive ? (
                  <span className="text-green-600 font-medium">Active ✅</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactive ❌</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 📁 EMPTY STATES */}
      {activeTab !== "profile" && activeTab !== "upload" && (
        <DashboardEmpty
          icon={
            activeTab === "approved" ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : activeTab === "rejected" ? (
              <XCircle className="h-8 w-8 text-red-600" />
            ) : activeTab === "sold" ? (
              <DollarSign className="h-8 w-8 text-blue-600" />
            ) : (
              <FileText className="h-8 w-8 text-blue-600" />
            )
          }
          title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Cars"}
          message="No data available yet."
        />
      )}

      {/* 🚘 UPLOAD TAB */}
      {activeTab === "upload" && (
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <UploadCloud className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Upload New Car
            </h2>
          </div>
          <UploadCarForm />
        </div>
      )}
    </SellerDashboardLayout>
  );
};

// 🔹 Empty State
const DashboardEmpty = ({ icon, title, message }) => (
  <div className="bg-white shadow-md border border-gray-100 p-6 sm:p-10 rounded-2xl text-center hover:shadow-lg transition-all duration-300">
    <div className="flex justify-center mb-4">{icon}</div>
    <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-2">
      {title}
    </h2>
    <p className="text-gray-600 text-sm sm:text-base">{message}</p>
  </div>
);

export default SellerDashboard;
