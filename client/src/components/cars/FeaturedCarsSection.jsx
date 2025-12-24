import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

import { Button } from "../ui/Button";
import { getFeaturedCars } from "../../api/listing";
import CarCard from "../CarCard";
import LoadingScreen from "../ui/LoadingScreen";
import FeaturedCarsSlider from "./FeaturedCarsSlider";

const FeaturedCarsSection = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await getFeaturedCars();
       

        setCars(res?.cars || []);
      } catch (err) {
        console.error("Failed to fetch featured cars", err);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Star className="text-yellow-500" />
              Featured Cars
            </h2>
            <p className="text-gray-600">Handpicked cars just for you</p>
          </div>

          <Link to="/listings?category=featured">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

       
        {loading ? (
          <LoadingScreen />
        ) : cars.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No featured cars available right now
          </div>
        ) : (
          <FeaturedCarsSlider cars={cars} />
        )}
      </div>
    </section>
  );
};

export default FeaturedCarsSection;
