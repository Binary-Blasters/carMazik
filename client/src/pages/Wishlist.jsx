// src/pages/Wishlist.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchWishlist } from "../redux/wishlistSlice";
import CarCard from "../components/CarCard";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);

  /* =====================
     Route Protection
  ===================== */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // agar role system hai
    if (user.role && user.role !== "user") {
      navigate("/");
      return;
    }

    dispatch(fetchWishlist());
  }, [user, dispatch, navigate]);

  /* =====================
     Loading
  ===================== */
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading wishlist...
      </div>
    );
  }

  /* =====================
     Empty State
  ===================== */
  if (!items || items.length === 0) {
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

  /* =====================
     Wishlist Grid
  ===================== */
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        My Wishlist ❤️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((car) => (
          <CarCard key={car._id || car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
