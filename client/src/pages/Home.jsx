// src/pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Shield, Award, HeadphonesIcon, CheckCircle, TrendingUp, Star, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import CarCard from "../components/CarCard";
import { mockCars, brands, budgetRanges } from "../mockData";

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

  // --- NEW: derive arrays for sections (use fields if present, otherwise fallback) ---
  const latestCars =
    // if mockCars has createdAt or addedAt, you could sort; fallback to first 4
    mockCars
      .slice()
      .sort((a, b) => {
        // try sorting by createdAt if available (ISO string or timestamp)
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        // fallback: preserve order
        return 0;
      })
      .slice(0, 4);

  const electricCars = mockCars.filter(
    (c) =>
      // try commonly used flags
      c.fuelType?.toLowerCase?.() === "electric" ||
      c.isElectric === true ||
      (c.tags && c.tags.includes && c.tags.includes("electric"))
  );
  // fallback if none found
  const electricCarsToShow = electricCars.length > 0 ? electricCars.slice(0, 4) : mockCars.slice(4, 8);

  const upcomingCars = mockCars.filter(
    (c) => c.upcoming === true || (c.tags && c.tags.includes && c.tags.includes("upcoming"))
  );
  const upcomingCarsToShow = upcomingCars.length > 0 ? upcomingCars.slice(0, 4) : mockCars.slice(8, 12);

  const handleViewDetails = (car) => {
    // navigate to car details page if route exists
    if (car?.id) navigate(`/car/${car.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Find Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                Perfect Car
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from 1000+ certified cars with warranty and best prices
            </p>
          </div>

          {/* Search Box */}
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((range) => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search Cars
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">1000+</div>
              <div className="text-gray-600">Quality Cars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">50+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">10000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">98%</div>
              <div className="text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600">Explore cars by body type</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* reuse categories from previous code if needed; keeping placeholder here */}
            <Link
              key="hatchback"
              to={`/listings?category=hatchback`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400"
                alt="Hatchback"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold">Hatchback</h3>
                <p className="text-white/80 text-sm">150+ Cars</p>
              </div>
            </Link>

            <Link
              key="sedan"
              to={`/listings?category=sedan`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400"
                alt="Sedan"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold">Sedan</h3>
                <p className="text-white/80 text-sm">120+ Cars</p>
              </div>
            </Link>

            <Link
              key="suv"
              to={`/listings?category=suv`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400"
                alt="SUV"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold">SUV</h3>
                <p className="text-white/80 text-sm">200+ Cars</p>
              </div>
            </Link>

            <Link
              key="luxury"
              to={`/listings?category=luxury`}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400"
                alt="Luxury"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-bold">Luxury</h3>
                <p className="text-white/80 text-sm">80+ Cars</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Cars</h2>
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

      {/* Latest Cars (NEW) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest Cars</h2>
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

      {/* Electric Cars (NEW) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Electric Cars</h2>
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

      {/* Upcoming Cars (NEW) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Upcoming Cars</h2>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose CarHub?</h2>
            <p className="text-gray-600">We make car buying simple and trustworthy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Certified Quality</h3>
              <p className="text-gray-600">Every car undergoes 200+ quality checks</p>
            </div>
            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Warranty Included</h3>
              <p className="text-gray-600">Up to 2 years comprehensive warranty</p>
            </div>
            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Best Price</h3>
              <p className="text-gray-600">Competitive prices with financing options</p>
            </div>
            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <HeadphonesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Dedicated support team always ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials (unchanged) */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">Real stories from real customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* keep your testimonial map from original Home.jsx */}
          </div>
        </div>
      </section>

      {/* CTA Section (unchanged) */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Dream Car?</h2>
          <p className="text-xl text-white/90 mb-8">Browse thousands of certified cars with warranty and best prices</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/listings">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Browse All Cars
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20 w-full sm:w-auto">
              Sell Your Car
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
