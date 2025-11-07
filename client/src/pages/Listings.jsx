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
    const searchParam = searchParams.get("search");

    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
    if (budgetParam) {
      setSelectedBudget(budgetParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...mockCars];

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((car) => selectedBrands.includes(car.brand));
    }

    if (selectedFuelTypes.length > 0) {
      filtered = filtered.filter((car) =>
        selectedFuelTypes.includes(car.fuelType)
      );
    }

    if (selectedTransmissions.length > 0) {
      filtered = filtered.filter((car) =>
        selectedTransmissions.includes(car.transmission)
      );
    }

    if (selectedBudget !== "All") {
      const budgetRange = budgetRanges.find(
        (range) => range.label === selectedBudget
      );
      if (budgetRange) {
        filtered = filtered.filter(
          (car) => car.price >= budgetRange.min && car.price <= budgetRange.max
        );
      }
    }

    if (certifiedOnly) {
      filtered = filtered.filter((car) => car.certified);
    }

    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          car.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "year-new":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "mileage-low":
        filtered.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
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
