import React from "react";
import { Calendar, Bell } from "lucide-react";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

const UpcomingCarCard = ({ car = {} }) => {
  const imageSrc =
    car?.images?.length > 0
      ? `${BASE_IMAGE_URL}${car.images[0]}`
      : car.image
      ? `${BASE_IMAGE_URL}${car.image}`
      : car.img
      ? `${BASE_IMAGE_URL}${car.img}`
      : "/car-placeholder.png";

  const title =
    `${car.brand || ""} ${car.model || ""}`.trim() || "Upcoming Car";

  const launchDate = car.expectedLaunchDate
    ? new Date(car.expectedLaunchDate).toDateString()
    : "To Be Announced";

  const priceRange = car.priceRange || car.expectedPrice || null;

  const fuelType = car.fuelType || "";
  const isElectric = fuelType.toLowerCase() === "electric";

  return (
    <Card
      className={`group overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl border-gray-200 ${
        isElectric ? "ring-1 ring-green-100" : ""
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/car-placeholder.png";
          }}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
          Upcoming
        </Badge>

        {isElectric && (
          <span className="absolute top-12 left-3 inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
            ⚡ Electric
          </span>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate">{title}</h3>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          Launch: {launchDate}
        </div>

        {priceRange && (
          <div className="mb-3">
            <span className="text-blue-600 font-semibold">
              Expected: {priceRange}
            </span>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
        >
          <Bell className="h-4 w-4" />
          Notify Me
        </Button>
      </CardContent>
    </Card>
  );
};

export default UpcomingCarCard;
