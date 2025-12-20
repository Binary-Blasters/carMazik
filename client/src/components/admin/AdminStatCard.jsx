const AdminStatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminStatCard;
