import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Button } from "./ui/Button";
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

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBudget) params.append("budget", selectedBudget);
    if (selectedType) params.append("type", selectedType);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="relative w-full h-[85vh] sm:h-[90vh]">
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

              <div className="relative z-10 w-full px-4 sm:px-8 md:px-16 lg:px-24 flex flex-col lg:flex-row justify-between items-center gap-10">
                {/* TEXT */}
                <div className="text-white max-w-xl text-center lg:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8">
                    {slide.subtitle}
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-lg">
                    Explore Now
                  </Button>
                </div>

                {/* FILTER BOX */}
                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-2xl">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center lg:text-left">
                    Search Your Dream Car
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select
                      value={selectedBudget}
                      onValueChange={setSelectedBudget}
                    >
                      <SelectTrigger className="bg-white text-gray-800 rounded-lg">
                        <SelectValue placeholder="Budget" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-900 shadow-lg border rounded-md z-[9999]">
                        {budgetRanges.map((range) => (
                          <SelectItem
                            key={range.label}
                            value={range.label}
                          >
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-white text-gray-800 rounded-lg">
                        <SelectValue placeholder="Vehicle Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-gray-900 shadow-lg border rounded-md z-[9999]">
                        {["SUV", "Sedan", "Hatchback", "Luxury"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={handleSearch}
                      className="bg-gradient-to-r from-blue-600 to-orange-500 text-white font-semibold rounded-lg w-full sm:col-span-2 lg:col-span-1"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSection;
