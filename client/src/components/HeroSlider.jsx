import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { budgetRanges } from "../mockData";

const slides = [
  {
    title: "Find Your Perfect Car",
    subtitle: "Browse thousands of certified cars with best prices",
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1600",
  },
  {
    title: "Drive into the Future",
    subtitle: "Explore electric and hybrid cars across top brands",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1600",
  },
  {
    title: "Luxury Meets Performance",
    subtitle: "Discover the perfect balance between comfort and power",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1600",
  },
];

const HeroSlider = () => {
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBudget) params.append("budget", selectedBudget);
    if (selectedType) params.append("type", selectedType);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="relative w-full h-[90vh]">
      {/* ================= SLIDER ================= */}
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="relative w-full h-full bg-cover bg-center flex items-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-black/50 to-transparent" />

              {/* text */}
              <div className="relative z-10 px-6 md:px-20 lg:px-32 text-white max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8">
                  {slide.subtitle}
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg">
                  Explore Now
                </Button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ================= SEARCH FORM (OUTSIDE SWIPER) ================= */}
      <div className="absolute right-6 md:right-20 lg:right-32 top-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-5 shadow-2xl relative z-40">
          <h3 className="text-xl font-semibold text-white mb-4">
            Search Your Dream Car
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Budget */}
            <Select
              value={selectedBudget}
              onValueChange={setSelectedBudget}
            >
              <SelectTrigger className="bg-white/90 text-gray-800 rounded-lg">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>

              {/* 🔥 IMPORTANT FIX */}
              <SelectContent className="bg-white text-gray-900 shadow-lg border rounded-md z-[9999]">
                {budgetRanges.map((range) => (
                  <SelectItem key={range.label} value={range.label}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Vehicle Type */}
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger className="bg-white/90 text-gray-800 rounded-lg">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>

              {/* 🔥 IMPORTANT FIX */}
              <SelectContent className="bg-white text-gray-900 shadow-lg border rounded-md z-[9999]">
                {["SUV", "Sedan", "Hatchback", "Luxury"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-orange-500 text-white font-semibold rounded-lg w-full md:w-auto"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
