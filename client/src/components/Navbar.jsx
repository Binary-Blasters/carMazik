import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  User,
  Heart,
  Car,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Login from "../pages/Login";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/slice/auth.slice";
import { fetchWishlist, clearWishlist } from "../app/slice/wishlistSlice";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userMenuRef = useRef(null);

  const { token } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    token ? dispatch(fetchWishlist()) : dispatch(clearWishlist());
  }, [token, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* ================= TOP NAV ================= */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
              <Car className="text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              CarMazik
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cars..."
                className="pr-10"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="text-gray-400" />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/wishlist">
              <Heart />
            </Link>

            {isLoggedIn ? (
              <div ref={userMenuRef} className="relative">
                <User
                  className="cursor-pointer"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                />
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white rounded shadow border">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => dispatch(logout())}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={() => setShowLogin(true)}>Login</Button>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* ================= SECONDARY NAV ================= */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6 h-12 items-center">

            <NavItem
              label="NEW CARS"
              items={[
                { label: "Featured Car", path: "/new/featured" },
                { label: "Latest Car", path: "/new/latest" },
                { label: "Electric Car", path: "/new/electric" },
                { label: "Upcoming Car", path: "/new/upcoming" },
              ]}
            />

            <NavItem
              label="USED CARS"
              items={[
                { label: "Buy Used Cars", path: "/used/buy" },
                { label: "Sell Your Car", path: "/used/sell" },
                { label: "Used car in your city", path: "/used/city" },
              ]}
            />

            <NavItem
              label="CATEGORIES"
              items={[
                { label: "Hatchback", path: "/category/hatchback" },
                { label: "Sedan", path: "/category/sedan" },
                { label: "SUV", path: "/category/suv" },
                { label: "MUV / MPV", path: "/category/muv-mpv" },
                { label: "Luxury Cars", path: "/category/luxury" },
                { label: "Electric Vehicles", path: "/category/electric" },
                { label: "Hybrid Cars", path: "/category/hybrid" },
              ]}
            />

            <NavItem
              label="SERVICES"
              items={[
                { label: "Spare parts", path: "/services/spare-parts" },
                { label: "Car washing", path: "/services/car-wash" },
                { label: "Buy / Sell Assistance", path: "/services/assistance" },
              ]}
            />

            <NavItem
              label="NEWS & REVIEWS"
              items={[
                { label: "Car news", path: "/news" },
                { label: "User reviews", path: "/reviews/users" },
                { label: "Expert Reviews", path: "/reviews/experts" },
              ]}
            />

          </nav>
        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

function NavItem({ label, items }) {
  return (
    <div className="relative group">
      <button className="py-3 text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1">
        {label} <ChevronDown className="w-4 h-4" />
      </button>

      <div className="absolute left-0 top-full hidden group-hover:block bg-white rounded-md shadow-md border z-50 min-w-[180px] py-1">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
