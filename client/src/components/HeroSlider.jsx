import React, { useState } from "react";
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
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800",
  },
  {
    title: "Drive into the Future",
    subtitle: "Explore electric and hybrid cars across top brands",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800",
  },
  {
    title: "Luxury Meets Performance",
    subtitle: "Discover the perfect balance between comfort and power",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
  },
];

const HeroSlider = () => {
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedType, setSelectedType] = useState("");

  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      effect="fade"
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={true}
      pagination={{ clickable: true }}
      className="w-full h-[90vh]"
    >
      {slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div
            className="relative w-full h-full bg-cover bg-center flex items-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-black/50 to-transparent"></div>

            {/* --- Two Column Layout (Text Left + Form Right) --- */}
            <div className="relative z-10 w-full px-8 md:px-20 lg:px-32 flex flex-col md:flex-row justify-between items-center gap-8">
              {/* LEFT SIDE: TEXT */}
              <div className="text-white text-left max-w-xl">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-md mb-4">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                  {slide.subtitle}
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 text-white font-semibold rounded-lg px-6 py-3">
                  Explore Now
                </Button>
              </div>

              {/* RIGHT SIDE: FORM */}
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-5 md:p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Search Your Dream Car
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Select 1 */}
                  <Select
                    value={selectedBudget}
                    onValueChange={setSelectedBudget}
                  >
                    <SelectTrigger className="bg-white/80 text-gray-800 rounded-lg">
                      <SelectValue placeholder="Select Budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Select 2 */}
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-white/80 text-gray-800 rounded-lg">
                      <SelectValue placeholder="Vehicle Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["SUV", "Sedan", "Hatchback", "Luxury"].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Search Button */}
                  <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:opacity-90 text-white font-semibold rounded-lg py-2">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;
