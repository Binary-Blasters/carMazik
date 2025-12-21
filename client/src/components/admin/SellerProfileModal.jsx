import { X, Building2, User } from "lucide-react";

export default function SellerProfileModal({ seller, loading, onClose }) {
  if (loading) return null;

  const user = seller.userid;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
          <User className="text-orange-500" />
          Seller Profile
        </h3>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Phone:</strong> {user?.phonenumber}
          </p>

          <hr />

          <p className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-orange-500" />
            <strong>Shop:</strong> {seller.shopName}
          </p>
          <p>
            <strong>GST:</strong> {seller.gstNumber}
          </p>
          <p>
            <strong>Address:</strong> {seller.address}
          </p>
        </div>
      </div>
    </div>
  );
}
