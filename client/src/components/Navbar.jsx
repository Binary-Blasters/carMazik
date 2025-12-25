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
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
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

  
  const { token, user } = useSelector((state) => state.auth);
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

  // ✅ FIX: safe dashboard path
  const getDashboardPath = () => {
    if (user?.role === "seller") return "/seller/dashboard";
    if (user?.role === "admin") return "/admin";
    return "/dashboard";
  };

  // ✅ FIX: logout handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {/* ================= TOP NAV ================= */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                CarMazik
              </span>
            </Link>

            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center flex-1 max-w-md mx-8"
            >
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                to={getDashboardPath()}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sell Car
              </Link>

              <Link to="/wishlist">
                <Heart className="h-6 w-6" />
              </Link>

              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <User
                    className="h-7 w-7 cursor-pointer text-gray-700 hover:text-blue-600"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  />

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border z-50">
                      <p className="px-4 py-2 text-sm text-gray-500 border-b">
                        Hi, {user?.name || "User"} 👋
                      </p>
                      <button
                        onClick={() => navigate(getDashboardPath())}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        📊 Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={() => setShowLogin(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* ================= SECONDARY NAV ================= */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6 h-12 items-center">
            <NavItem
              label="NEW CARS"
              items={[
                { label: "Featured Car", path: "/listings?category=featured" },
                { label: "Latest Car", path: "/listings?category=latest" },
                { label: "Electric Car", path: "/listings?fuelType=electric" },
                { label: "Upcoming Car", path: "/listings?category=upcoming" },
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
                { label: "Hatchback", path: "/listings?bodyType=hatchback" },
                { label: "Sedan", path: "/listings?bodyType=sedan" },
                { label: "SUV", path: "/listings?bodyType=suv" },
                { label: "MUV / MPV", path: "/listings?bodyType=muv-mpv" },
                { label: "Luxury Cars", path: "/listings?bodyType=luxury" },
                { label: "Electric Vehicles", path: "/listings?fuelType=electric" },
                { label: "Hybrid Cars", path: "/listings?bodyType=hybrid" },
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
            className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 whitespace-nowrap"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Navbar;
