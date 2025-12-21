import {
  Car,
  UserCheck,
  Users,
  UserX,
  ShieldCheck,
} from "lucide-react";
import AdminStatCard from "../../components/admin/AdminStatCard";

const AdminDashboard = () => {
  
  const stats = {
    pendingCars: 12,
    pendingSellers: 5,
    users: 320,
    blockedUsers: 18,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
        <ShieldCheck className="text-orange-500" />
        Admin Control Panel
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Pending Cars"
          value={stats.pendingCars}
          icon={<Car className="text-orange-600" />}
        />
        <AdminStatCard
          title="Pending Sellers"
          value={stats.pendingSellers}
          icon={<UserCheck className="text-blue-600" />}
        />
        <AdminStatCard
          title="Total Users"
          value={stats.users}
          icon={<Users className="text-green-600" />}
        />
        <AdminStatCard
          title="Blocked Users"
          value={stats.blockedUsers}
          icon={<UserX className="text-red-600" />}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
