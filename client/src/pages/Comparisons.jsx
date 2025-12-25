import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getComparePairs } from "../api/compare";
import LoadingScreen from "../components/ui/LoadingScreen";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

const makePairs = (cars = []) => {
  const pairs = [];
  for (let i = 0; i < cars.length - 1; i += 2) {
    pairs.push([cars[i], cars[i + 1]]);
  }
  return pairs;
};

const Comparisons = () => {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getComparePairs();
        const cars = res?.data || [];
        setPairs(makePairs(cars));
      } catch (err) {
        console.error("❌ Comparisons fetch error", err);
        setPairs([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <LoadingScreen stuff={"Comparisons"}/>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Car Comparisons
      </h1>
      <p className="text-gray-600 mb-10">
        Compare popular cars side-by-side and choose the right one
      </p>

      {/* EMPTY STATE */}
      {pairs.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          🚧 Comparisons coming soon.  
          We’re preparing the best matches for you.
        </div>
      )}

      {/* GRID */}
      {pairs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pairs.map(([a, b], idx) => (
            <CompareCard key={idx} a={a} b={b} />
          ))}
        </div>
      )}
    </div>
  );
};

const CompareCard = ({ a, b }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 relative">
      {/* IMAGES */}
      <div className="flex gap-4">
        {[a, b].map((car, i) => (
          <div
            key={i}
            className="w-1/2 bg-gray-50 rounded-lg overflow-hidden"
          >
            <img
              src={
                car?.images?.[0]
                  ? `${BASE_IMAGE_URL}${car.images[0]}`
                  : "/car-placeholder.png"
              }
              alt={car.model}
              className="w-full h-40 object-cover"
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

      {/* VS BADGE */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-4">
        <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow">
          VS
        </div>
      </div>

      {/* CTA */}
      <Link
        to={`/compare/${slug}}`}
        className="block mt-6 text-center border border-orange-400 text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-50 transition"
      >
        {a.model} vs {b.model}
      </Link>
    </div>
  );
};

export default Comparisons;
