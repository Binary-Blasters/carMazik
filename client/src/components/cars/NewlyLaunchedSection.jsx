// components/home/NewlyLaunchedSection.jsx
import { useEffect, useState } from "react";
import { getNewlyLaunchedCars } from "../../api/car";
import NewlyLaunchedCarCard from "../NewlyLaunchedCarCard";

const NewlyLaunchedSection = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNewlyLaunchedCars();
        setCars(res.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  /* ---------------- STATES ---------------- */

  if (loading) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">
            🚀 Newly Launched Cars
          </h2>

          {/* Mobile hint */}
          {cars.length > 0 && (
            <span className="text-sm text-gray-500 md:hidden">
              Swipe →
            </span>
          )}
        </div>

        {/* EMPTY STATE */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow">
            <p className="text-xl font-semibold text-gray-700">
              🚧 Coming Soon
            </p>
            <p className="text-gray-500 mt-2">
              Newly launched cars will appear here shortly.
            </p>
          </div>
        ) : (
          <>
            {/* MOBILE – HORIZONTAL SCROLL */}
            <div className="md:hidden">
              <div
                className="
                  flex gap-4 overflow-x-auto pb-4
                  snap-x snap-mandatory
                  scrollbar-hide
                "
              >
                {cars.map((car) => (
                  <div
                    key={car._id}
                    className="min-w-[85%] snap-start"
                  >
                    <NewlyLaunchedCarCard car={car} />
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP – GRID */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {cars.map((car) => (
                <NewlyLaunchedCarCard
                  key={car._id}
                  car={car}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NewlyLaunchedSection;
