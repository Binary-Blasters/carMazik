import React, { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import LoadingScreen from "../../components/ui/LoadingScreen";
import CarmazikAlert from "../../components/ui/CarmazikAlert";
import { adminService } from "../../api/admin";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

 
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getActiveUSers();
      
      
      setUsers(res.data.data);
    } catch (err) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to fetch users",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const handleBlock = async (userId) => {
    try {
      await adminService.blockUser(userId);
      setUsers((prev) =>
        prev.filter((u) => u._id !== userId)
      );
      setAlert({
        type: "error",
        title: "User Blocked",
        message: "User has been blocked successfully.",
      });
    } catch {
      setAlert({
        type: "error",
        title: "Action Failed",
        message: "Unable to block user.",
      });
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await adminService.unblockUser(userId);
      fetchUsers(); // reload active users
      setAlert({
        type: "success",
        title: "User Unblocked",
        message: "User has been unblocked successfully.",
      });
    } catch {
      setAlert({
        type: "error",
        title: "Action Failed",
        message: "Unable to unblock user.",
      });
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading users..." />;
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl transition-all duration-300">
      {alert && (
        <CarmazikAlert {...alert} onClose={() => setAlert(null)} />
      )}

      {/* HEADER */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
        <UsersIcon className="h-6 w-6 text-orange-500" />
        Users Management
      </h2>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-center font-semibold">Status</th>
              <th className="px-4 py-3 text-center font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50/70 transition"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {user.phonenumber || "—"}
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                    Active
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleBlock(user._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <ShieldX className="h-4 w-4" />
                    Block
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No active users found.
          </p>
        )}
      </div>
    </div>
  );
}
