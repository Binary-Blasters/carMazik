import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, Heart, Car, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Login from "../pages/Login";

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

  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const toggle = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  // close dropdown on esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
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
                  aria-label="search"
                >
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/listings"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Buy Car
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
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

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
              aria-label="menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* mobile search */}
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
                aria-label="search"
              >
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>
        </div>

        {/* mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link
                to="/listings"
                className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Buy Car
              </Link>
              <Link
                to="/"
                className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sell Car
              </Link>
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
            </div>
          </div>
        )}
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
              <Link to="/loan" className="text-sm text-gray-600 hover:text-orange-500">
                Loan
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
