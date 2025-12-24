// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Award,
  HeadphonesIcon,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import CarCard from "../components/CarCard";
import { mockCars, brands, budgetRanges } from "../mockData";
import HeroSection from "../components/HeroSection";
import CarmazikAlert from "../components/ui/CarmazikAlert"
import {getLatestCars} from "../api/car"
import LoadingScreen from "../components/ui/LoadingScreen";
import LatestCarsSection from "../components/cars/LatestCarsSection";
import ElectricCarSection from "../components/cars/ElectricCarSection";
import BrowseByCategory from "../components/cars/BrowseByCategory";
import FeaturedCarsSection from "../components/cars/FeaturedCarsSection";
import UpcomingCarsSection from "../components/cars/UpcomingCarsSection";

const Home = () => {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  

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

  // helper: parse numeric price (works with number or strings like "₹ 5,00,000")
  const parsePrice = (p) => {
    if (typeof p === "number") return p;
    if (!p) return 0;
    const digits = String(p).replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  // --- Trusted used cars by budget ---
  const normalizedBudgetRanges =
    Array.isArray(budgetRanges) &&
    budgetRanges.length > 0 &&
    (budgetRanges[0].hasOwnProperty("min") ||
      budgetRanges[0].hasOwnProperty("max"))
      ? budgetRanges
      : [
          { label: "Under 5 Lakh", min: 0, max: 500000 },
          { label: "5-10 Lakh", min: 500000, max: 1000000 },
          { label: "10-20 Lakh", min: 1000000, max: 2000000 },
          {
            label: "Above 20 Lakh",
            min: 2000000,
            max: Number.POSITIVE_INFINITY,
          },
        ];

  const budgetGroups = normalizedBudgetRanges.map((bg, idx) => {
    const min = bg.min ?? 0;
    const max = bg.max ?? Number.POSITIVE_INFINITY;
    const carsInRange = mockCars.filter((c) => {
      const price = parsePrice(c.price);
      return price >= min && price < max;
    });
    return {
      id: bg.label
        ? bg.label.replace(/\s+/g, "-").toLowerCase()
        : `budget-${idx}`,
      title: bg.title ?? bg.label ?? `Range ${idx + 1}`,
      cars: carsInRange,
    };
  });

  // === Popular brands (with logos) ===
  // Replace these URLs with your local assets or preferred CDN if you have them.
  const brandLogos = {
    "Maruti Suzuki": "https://wallpapercave.com/wp/wp3593846.jpg",
    Hyundai:
      "https://logosmarcas.net/wp-content/uploads/2021/04/Hyundai-Logo.png",
    Tata: "https://logos-world.net/wp-content/uploads/2021/10/Tata-Symbol.png",
    Honda:
      "https://logos-world.net/wp-content/uploads/2021/03/Honda-Emblem.png",
    Mahindra:
      "https://logos-world.net/wp-content/uploads/2022/12/Mahindra-Logo.png",
    Kia: "https://www.deagenciapanama.com/wp-content/uploads/2021/01/Kia-new-logo-deagenciapa.com-0-5-1024x984.jpg",
    Toyota:
      "https://logos-world.net/wp-content/uploads/2020/04/Toyota-Symbol.png",
  };

  // Normalize brands array (handles both string array and object array)
  const normalizedBrands =
    Array.isArray(brands) && brands.length > 0
      ? brands
          .filter((b) =>
            typeof b === "string" ? b.toLowerCase() !== "all brands" : true
          )
          .map((b, idx) => {
            const name = typeof b === "string" ? b : b.name;
            const logoUrl =
              (typeof b === "object" && (b.logoUrl || b.logo)) ||
              brandLogos[name] ||
              null;
            return { id: `${name}-${idx}`, name, logoUrl };
          })
      : Array.from(new Set(mockCars.map((c) => c.brand || c.make || "Other")))
          .slice(0, 8)
          .map((name, idx) => ({
            id: `${name}-${idx}`,
            name,
            logoUrl: brandLogos[name] || null,
          }));

  const popularBrands = normalizedBrands.map((b) => {
    const sampleCars = mockCars.filter((c) => {
      const brandName = (c.brand || c.make || "").toString().toLowerCase();
      return brandName && brandName.includes(b.name.toLowerCase());
    });
    return { ...b, sampleCars };
  });

  // --- Compare groups (static buckets for quick UX) ---
  const compareGroups = [
    {
      id: "compact-sedans",
      title: "Compact: Hatchback vs Sedan",
      items: [
        { label: "Starting Price", value: "₹5L - ₹9L" },
        { label: "Fuel Avg", value: "18 - 22 kmpl" },
        { label: "Seating", value: "4 - 5" },
        { label: "Best For", value: "City commute" },
      ],
    },
    {
      id: "suv-compare",
      title: "SUVs: City vs Highway",
      items: [
        { label: "Starting Price", value: "₹8L - ₹25L" },
        { label: "Fuel Avg", value: "12 - 18 kmpl" },
        { label: "Seating", value: "5 - 7" },
        { label: "Best For", value: "Family trips" },
      ],
    },
    {
      id: "electric-compare",
      title: "Electric: Short vs Long range",
      items: [
        { label: "Range", value: "200 km - 500+ km" },
        { label: "Charging Time", value: "30 min - 8 hrs" },
        { label: "Running Cost", value: "Low" },
        { label: "Ideal Buyer", value: "City / Long commuters" },
      ],
    },
  ];

  // --- Nearby cars (fallback to first 8 if no geolocation) ---
  const userCity = null; // agar user location mil jaye to yahan set kar do
  const nearbyCars = userCity
    ? mockCars
        .filter((c) =>
          (c.location || "").toLowerCase().includes(userCity.toLowerCase())
        )
        .slice(0, 8)
    : mockCars.slice(0, 8);

  // Build compare pairs: [0,1], [2,3], ...
  const comparePairs = [];
  for (let i = 0; i < nearbyCars.length; i += 2) {
    const a = nearbyCars[i];
    const b = nearbyCars[i + 1] ?? nearbyCars[0]; // if odd, pair last with first
    comparePairs.push([a, b]);
  }

  const scrollRef = React.useRef(null);
  const scroll = (dir = 1) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const amount = Math.round(container.clientWidth * 0.8) * dir;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      
      <section className="py-16 bg-white">
        <BrowseByCategory/>
      </section>

      
      <section className="py-16 bg-gray-50">
        <FeaturedCarsSection/>
      </section>

      
       <section className="py-16 bg-white">
      <LatestCarsSection />
      </section>

     
      <section className="py-16 bg-gray-50">
        <ElectricCarSection/>
      </section>

      {/* Upcoming Cars */}
      <section className="py-16 bg-white">
        <UpcomingCarsSection/>
      </section>

      {/* Trusted used cars by budget */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Trusted used cars by budget
              </h2>
              <p className="text-gray-600">
                Filter trusted pre-owned cars by price range
              </p>
            </div>
            <Link to="/listings?filter=budget">
              <Button variant="outline" className="group">
                View All
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetGroups.map((group) => (
              <div
                key={group.id}
                className="p-6 bg-white rounded-2xl shadow-sm"
              >
                <h3 className="text-xl font-semibold mb-2">{group.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Trusted listings under {group.title}
                </p>
                <div className="space-y-3">
                  {group.cars?.slice(0, 3).map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <img
                        src={c.image || c.images?.[0]}
                        alt={c.name}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div>
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-gray-500">
                          ₹{parsePrice(c.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-sm text-gray-400">No listings</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular brands */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Popular brands
              </h2>
              <p className="text-gray-600">
                Explore listings from top manufacturers
              </p>
            </div>
            <Link to="/brands">
              <Button variant="outline" className="group">
                See All Brands
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-start">
            {popularBrands.map((b) => {
              const placeholderSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='96'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dy='.35em' text-anchor='middle' font-family='Arial,Helvetica,sans-serif' font-size='36' fill='%236b7280'>${
                  (b.name || "B")[0]
                }</text></svg>`
              )}`;
              const src = b.logoUrl || placeholderSvg;

              return (
                <Link
                  key={b.id}
                  to={`/listings?brand=${encodeURIComponent(b.name)}`}
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl hover:shadow"
                >
                  <img
                    src={src}
                    alt={b.name}
                    className="w-20 h-12 object-contain mb-2"
                    onError={(e) => {
                      if (e.currentTarget.src !== placeholderSvg) {
                        e.currentTarget.src = placeholderSvg;
                      }
                    }}
                  />
                  <div className="text-sm font-medium">{b.name}</div>
                  <div className="text-xs text-gray-500">
                    {b.sampleCars?.length || 0} listings
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compare & choose the right car */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Compare & choose the right car
              </h2>
              <p className="text-gray-600">
                Quick comparisons to help you decide
              </p>
            </div>
            <Link to="/compare">
              <Button variant="outline" className="group">
                Start Comparing
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {compareGroups.map((cg) => (
              <div key={cg.id} className="p-6 bg-white rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{cg.title}</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {cg.items?.slice(0, 4).map((it, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{it.label}</span>
                      <span className="font-medium">{it.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Link
                    to={`/compare/${cg.id}`}
                    className="text-sm font-medium text-indigo-600"
                  >
                    See detailed comparison →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get trusted used cars nearby — carousel compare cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Compare to buy the right car
              </h2>
              <p className="text-gray-600">Get trusted used cars nearby</p>
            </div>
            <Link
              to="/comparisons"
              className="text-sm font-medium text-orange-600 flex items-center gap-2"
            >
              View All Car Comparisons
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="hidden md:flex absolute -left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 16.293a1 1 0 010-1.414L15.586 11H4a1 1 0 110-2h11.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Cards container */}
            <div
              ref={scrollRef}
              className="no-scrollbar overflow-x-auto scroll-smooth py-2"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="flex gap-6">
                {comparePairs.map(([a, b], idx) => (
                  <div
                    key={`pair-${idx}`}
                    className="min-w-[320px] md:min-w-[460px] bg-white rounded-2xl shadow-md p-4 flex-shrink-0 relative"
                  >
                    {/* Two images side-by-side */}
                    <div className="flex gap-3 items-stretch">
                      <div className="w-1/2 rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={a.image || a.images?.[0]}
                          alt={a.name}
                          className="w-full h-36 object-cover"
                        />
                        <div className="p-3">
                          <div className="text-xs text-gray-500">{a.brand}</div>
                          <div className="font-semibold">{a.name}</div>
                          <div className="text-sm text-gray-600">
                            ₹{parsePrice(a.price).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="relative w-1/2 rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={b.image || b.images?.[0]}
                          alt={b.name}
                          className="w-full h-36 object-cover"
                        />
                        <div className="p-3">
                          <div className="text-xs text-gray-500">{b.brand}</div>
                          <div className="font-semibold">{b.name}</div>
                          <div className="text-sm text-gray-600">
                            ₹{parsePrice(b.price).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VS circle */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-4 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg">
                        VS
                      </div>
                    </div>

                    {/* CTA button */}
                    <div className="mt-4">
                      <Link
                        to={`/compare?carA=${encodeURIComponent(
                          a.name
                        )}&carB=${encodeURIComponent(b.name)}`}
                        className="block text-center border border-orange-400 text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-50 transition"
                      >
                        {a.name} vs {b.name}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 3.707a1 1 0 010 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Hide scrollbar for modern browsers */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
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
              <p className="text-gray-600">
                Dedicated support team always ready
              </p>
            </div>
          </div>
        </div>
      </section>

     
    </div>

     
  );
};

export default Home;
