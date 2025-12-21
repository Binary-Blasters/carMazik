import {
  LayoutDashboard,
  Car,
  UserCheck,
  Users,
  UserX,
  Store
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { name: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { name: "Pending Cars", to: "/admin/cars/pending", icon: Car },
  { name: "Users", to: "/admin/users", icon: Users },
  { name: "Blocked Users", to: "/admin/users/blocked", icon: UserX },
  { name: "Sellers", to: "/admin/sellers", icon: Store },
  { name: "Pending Sellers", to: "/admin/sellers/pending", icon: UserCheck },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="p-6 font-bold text-2xl bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
        CarMazik Admin
      </div>

      <nav className="px-4 space-y-1">
        {links.map(({ name, to, icon: Icon }) => (
          <NavLink
            key={name}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
