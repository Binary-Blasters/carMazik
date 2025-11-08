import React from "react";

export const Progress = ({ value = 0, className = "" }) => {
  return (
    <div
      className={`w-full bg-gray-200/60 rounded-full h-3 overflow-hidden shadow-inner ${className}`}
    >
      <div
        className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 h-3 transition-all duration-500 ease-in-out"
        style={{
          width: `${value}%`,
        }}
      ></div>
    </div>
  );
};
