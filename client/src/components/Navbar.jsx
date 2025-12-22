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
  LogOut,
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
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userMenuRef = useRef(null);

  const newRef = useRef(null);
  const usedRef = useRef(null);
  const categoriesRef = useRef(null);
  const newsRef = useRef(null);
  const servicesRef = useRef(null);

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
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Dashboard
                    </button>
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
              items={["Featured Car", "Latest Car", "Electric Car", "Upcoming Car"]}
            />

            <NavItem
              label="USED CARS"
              items={["Buy Used Cars", "Sell Your Car", "Used car in your city"]}
            />

            <NavItem
              label="CATEGORIES"
              items={[
                "Hatchback",
                "Sedan",
                "SUV",
                "MUV / MPV",
                "Luxury Cars",
                "Electric Vehicles",
                "Hybrid Cars",
              ]}
            />

            <NavItem
              label="SERVICES"
              items={["Spare parts", "Car washing", "Buy / Sell Assistance"]}
            />

            <NavItem
              label="NEWS & REVIEWS"
              items={["Car news", "User reviews", "Expert Reviews"]}
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

      {/* 👇 WIDTH FIX HERE */}
      <div className="absolute left-0 top-full hidden group-hover:block bg-white rounded-md shadow-md border z-50 min-w-[180px] py-1">
        {items.map((item) => (
          <button
            key={item}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 whitespace-nowrap"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
