import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { getCarsByBudget } from "../../api/listing";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

const BUDGET_TABS = [
  { id: "1-5", label: "1 - 5 Lakh", min: 100000, max: 500000 },
  { id: "5-10", label: "5 - 10 Lakh", min: 500000, max: 1000000 },
  { id: "10-15", label: "10 - 15 Lakh", min: 1000000, max: 1500000 },
];

const TrustedCarsByBudget = () => {
  const [activeTab, setActiveTab] = useState(BUDGET_TABS[0]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getCarsByBudget({
          minPrice: activeTab.min,
          maxPrice: activeTab.max,
        });
        setCars(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeTab]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">
              Trusted used cars by budget
            </h2>
            <p className="text-gray-600">
              Choose from verified cars in your budget
            </p>
          </div>

          <Link to={`/listings?minPrice=${activeTab.min}&maxPrice=${activeTab.max}`}>
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition" />
            </Button>
          </Link>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b mb-6">
          {BUDGET_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium ${
                activeTab.id === tab.id
                  ? "border-b-2 border-orange-500 text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-gray-400">Loading cars...</div>
        ) : cars.length === 0 ? (
          <div className="text-gray-500">No cars in this range</div>
        ) : (
          <div className="
            flex gap-6 overflow-x-auto pb-4
            lg:grid lg:grid-cols-4 lg:overflow-visible
          ">
            {cars.map((car) => (
              <div
                key={car._id}
                className="
                  min-w-[260px] bg-white rounded-xl shadow
                  hover:shadow-lg transition
                "
              >
                <img
                  src={`${BASE_IMAGE_URL}${car.image}`}
                  alt={car.model}
                  className="h-40 w-full object-cover rounded-t-xl"
                />

                <div className="p-4">
                  <h3 className="font-semibold">
                    {car.brand} {car.model}
                  </h3>

                  <p className="text-sm font-medium mt-1">
                    Starting @ ₹{Math.floor(car.price / 100000)} Lakh
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {car.availableCount || 120}+ Available Cars
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustedCarsByBudget;
