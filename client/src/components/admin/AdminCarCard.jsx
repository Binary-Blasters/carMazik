import React from "react";

export default function AdminCarCard({ car, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <img
        src={`https://via.placeholder.com/400x250?text=${car.model}`}
        alt={car.model}
        className="h-40 w-full object-cover"
      />

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg">
          {car.brand} {car.model}
        </h3>

        <p className="text-sm text-gray-500">
          ₹ {car.price.toLocaleString("en-IN")}
        </p>

        <div className="flex gap-2 pt-3">
          <button
            onClick={() => onApprove(car._id)}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
          >
            Approve
          </button>

          <button
            onClick={() => onReject(car._id)}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
