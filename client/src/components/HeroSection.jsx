import React from "react";
import HeroSlider from "./HeroSlider";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      <HeroSlider />

     
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
