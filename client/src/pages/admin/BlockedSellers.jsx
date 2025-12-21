import React, { useEffect, useState } from "react";
import { UserX, ShieldCheck, Store } from "lucide-react";
import LoadingScreen from "../../components/ui/LoadingScreen";
import CarmazikAlert from "../../components/ui/CarmazikAlert";
import { adminService } from "../../api/admin";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function BlockedSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [alert, setAlert] = useState(null);

  /* ---------------- LOAD BLOCKED SELLERS ---------------- */
  const fetchBlockedSellers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBlockedSellers();
      setSellers(res.data.data); // ApiResponse -> data
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
    fetchBlockedSellers();
  }, []);

  /* ---------------- UNBLOCK SELLER ---------------- */
  const handleUnblock = async (sellerId) => {
    try {
      setActionLoading(sellerId);
      await adminService.unblockSeller(sellerId);

      // optimistic update
      setSellers((prev) =>
        prev.filter((s) => s._id !== sellerId)
      );

      setAlert({
        type: "success",
        title: "Seller Unblocked",
        message: "Seller has been unblocked successfully.",
      });
    } catch (error) {
      setAlert({
        type: "error",
        title: "Unblock Failed",
        message: getErrorMessage(error),
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading blocked sellers..." />;
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl transition-all duration-300">
      {alert && (
        <CarmazikAlert {...alert} onClose={() => setAlert(null)} />
      )}

      {/* HEADER */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
        <UserX className="h-6 w-6 text-red-600" />
        Blocked Sellers
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                Seller Name
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Shop Name
              </th>
              <th className="px-4 py-3 text-left font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {sellers.map((seller) => (
              <tr
                key={seller._id}
                className="border-t hover:bg-gray-50/70 transition"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {seller.userid?.name || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {seller.userid?.email || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {seller.userid?.phonenumber || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {seller.shopName || "—"}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    <Store className="h-3 w-3" />
                    Blocked
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    disabled={actionLoading === seller._id}
                    onClick={() => handleUnblock(seller._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {actionLoading === seller._id
                      ? "Unblocking..."
                      : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sellers.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No blocked sellers found.
          </p>
        )}
      </div>
    </div>
  );
}
