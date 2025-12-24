import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { getUpcomingCars } from "../../api/listing";
import UpcomingCarCard from "../UpcomingCarCard";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

const UpcomingCarsSection = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUpcomingCars();
        setCars(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Upcoming Cars
            </h2>
            <p className="text-gray-600">Models launching soon</p>
          </div>

          <Link to="/listings?category=upcoming">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="text-center text-gray-400">Loading upcoming cars…</div>
        ) : cars.length === 0 ? (
          <div className="text-center text-gray-500">
            🚗 No upcoming cars announced yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => (
              <UpcomingCarCard car={car} key={car._id}/>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingCarsSection;
