import React, { useEffect, useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  ShieldX,
  Eye,
} from "lucide-react";
import LoadingScreen from "../../components/ui/LoadingScreen";
import CarmazikAlert from "../../components/ui/CarmazikAlert";
import { adminService } from "../../api/admin";
import SellerProfileModal from "../../components/admin/SellerProfileModal";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function PendingSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [selectedSeller, setSelectedSeller] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  
  const fetchPendingSellers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingSellers();
      setSellers(res.data.data);
    } catch (error) {
      setAlert({
        type: "error",
        title: "Fetch Failed",
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const handleViewProfile = async (sellerId) => {
    try {
      setProfileLoading(true);
      const res = await adminService.getSellerById(sellerId);
      setSelectedSeller(res.data.data);
    } catch (error) {
      setAlert({
        type: "error",
        title: "Profile Load Failed",
        message: getErrorMessage(error),
      });
    } finally {
      setProfileLoading(false);
    }
  };

 
  const handleApprove = async (sellerId) => {
    try {
      await adminService.approveSeller(sellerId);
      setSellers((prev) => prev.filter((s) => s._id !== sellerId));
      setAlert({
        type: "success",
        title: "Seller Approved",
        message: "Seller approved successfully.",
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Approval Failed",
        message: getErrorMessage(error),
      });
    }
  };

  const handleReject = async (sellerId) => {
    try {
      await adminService.rejectSeller(sellerId);
      setSellers((prev) => prev.filter((s) => s._id !== sellerId));
      setAlert({
        type: "error",
        title: "Seller Rejected",
        message: "Seller rejected successfully.",
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Rejection Failed",
        message: getErrorMessage(error),
      });
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading pending sellers..." />;
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl">
      {alert && (
        <CarmazikAlert {...alert} onClose={() => setAlert(null)} />
      )}

      <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
        <UserCheck className="h-6 w-6 text-orange-500" />
        Pending Sellers
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Shop</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((seller) => (
              <tr
                key={seller._id}
                className="border-t hover:bg-gray-50/70"
              >
                <td className="px-4 py-3 font-medium">
                  {seller.userid?.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {seller.userid?.email}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {seller.userid?.phonenumber}
                </td>
                <td className="px-4 py-3">
                  {seller.shopName || "—"}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleViewProfile(seller._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>

                    <button
                      onClick={() => handleApprove(seller._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-green-600 text-white"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(seller._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-red-600 text-white"
                    >
                      <ShieldX className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sellers.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No pending sellers found.
          </p>
        )}
      </div>

      
      {selectedSeller && (
        <SellerProfileModal
          seller={selectedSeller}
          loading={profileLoading}
          onClose={() => setSelectedSeller(null)}
        />
      )}
    </div>
  );
}
