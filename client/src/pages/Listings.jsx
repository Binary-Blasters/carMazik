import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCars } from "../hooks/useCars";
import CarCard from "../components/CarCard";
import { Button } from "../components/ui/Button";
import LoadingScreen from "../components/ui/LoadingScreen";

const Listings = () => {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    brand: "",
    fuelType: "",
    transmission: "",
    minPrice: "",
    maxPrice: "",
  });

  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  const { cars, total, loading } = useCars({
    searchParams,
    filters,
    sortBy,
    page,
  });

  const totalPages = Math.ceil(total / 9);
  const isSearchMode = Boolean(searchParams.get("search"));

  return (
    <div className="max-w-7xl mx-auto p-6">
      
      <h1 className="text-3xl font-bold mb-4">
        {isSearchMode
          ? `Search Results for "${searchParams.get("search")}"`
          : "All Cars"}
      </h1>

      
      {loading && <LoadingScreen />}

      
      {!loading && cars.length === 0 && (
        <p className="text-center text-gray-500">
          No cars found
        </p>
      )}

      
      {!loading && cars.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      )}

      
      {!isSearchMode && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default Listings;
