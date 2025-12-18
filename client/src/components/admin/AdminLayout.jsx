import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <Outlet />
      </main>
      
    </div>
  );
};

export default AdminLayout;
