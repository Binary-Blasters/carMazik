import React from "react";
import { Star, Fuel, Gauge, Calendar, IndianRupee } from "lucide-react";
import { Link } from "react-router";

export default function ApprovedCarCard({ car }) {

    const BASE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:4000";

      const imageUrl = car?.images?.[0]
    ? `${BASE_URL}${car.images[2]}`
    : "https://via.placeholder.com/400x250";

    

    
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={imageUrl || "https://via.placeholder.com/400x250"}
          alt={car?.name || "Car"}
          className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
          Approved
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {car?.brand} {car?.model}
        </h3>

        <div className="flex items-center text-sm text-gray-500 space-x-3">
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4 text-blue-500" />
            <span>{car?.fuelType || "Petrol"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4 text-orange-500" />
            <span>{car?.mileage || "15"} km/l</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-500 space-x-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-purple-500" />
            <span>{car?.year || "2022"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>4.5</span>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
            <IndianRupee className="h-5 w-5" />
            {car?.price ? car.price.toLocaleString("en-IN") : "—"}
          </span>

          <Link to={`/car/${car._id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
