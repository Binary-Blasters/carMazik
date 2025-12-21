import React, { useEffect, useState } from "react";
import { UserCheck, Store } from "lucide-react";
import LoadingScreen from "../../components/ui/LoadingScreen";
import CarmazikAlert from "../../components/ui/CarmazikAlert";
import { adminService } from "../../api/admin";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ActiveSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  
  const fetchActiveSellers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getActiveSellers();
      console.log(res.data.data);
      
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
    fetchActiveSellers();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading active sellers..." />;
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl transition-all duration-300">
      {alert && (
        <CarmazikAlert {...alert} onClose={() => setAlert(null)} />
      )}

      {/* HEADER */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
        <UserCheck className="h-6 w-6 text-green-600" />
        Active Sellers
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
                  <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                    <Store className="h-3 w-3" />
                    Approved
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sellers.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No active sellers found.
          </p>
        )}
      </div>
    </div>
  );
}
