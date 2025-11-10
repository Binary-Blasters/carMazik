import React, { useEffect, useState } from "react";
import { getSellerSoldCars } from "../../api/car";
import {
  CarFront,
  Calendar,
  IndianRupee,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import CarmazikAlert from "../ui/CarmazikAlert";
import LoadingScreen from "../ui/LoadingScreen";

const SoldCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchSoldCars = async () => {
      try {
        const res = await getSellerSoldCars();
        setCars(res?.data || []);
      } catch (err) {
        console.error("❌ Error fetching sold cars:", err);
        setAlert({
          type: "error",
          title: "Failed to Load",
          message:
            err.response?.data?.message ||
            "Something went wrong while fetching sold cars.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSoldCars();
  }, []);

  if (loading) return <LoadingScreen message="Fetching your sold cars..." />;

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-3">
        <CheckCircle2 className="text-green-600 h-7 w-7" /> Sold Cars
      </h2>

      {cars.length === 0 ? (
        <div className="text-center text-gray-600 mt-20">
          <CarFront className="mx-auto h-16 w-16 text-gray-400 mb-3" />
          <p className="text-lg font-medium">No sold cars found!</p>
          <p className="text-sm text-gray-500">
            Once a car is marked as sold, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="relative">
                <img
                  src={
                    car?.images?.[0]
                      ? `/images/${car.images[0]}`
                      : "https://via.placeholder.com/400x250?text=Car+Image"
                  }
                  alt={car.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Sold
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {car.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {car.brand} • {car.model} • {car.variant}
                </p>

                <div className="flex items-center gap-2 text-gray-700 text-sm mb-1">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  {car.year}
                </div>

                <div className="flex items-center gap-2 text-gray-700 text-sm mb-1">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  {car.price?.toLocaleString("en-IN")}
                </div>

                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <CarFront className="h-4 w-4 text-orange-500" />
                  {car.kmDriven} km • {car.fuelType}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Sold on:{" "}
                    {new Date(car.updatedAt).toLocaleDateString("en-IN")}
                  </span>
                  <span className="text-green-600 font-medium text-sm">
                    Completed ✅
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {alert && <CarmazikAlert {...alert} onClose={() => setAlert(null)} />}
    </div>
  );
};

export default SoldCars;
