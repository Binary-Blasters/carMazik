// src/pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Shield,
  Award,
  HeadphonesIcon,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import CarCard from "../components/CarCard";
import { mockCars, brands, budgetRanges } from "../mockData";
import HeroSection from "../components/HeroSection"; // ✅ Modern hero section (form + slider)

const Home = () => {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = React.useState("");
  const [selectedBudget, setSelectedBudget] = React.useState("");

  const featuredCars = mockCars.slice(0, 4);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedBrand && selectedBrand !== "All Brands") {
      params.append("brand", selectedBrand);
    }
    if (selectedBudget) {
      params.append("budget", selectedBudget);
    }
    navigate(`/listings?${params.toString()}`);
  };

  const latestCars = mockCars
    .slice()
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    })
    .slice(0, 4);

  const electricCars = mockCars.filter(
    (c) =>
      c.fuelType?.toLowerCase?.() === "electric" ||
      c.isElectric === true ||
      (c.tags && c.tags.includes("electric"))
  );
  const electricCarsToShow =
    electricCars.length > 0 ? electricCars.slice(0, 4) : mockCars.slice(4, 8);

  const upcomingCars = mockCars.filter(
    (c) => c.upcoming === true || (c.tags && c.tags.includes("upcoming"))
  );
  const upcomingCarsToShow =
    upcomingCars.length > 0 ? upcomingCars.slice(0, 4) : mockCars.slice(8, 12);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <HeroSection />

      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600">Explore cars by body type</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                key: "hatchback",
                name: "Hatchback",
                img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400",
                count: "150+ Cars",
              },
              {
                key: "sedan",
                name: "Sedan",
                img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400",
                count: "120+ Cars",
              },
              {
                key: "suv",
                name: "SUV",
                img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
                count: "200+ Cars",
              },
              {
                key: "luxury",
                name: "Luxury",
                img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
                count: "80+ Cars",
              },
            ].map((cat) => (
              <Link
                key={cat.key}
                to={`/listings?category=${cat.key}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                  <p className="text-white/80 text-sm">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Cars
              </h2>
              <p className="text-gray-600">Handpicked cars just for you</p>
            </div>
            <Link to="/listings">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Cars */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Electric Cars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Electric Cars
              </h2>
              <p className="text-gray-600">Top electric vehicles available</p>
            </div>
            <Link to="/listings?category=electric">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {electricCarsToShow.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Cars */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingCarsToShow.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Why Choose CarHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Certified Quality</h3>
              <p className="text-gray-600">
                Every car undergoes 200+ quality checks
              </p>
            </div>

            <div className="group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Warranty Included</h3>
              <p className="text-gray-600">
                Up to 2 years comprehensive warranty
              </p>
            </div>

            <div className="group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Price</h3>
              <p className="text-gray-600">
                Competitive prices with financing options
              </p>
            </div>

            <div className="group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition">
                <HeadphonesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Dedicated support team always ready</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
