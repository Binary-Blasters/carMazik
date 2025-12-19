import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, CarFront } from "lucide-react";
import { Button } from "../ui/button";
import { getLatestCars } from "../../api/car";
import TempCarCard from "./TempCarCard";
import CarmazikAlert from "../ui/CarmazikAlert";
import CarCard from "../CarCard";

const LatestCarsSection = () => {
  const [latestCars, setLatestCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchLatestCars = async () => {
      try {
        const res = await getLatestCars();
        const cars = res?.data || [];

       
        const sortedCars = cars
          .filter((car) => car.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        setLatestCars(sortedCars);
      } catch (error) {
        console.error("❌ Error fetching latest cars:", error);
        setAlert({
          type: "error",
          title: "Failed to Load Cars",
          message:
            error.response?.data?.message ||
            "Something went wrong while fetching latest cars.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLatestCars();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Latest Cars
            </h2>
            <p className="text-gray-600">Recently added and trending cars</p>
          </div>
          <Link to="/listings?category=latest">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

       
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
            <p>Fetching the latest cars...</p>
          </div>
        ) : latestCars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <CarFront className="h-16 w-16 text-gray-400 mb-3" />
            <p className="text-lg font-medium">No latest cars found!</p>
            <p className="text-sm text-gray-400">
              Check back later for newly added cars.
            </p>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestCars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>

      {alert && <CarmazikAlert {...alert} onClose={() => setAlert(null)} />}
    </section>
  );
};

export default LatestCarsSection;
