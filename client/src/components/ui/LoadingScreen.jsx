import React from "react";
import { Loader2, CarFront } from "lucide-react";

const LoadingScreen = ({ message = "Please wait..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh] bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Glassmorphic card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-8 flex flex-col items-center animate-fadeIn">
        {/* Animated icon */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500 blur-xl opacity-30 rounded-full animate-pulse" />
          <CarFront className="relative h-12 w-12 text-orange-500 animate-bounce" />
        </div>

        {/* Spinner */}
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />

        {/* Text */}
        <h2 className="text-lg font-semibold text-gray-700 tracking-wide">
          Loading <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">CarMazik</span> Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
