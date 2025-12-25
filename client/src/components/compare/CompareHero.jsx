import { ArrowRight } from "lucide-react";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

const CompareHero = ({ carA, carB }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 items-center bg-white rounded-2xl shadow p-6">

      {/* CAR A */}
      <div className="text-center">
        <img
          src={
            carA.images?.[0]
              ? `${BASE_IMAGE_URL}${carA.images[0]}`
              : "/car-placeholder.png"
          }
          className="h-48 mx-auto object-cover rounded-xl"
        />
        <h2 className="text-xl font-bold mt-3">{carA.brand} {carA.model}</h2>
        <p className="text-gray-500">{carA.fuelType} • {carA.transmission}</p>
        <p className="text-lg font-semibold text-green-600 mt-1">
          ₹{Number(carA.price).toLocaleString()}
        </p>
      </div>

      {/* VS */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-gray-900 text-white w-14 h-14 rounded-full items-center justify-center shadow-lg">
        VS
      </div>

      {/* CAR B */}
      <div className="text-center">
        <img
          src={
            carB.images?.[0]
              ? `${BASE_IMAGE_URL}${carB.images[0]}`
              : "/car-placeholder.png"
          }
          className="h-48 mx-auto object-cover rounded-xl"
        />
        <h2 className="text-xl font-bold mt-3">{carB.brand} {carB.model}</h2>
        <p className="text-gray-500">{carB.fuelType} • {carB.transmission}</p>
        <p className="text-lg font-semibold text-green-600 mt-1">
          ₹{Number(carB.price).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CompareHero;
