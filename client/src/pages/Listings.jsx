import React, { useState } from "react";
import { useSearchParams } from "react-router";
import { useCars } from "../hooks/useCars";
import CarCard from "../components/CarCard";
import { Button } from "../components/ui/button";

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        {searchParams.get("search")
          ? `Search Results for "${searchParams.get("search")}"`
          : "All Cars"}
      </h1>

      {loading && <p className="text-center">Loading...</p>}

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

      {/* Pagination sirf getCars ke liye */}
      {!searchParams.get("search") && totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span>
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
