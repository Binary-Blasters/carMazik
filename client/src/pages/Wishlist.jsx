import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingScreen from "../components/ui/LoadingScreen";
import { getWishlistCars } from "../api/wishlist";
import CarCard from "../components/CarCard";

const Wishlist = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const wishlistIds = useSelector((state) => state.wishlist.items);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // if (user.role && user.role !== "user") {
    //   navigate("/");
    //   return;
    // }
  }, [user, navigate]);

  /* ---------------- FETCH WISHLIST CARS ---------------- */
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        const data = await getWishlistCars();
        setCars(data);
      } catch (err) {
        console.error("Failed to load wishlist", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadWishlist();
    }
  }, [user]);

  /* ---------------- 🔁 SYNC WITH REDUX ---------------- */
  useEffect(() => {
    setCars((prevCars) =>
      prevCars.filter((car) => wishlistIds.includes(car._id))
    );
  }, [wishlistIds]);

  /* ---------------- UI ---------------- */

  if (loading) {
    return <LoadingScreen />;
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">
          Your Wishlist is Empty ❤️
        </h2>
        <p className="text-gray-500">
          Browse cars and tap the heart icon to save them here.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        My Wishlist ❤️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
