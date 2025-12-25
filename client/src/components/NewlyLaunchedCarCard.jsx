// components/NewlyLaunchedCarCard.jsx
import { Calendar, Zap } from "lucide-react";
import { Button } from "./ui/Button";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

const NewlyLaunchedCarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
      <div className="relative">
        <img
          src={`${BASE_IMAGE_URL}${car.images?.[0]}`}
          className="h-48 w-full object-cover"
        />

        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
          🚀 New Launch
        </span>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg">
          {car.brand} {car.model}
        </h3>

        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          Launched on{" "}
          {new Date(car.launchedAt).toLocaleDateString()}
        </p>

        <p className="text-blue-600 font-semibold">
          Starting ₹{car.price || "—"}
        </p>

        <Button className="w-full mt-2">
          Explore Launch
        </Button>
      </div>
    </div>
  );
};

export default NewlyLaunchedCarCard;
