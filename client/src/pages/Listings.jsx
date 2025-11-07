import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid, List, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import CarCard from "../components/CarCard";
import {
  mockCars,
  brands,
  fuelTypes,
  transmissions,
  budgetRanges,
} from "../mockData";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [filteredCars, setFilteredCars] = useState(mockCars);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const budgetParam = searchParams.get("budget");

    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
    if (budgetParam) {
      setSelectedBudget(budgetParam);
    }
    // note: we intentionally do NOT override user's other selected filters here
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...mockCars];

    // ----- CATEGORY handling (new) -----
    const categoryParam = (searchParams.get("category") || "").toLowerCase();

    if (categoryParam) {
      if (categoryParam === "latest") {
        // Sort by createdAt/addedAt if available else fallback to year, newest first
        filtered = filtered.slice().sort((a, b) => {
          const aDate = new Date(a.createdAt || a.addedAt || 0).getTime() || 0;
          const bDate = new Date(b.createdAt || b.addedAt || 0).getTime() || 0;
          if (aDate && bDate) return bDate - aDate;
          // fallback to year if date not present
          if (a.year && b.year) return b.year - a.year;
          return 0;
        });
        // keep list (we'll still apply other filters below)
      } else if (categoryParam === "electric") {
        filtered = filtered.filter((c) => {
          const fuel = (c.fuelType || c.fuel || "").toString().toLowerCase();
          console.log(filteredCars
          )
          return (
            fuel.includes("electric") ||
            c.isElectric === true ||
            (c.tags && c.tags.includes && c.tags.includes("electric"))
          );
        });
      } else if (categoryParam === "upcoming") {
        filtered = filtered.filter((c) => {
          // Accept explicit flag or tag
          if (c.upcoming === true) return true;
          if (c.tags && c.tags.includes && c.tags.includes("upcoming")) return true;
          // Optionally, if you have a releaseDate field in future, filter by that:
          if (c.releaseDate) {
            const release = new Date(c.releaseDate);
            if (!isNaN(release.getTime()) && release.getTime() > Date.now()) return true;
          }
          return false;
        });
      } else {
        // Generic category (suv, sedan, hatchback, luxury, etc.)
        const cat = categoryParam;
        filtered = filtered.filter(
          (c) =>
            (c.category && c.category.toLowerCase() === cat) ||
            (c.bodyType && c.bodyType.toLowerCase() === cat) ||
            (c.tags && c.tags.includes && c.tags.includes(cat))
        );
      }
    }

    // ----- Brand filter -----
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((car) => {
        // brand fields might be 'brand', 'make', or 'manufacturer'
        const brandVal = (car.brand || car.make || car.manufacturer || "").toString();
        return selectedBrands.includes(brandVal);
      });
    }

    // ----- Fuel Type filter -----
    if (selectedFuelTypes.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFuelTypes.includes(car.fuelType || car.fuel)
      );
    }

    // ----- Transmission filter -----
    if (selectedTransmissions.length > 0) {
      filtered = filtered.filter((car) =>
        selectedTransmissions.includes(car.transmission)
      );
    }

    // ----- Budget filter -----
    if (selectedBudget !== "All") {
      const budgetRange = budgetRanges.find(
        (range) => range.label === selectedBudget
      );
      if (budgetRange) {
        filtered = filtered.filter((car) => {
          // assume car.price is numeric; if string like '₹1,00,000' adapt accordingly
          const priceNum = typeof car.price === "number"
            ? car.price
            : Number(String(car.price || "").replace(/[^\d]/g, "")) || 0;
          return priceNum >= budgetRange.min && priceNum <= budgetRange.max;
        });
      } else if (selectedBudget.includes("-")) {
        // support numeric-range like "500000-1000000"
        const [minStr, maxStr] = selectedBudget.split("-");
        const min = Number(minStr) || 0;
        const max = Number(maxStr) || Infinity;
        filtered = filtered.filter((car) => {
          const priceNum = typeof car.price === "number"
            ? car.price
            : Number(String(car.price || "").replace(/[^\d]/g, "")) || 0;
          return priceNum >= min && priceNum <= max;
        });
      }
    }

    // ----- Certified only filter -----
    if (certifiedOnly) {
      filtered = filtered.filter((car) => car.certified);
    }

    // ----- Search textbox param -----
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      filtered = filtered.filter(
        (car) =>
          (car.name || car.title || car.model || "")
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (car.brand || "")
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (car.location || "")
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // ----- Sorting -----
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const pa = typeof a.price === "number" ? a.price : Number(String(a.price || "").replace(/[^\d]/g, "")) || 0;
          const pb = typeof b.price === "number" ? b.price : Number(String(b.price || "").replace(/[^\d]/g, "")) || 0;
          return pa - pb;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const pa = typeof a.price === "number" ? a.price : Number(String(a.price || "").replace(/[^\d]/g, "")) || 0;
          const pb = typeof b.price === "number" ? b.price : Number(String(b.price || "").replace(/[^\d]/g, "")) || 0;
          return pb - pa;
        });
        break;
      case "year-new":
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case "mileage-low":
        filtered.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
        break;
      default:
        // relevance or default ordering already handled (e.g., for 'latest' we pre-sorted)
        break;
    }

    setFilteredCars(filtered);
  }, [
    selectedBrands,
    selectedFuelTypes,
    selectedTransmissions,
    selectedBudget,
    certifiedOnly,
    sortBy,
    searchParams,
  ]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleFuelType = (fuel) => {
    setSelectedFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleTransmission = (trans) => {
    setSelectedTransmissions((prev) =>
      prev.includes(trans) ? prev.filter((t) => t !== trans) : [...prev, trans]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSelectedBudget("All");
    setCertifiedOnly(false);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Budget</h3>
        <Select value={selectedBudget} onValueChange={setSelectedBudget}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {budgetRanges.map((range) => (
              <SelectItem key={range.label} value={range.label}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands
            .filter((b) => b !== "All Brands")
            .map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => toggleBrand(brand)}
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Fuel Type</h3>
        <div className="space-y-2">
          {fuelTypes
            .filter((f) => f !== "All")
            .map((fuel) => (
              <div key={fuel} className="flex items-center space-x-2">
                <Checkbox
                  id={`fuel-${fuel}`}
                  checked={selectedFuelTypes.includes(fuel)}
                  onCheckedChange={() => toggleFuelType(fuel)}
                />
                <Label
                  htmlFor={`fuel-${fuel}`}
                  className="text-sm cursor-pointer"
                >
                  {fuel}
                </Label>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Transmission</h3>
        <div className="space-y-2">
          {transmissions
            .filter((t) => t !== "All")
            .map((trans) => (
              <div key={trans} className="flex items-center space-x-2">
                <Checkbox
                  id={`trans-${trans}`}
                  checked={selectedTransmissions.includes(trans)}
                  onCheckedChange={() => toggleTransmission(trans)}
                />
                <Label
                  htmlFor={`trans-${trans}`}
                  className="text-sm cursor-pointer"
                >
                  {trans}
                </Label>
              </div>
            ))}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="certified"
            checked={certifiedOnly}
            onCheckedChange={setCertifiedOnly}
          />
          <Label
            htmlFor="certified"
            className="text-sm cursor-pointer font-semibold"
          >
            Certified Cars Only
          </Label>
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        <X className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Car
          </h1>
          <p className="text-gray-600">{filteredCars.length} cars available</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                </div>
                <FiltersContent />
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="year-new">Year: Newest First</SelectItem>
                  <SelectItem value="mileage-low">
                    Mileage: Low to High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredCars.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 text-lg">
                    No cars found matching your criteria
                  </p>
                  <Button onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
