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
  const [openDropdown, setOpenDropdown] = useState(null); // 'new' | 'used' | 'news' | 'categories' | null
  const [dropdownPos, setDropdownPos] = useState({ left: 0, top: 0 });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const userMenuRef = useRef(null);

  const { token, user } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);



  const dispatch = useDispatch()

  useEffect(() => {
    if (token) {
      dispatch(fetchWishlist());
    } else {
      // logout / token remove hone par wishlist clear
      dispatch(clearWishlist());
    }
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

  const role = user?.role || "user";

  const newRef = useRef(null);
  const usedRef = useRef(null);
  const newsRef = useRef(null);
  const categoriesRef = useRef(null);

  const closeTimeout = useRef(null);

  const getDashboardPath = () => {
    console.log(role);
    
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "seller":
        return "/seller/dashboard";
      default:
        return "/dashboard";
    }
  };

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
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sell Car
              </Link>
              <Link
                to="/wishlist"
                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                aria-label="favorites"
              >
                <Heart className="h-6 w-6" />
              </Link>
              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <User className="h-7 w-7 text-gray-700 hover:text-blue-600 transition-transform hover:scale-110" />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg border z-50 overflow-hidden animate-fadeIn"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <p className="px-4 py-2 text-sm text-gray-500 border-b">
                        Hi, {user?.name || "User"} 👋
                      </p>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate(getDashboardPath());
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📊 Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          dispatch(logout());
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center space-x-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setShowLogin(true)}
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
              aria-label="menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
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
        )}
      </nav>

      {/* ---------------------------
          SECONDARY NAVBAR (custom dropdowns)
          Hover opens, auto-sized fixed popovers, compact items
         --------------------------- */}
      <div
        ref={containerRef}
        className="hidden md:block bg-white border-b shadow-sm overflow-visible relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-12">
            <nav className="flex items-center gap-6">
              {/* NEW CARS */}
              <div
                className="relative"
                onMouseLeave={() => scheduleClose()}
                onMouseEnter={() => cancelScheduledClose()}
              >
                <button
                  ref={newRef}
                  onMouseEnter={() => openAt("new", newRef)}
                  onClick={() => toggle("new")}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "new"}
                  className="py-3 text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 bg-transparent border-0 outline-none cursor-pointer"
                >
                  NEW CARS <ChevronDown className="w-4 h-4" />
                </button>

                {openDropdown === "new" && (
                  <div
                    style={{
                      left: dropdownPos.left,
                      top: dropdownPos.top,
                      maxWidth: 150,
                    }}
                    className="fixed bg-white rounded-md shadow-md border z-50 px-0 py-1 overflow-hidden w-auto"
                    onMouseEnter={() => cancelScheduledClose()}
                    onMouseLeave={() => scheduleClose()}
                  >
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => {
                        setOpenDropdown(null);
                        navigate("/");
                      }}
                    >
                      Find New Cars
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Latest Cars
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Upcoming Cars
                    </button>
                  </div>
                )}
              </div>

              {/* USED CARS */}
              <div
                className="relative"
                onMouseLeave={() => scheduleClose()}
                onMouseEnter={() => cancelScheduledClose()}
              >
                <button
                  ref={usedRef}
                  onMouseEnter={() => openAt("used", usedRef)}
                  onClick={() => toggle("used")}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "used"}
                  className="py-3 text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 bg-transparent border-0 outline-none cursor-pointer"
                >
                  USED CARS <ChevronDown className="w-4 h-4" />
                </button>

                {openDropdown === "used" && (
                  <div
                    style={{
                      left: dropdownPos.left,
                      top: dropdownPos.top,
                      maxWidth: 150,
                    }}
                    className="fixed bg-white rounded-md shadow-md border z-50 px-0 py-1 overflow-hidden w-auto"
                    onMouseEnter={() => cancelScheduledClose()}
                    onMouseLeave={() => scheduleClose()}
                  >
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => {
                        setOpenDropdown(null);
                        navigate("/used-cars");
                      }}
                    >
                      Buy Used Cars
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Sell Car
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Certified Cars
                    </button>
                  </div>
                )}
              </div>

              {/* NEWS & REVIEWS */}
              <div
                className="relative"
                onMouseLeave={() => scheduleClose()}
                onMouseEnter={() => cancelScheduledClose()}
              >
                <button
                  ref={newsRef}
                  onMouseEnter={() => openAt("news", newsRef)}
                  onClick={() => toggle("news")}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "news"}
                  className="py-3 text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 bg-transparent border-0 outline-none cursor-pointer"
                >
                  NEWS & REVIEWS <ChevronDown className="w-4 h-4" />
                </button>

                {openDropdown === "news" && (
                  <div
                    style={{
                      left: dropdownPos.left,
                      top: dropdownPos.top,
                      maxWidth: 150,
                    }}
                    className="fixed bg-white rounded-md shadow-md border z-50 px-0 py-1 overflow-hidden w-auto"
                    onMouseEnter={() => cancelScheduledClose()}
                    onMouseLeave={() => scheduleClose()}
                  >
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Car News
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Expert Reviews
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      User Reviews
                    </button>
                  </div>
                )}
              </div>

              {/* CATEGORIES */}
              <div
                className="relative"
                onMouseLeave={() => scheduleClose()}
                onMouseEnter={() => cancelScheduledClose()}
              >
                <button
                  ref={categoriesRef}
                  onMouseEnter={() => openAt("categories", categoriesRef)}
                  onClick={() => toggle("categories")}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown === "categories"}
                  className="py-3 text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-1 bg-transparent border-0 outline-none cursor-pointer"
                >
                  CATEGORIES <ChevronDown className="w-4 h-4" />
                </button>

                {openDropdown === "categories" && (
                  <div
                    style={{
                      left: dropdownPos.left,
                      top: dropdownPos.top,
                      maxWidth: 150,
                    }}
                    className="fixed bg-white rounded-md shadow-md border z-50 px-0 py-1 overflow-hidden w-auto"
                    onMouseEnter={() => cancelScheduledClose()}
                    onMouseLeave={() => scheduleClose()}
                  >
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      New Cars
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Used Cars
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 hover:text-blue-600 cursor-pointer"
                      onClick={() => setOpenDropdown(null)}
                    >
                      Electric Cars
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/*  <div className="ml-auto flex items-center gap-4">
              <Link to="/compare" className="text-sm text-gray-600 hover:text-orange-500">
                Compare
              </Link>
              <Link to="/loan" className="text-sm text-gray-600 hover:text-orange-500">
                Loan
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
