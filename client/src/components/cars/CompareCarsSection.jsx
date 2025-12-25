import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getComparePairs } from "../../api/compare";
import {makeSlug} from "../../utils/makeSlug";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

const makePairs = (cars = []) => {
  const pairs = [];
  for (let i = 0; i < cars.length - 1; i += 2) {
    pairs.push([cars[i], cars[i + 1]]);
  }
  return pairs;
};

const CompareCarsSection = () => {
  const [comparePairs, setComparePairs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        const res = await getComparePairs();

        
        const cars = res?.data || [];
        const pairs = makePairs(cars);

        setComparePairs(pairs);
      } catch (err) {
        console.error("❌ Compare fetch error", err);
      }
    };
    fetchPairs();
  }, []);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir * 420,
      behavior: "smooth",
    });
  };

  if (!comparePairs.length) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Compare to buy the right car
          </h2>
          <p className="text-gray-500 mt-2">
            🚧 Comparisons coming soon. We’re preparing the best matches for
            you.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Compare to buy the right car
            </h2>
            <p className="text-gray-600">Get trusted used cars nearby</p>
          </div>

          <Link
            to="/comparisons"
            className="text-sm font-medium text-orange-600 flex items-center gap-2"
          >
            View All Car Comparisons
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* SCROLL */}
        <div className="relative">
          <button
            onClick={() => scroll(-1)}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow rounded-full items-center justify-center"
          >
            ←
          </button>

          <div
            ref={scrollRef}
            className="no-scrollbar overflow-x-auto scroll-smooth"
          >
            <div className="flex gap-6 py-4">
              {comparePairs.map(([a, b], idx) => (
                <CompareCard key={idx} a={a} b={b} />
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll(1)}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white shadow rounded-full items-center justify-center"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

const CompareCard = ({ a, b }) => (
  <div className="min-w-[320px] md:min-w-[460px] bg-white rounded-2xl shadow-md p-4 relative">
    <div className="flex gap-3">
      {[a, b].map((car, i) => (
        <div key={i} className="w-1/2 bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={
              car?.images?.[0]
                ? `${BASE_IMAGE_URL}${car.images[0]}`
                : "/car-placeholder.png"
            }
            alt={car.model}
            className="w-full h-36 object-cover"
          />
          <div className="p-3">
            <div className="text-xs text-gray-500">{car.brand}</div>
            <div className="font-semibold">{car.model}</div>
            <div className="text-sm text-gray-600">
              ₹{Number(car.price).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="absolute left-1/2 -translate-x-1/2 -top-4">
      <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow">
        VS
      </div>
    </div>

    <Link
      to={`/compare/${makeSlug(a, b)}`}
      className="block text-center border border-orange-400 text-orange-600 py-2 rounded-lg mt-4 font-medium hover:bg-orange-50"
    >
      {a.model} vs {b.model}
    </Link>
  </div>
);

export default CompareCarsSection;
