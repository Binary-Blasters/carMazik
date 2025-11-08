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

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'new' | 'used' | 'news' | 'categories' | null
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  const handleLogout = () => {
    dispatch(logout());
    setOpenDropdown(null);
    navigate("/");
  };


  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenDropdown(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // compute and set fixed position for dropdown, clamp to viewport
  const openAt = (key, ref) => {
    if (!ref?.current) {
      setOpenDropdown(key);
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const DROPDOWN_MAX_W = 220; // px - adjust if needed
    const GAP = 6;
    // clamp left so dropdown doesn't overflow viewport
    const leftClamped = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - 12 - DROPDOWN_MAX_W)
    );
    setDropdownPos({ left: leftClamped, top: rect.bottom + GAP });
    setOpenDropdown(key);

    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };

  const scheduleClose = (delay = 120) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
      closeTimeout.current = null;
    }, delay);
  };

  const cancelScheduledClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  };


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false); 
      } else {
        setOpenDropdown(null); 
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const toggle = (key) => setOpenDropdown((prev) => (prev === key ? null : key));

  return (
    <div ref={containerRef}>
     
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* TOP ROW */}
          <div className="flex justify-between items-center h-16">
            {/* LOGO */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                CarMazik
              </span>
            </Link>

            {/* SEARCH BAR */}
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

            {/* DESKTOP LINKS */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/listings"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Buy Car
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sell Car
              </Link>
              <button className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer" aria-label="favorites">
                <Heart className="h-6 w-6" />
              </button>
              <Button
                variant="outline"
                className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setShowLogin(true)}
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </div>

            {/* MOBILE MENU ICON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* MOBILE SEARCH */}
          <form onSubmit={handleSearch} className="md:hidden pb-4">
            <div className="relative">
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
        </div>

        {/* ✅ MOBILE MENU (with animation) */}
        <div
          className={`md:hidden bg-white border-t transition-all duration-300 overflow-hidden ${
            mobileMenuOpen
              ? "max-h-[400px] opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/listings"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 py-2"
            >
              Buy Car
            </Link>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-blue-600 py-2"
            >
              Sell Car
            </Link>

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => navigate(getDashboardPath()), 150);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => handleLogout(), 150);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowLogin(true);
                  setMobileMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* ---------------------------
          SECONDARY NAVBAR (custom dropdowns)
          Key fixes: overflow-visible, relative, z-50 for popovers
         --------------------------- */}
      <div
        ref={containerRef}
        className="hidden md:block bg-white border-b shadow-sm overflow-visible relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-12">
            <nav className="flex items-center gap-6">

              {/* NEW CARS */}
              <div className="relative">
                <button
                  onClick={() => toggle("new")}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "new"}
                  className="py-3 text-sm font-medium text-gray-700 hover:text-orange-500 flex items-center gap-1 bg-transparent border-0 outline-none"
                >
                  NEW CARS <ChevronDown className="w-4 h-4" />
                </button>

                {openDropdown === "new" && (
                  <div className="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-md border z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setOpenDropdown(null);
                        navigate("/");
                      }}
                    >
                      Find New Cars
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Latest Cars
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Upcoming Cars
                    </button>
                  </div>
                )}
              </div>

              {/* USED CARS */}
              <div className="relative">
                <button
                  onClick={() => toggle("used")}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "used"}
                  className="py-3 text-sm font-medium text-gray-700 hover:text-orange-500 flex items-center gap-1 bg-transparent border-0 outline-none"
                >
                  USED CARS <ChevronDown className="w-4 h-4" />
                </button>

                {openDropdown === "used" && (
                  <div className="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-md border z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => {
                        setOpenDropdown(null);
                        navigate("/used-cars");
                      }}
                    >
                      Buy Used Cars
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Sell Car
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Certified Cars
                    </button>
                  </div>
                )}
              </div>

              {/* NEWS & REVIEWS */}
              <div className="relative">
                <button
                  onClick={() => toggle("news")}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "news"}
                  className="py-3 text-sm font-medium text-gray-700 hover:text-orange-500 flex items-center gap-1 bg-transparent border-0 outline-none"
                >
                  NEWS & REVIEWS <ChevronDown className="w-4 h-4" />
                </button>

                {openDropdown === "news" && (
                  <div className="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-md border z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Car News
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Expert Reviews
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      User Reviews
                    </button>
                  </div>
                )}
              </div>

              {/* CATEGORIES */}
              <div className="relative">
                <button
                  onClick={() => toggle("categories")}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "categories"}
                  className="py-3 text-sm font-medium text-gray-700 hover:text-orange-500 flex items-center gap-1 bg-transparent border-0 outline-none"
                >
                  CATEGORIES <ChevronDown className="w-4 h-4" />
                </button>

                {openDropdown === "categories" && (
                  <div className="absolute left-0 mt-2 w-44 bg-white rounded-md shadow-md border z-50">
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      New Cars
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Used Cars
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Electric Cars
                    </button>
                  </div>
                )}
              </div>
            </nav>

            <div className="ml-auto flex items-center gap-4">
              <Link to="/compare" className="text-sm text-gray-600 hover:text-orange-500">
                Compare
              </Link>
              <Link
                to="/loan"
                className="text-sm text-gray-600 hover:text-orange-500"
              >
                Loan
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default Navbar;
