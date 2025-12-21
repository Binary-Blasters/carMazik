import React, { useEffect, useState } from "react";
import {
  Car,
  UserCheck,
  Users,
  UserX,
  ShieldCheck,
  Store,
} from "lucide-react";
import AdminStatCard from "../../components/admin/AdminStatCard";
import LoadingScreen from "../../components/ui/LoadingScreen";
import CarmazikAlert from "../../components/ui/CarmazikAlert";
import { adminService } from "../../api/admin";
import { getErrorMessage } from "../../utils/getErrorMessage";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  /* ---------------- LOAD STATS ---------------- */
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStats();
      setStats(res.data.data); // ApiResponse -> data
    } catch (error) {
      setAlert({
        type: "error",
        title: "Failed to Load Stats",
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading admin statistics..." />;
  }

  return (
    <div>
      {alert && (
        <CarmazikAlert {...alert} onClose={() => setAlert(null)} />
      )}

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
        <ShieldCheck className="text-orange-500" />
        Admin Control Panel
      </h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Pending Cars"
          value={stats?.pendingCars ?? "--"}
          icon={<Car className="text-orange-600" />}
        />

        <AdminStatCard
          title="Pending Sellers"
          value={stats?.pendingSellers ?? "--"}
          icon={<UserCheck className="text-blue-600" />}
        />

        <AdminStatCard
          title="Total Users"
          value={stats?.totalUsers ?? "--"}
          icon={<Users className="text-green-600" />}
        />

        <AdminStatCard
          title="Blocked Users"
          value={stats?.blockedUsers ?? "--"}
          icon={<UserX className="text-red-600" />}
        />

        <AdminStatCard
          title="Active Sellers"
          value={stats?.totalSellers ?? "--"}
          icon={<Store className="text-purple-600" />}
        />

        <AdminStatCard
          title="Approved Cars"
          value={stats?.totalCars ?? "--"}
          icon={<Car className="text-green-600" />}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
