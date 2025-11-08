import React, { useEffect, useState } from "react";
import { Loader2, Heart, Car } from "lucide-react";
import axios from "axios";

const WishlistSection = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Wishlist when mounted
  useEffect(() => {
    console.log(wishlist);
    
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/api/v1/user/wishlist", {
        withCredentials: true,
      });
      setWishlist(data?.wishlist || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-orange-500 h-8 w-8" />
      </div>
    );

  if (!wishlist.length)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="p-4 bg-orange-50 rounded-full mb-4">
          <Heart className="h-10 w-10 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No cars in your wishlist yet!
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          Browse cars and tap the ❤️ icon to add them here.
        </p>
      </div>
    );

  return (
    <div className="animate-fadeIn">
      <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
        <Heart className="h-6 w-6 text-orange-500" /> Your Wishlist
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((car) => (
          <div
            key={car._id}
            className="bg-white shadow-md p-5 rounded-xl border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {car.brand} {car.model}
              </h3>
              <Car className="h-5 w-5 text-orange-500" />
            </div>

            <p className="text-gray-600 font-medium">
              ₹ {car.price?.toLocaleString()}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              {car.year || "Unknown year"}
            </p>

            <div className="mt-3">
              <button className="text-sm px-3 py-1.5 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-md hover:opacity-90 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistSection;
