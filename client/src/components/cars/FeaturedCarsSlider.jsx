import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarCard from "../CarCard";

const AUTO_DELAY = 4000;

const FeaturedCarsSlider = ({ cars = [] }) => {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const intervalRef = useRef(null);

  const total = cars.length;

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setVisibleCards(4);
      else if (window.innerWidth >= 768) setVisibleCards(2);
      else setVisibleCards(1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(total - visibleCards, 0);
  const isSliderNeeded = total > visibleCards;

  const startAuto = () => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTO_DELAY);
  };

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isSliderNeeded) return;
    startAuto();
    return stopAuto;
  }, [visibleCards, isSliderNeeded]);

  
  if (!isSliderNeeded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative max-w-full overflow-hidden"
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out will-change-transform"
          style={{
            transform: `translateX(-${(index * 100) / visibleCards}%)`,
          }}
        >
          {cars.map((car) => (
            <div
              key={car._id}
              className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4"
            >
             
              <div className="px-2">
                <CarCard car={car} />
              </div>
            </div>
          ))}
        </div>
      </div>

    
      <button
        onClick={() => setIndex(index === 0 ? maxIndex : index - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow z-10"
      >
        <ChevronLeft />
      </button>

      
      <button
        onClick={() => setIndex(index === maxIndex ? 0 : index + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow z-10"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default FeaturedCarsSlider;
