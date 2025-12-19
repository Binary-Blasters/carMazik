// src/components/CarCard.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  Droplet,
  Settings,
  MapPin,
  Calendar,
  Shield,
  Zap,
} from "lucide-react";

import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/button";
import { Badge } from "./ui/Badge";

import {
  addToWishlist,
  removeFromWishlist,
} from "../app/slice/wishlistSlice";


const CarCard = ({ car = {}, onViewDetails }) => {
  /* =====================
     Redux + Router
  ===================== */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locationRoute = useLocation();

  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  /* =====================
     Helpers
  ===================== */
  const formatPrice = (price) => {
    const num =
      typeof price === "number"
        ? price
        : Number(String(price || "").replace(/[^\d]/g, ""));
    if (!num) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatMileage = (mileage) => {
    const num =
      typeof mileage === "number"
        ? mileage
        : Number(String(mileage || "").replace(/[^\d]/g, ""));
    if (!num && num !== 0) return "-";
    return new Intl.NumberFormat("en-IN").format(num);
  };

  /* =====================
     Normalized car fields
  ===================== */
  const imageSrc = car.image || car.img || "/images/car-placeholder.png";
  const title = car.name || car.title || car.model || "Unknown Model";
  const year = car.year || car.manufactureYear || "-";
  const transmission = car.transmission || "N/A";
  const fuelType = car.fuelType || car.fuel || "N/A";
  const mileage = car.mileage || car.km || 0;
  const location = (car.location || "").toString();
  const shortLocation = location ? location.split(",")[0] : "Unknown";
  const price = car.price || car.amount || null;
  const originalPrice = car.originalPrice || car.oldPrice || null;
  const id = car._id || car.id || car.slug || null;

  const isElectric =
    (fuelType && fuelType.toString().toLowerCase().includes("electric")) ||
    car.isElectric === true;

  /* =====================
     Wishlist logic
  ===================== */
  const isWishlisted = wishlistItems?.some(
    (item) => (item._id || item.id) === id
  );

  const handleWishlistToggle = () => {
    // 🔐 Login compulsory
    if (!user) {
      navigate("/login", { state: { from: locationRoute.pathname } });
      return;
    }

    if (!id) return;

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  /* =====================
     View details
  ===================== */
  const handleView = () => {
    if (typeof onViewDetails === "function") {
      onViewDetails(car);
    }
  };

  /* =====================
     JSX
  ===================== */
  return (
    <Card
      className={`group overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl border-gray-200 ${
        isElectric ? "ring-1 ring-green-50" : ""
      }`}
      role="article"
      aria-labelledby={`car-title-${id || Math.random()}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          onError={(e) =>
            (e.currentTarget.src = "/images/car-placeholder.png")
          }
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* ❤️ Wishlist button (UPDATED) */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
          aria-label="Toggle wishlist"
          type="button"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Certified badge */}
        {car.certified && (
          <Badge
            className={`absolute top-3 left-3 ${
              isElectric
                ? "bg-green-400/90 text-green-900"
                : "bg-green-500 text-white"
            }`}
          >
            <Shield className="h-3 w-3 mr-1" />
            Certified
          </Badge>
        )}

        {/* Electric badge */}
        {isElectric && (
          <span className="absolute top-12 left-3 inline-flex items-center gap-1 bg-gradient-to-r from-green-200 to-green-300 text-green-800 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
            <Zap className="h-3 w-3" />
            Electric
          </span>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3
            id={`car-title-${id || Math.random()}`}
            className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
          >
            {title}
          </h3>
          <p className="text-sm text-gray-500">{year}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-1 text-gray-400" />
            <span>{transmission}</span>
          </div>
          <div className="flex items-center">
            <Droplet className="h-4 w-4 mr-1 text-gray-400" />
            <span>{fuelType}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
            <span>{formatMileage(mileage)} km</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span className="truncate">{shortLocation}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>

          {typeof onViewDetails === "function" ? (
            <Button
              onClick={handleView}
              className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
            >
              View Details
            </Button>
          ) : id ? (
            <Link to={`/car/${id}`}>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white">
                View Details
              </Button>
            </Link>
          ) : (
            <Button className="w-full bg-gray-300 text-gray-700">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;
