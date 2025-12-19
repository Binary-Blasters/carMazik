import { useEffect, useState } from "react";
import { getCars, searchCars } from "../api/listing";

const LIMIT = 9;

export const useCars = ({ searchParams, filters, sortBy, page }) => {
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);

        const searchQuery = searchParams.get("search");

        // 🔁 CASE 1: SEARCH
        if (searchQuery) {
          const cars = await searchCars(searchQuery);
          setCars(cars);
          setTotal(cars.length);
          return;
        }

        // 🔁 CASE 2: NORMAL LISTING
        const params = {
          brand: filters.brand || undefined,
          fuelType: filters.fuelType || undefined,
          transmission: filters.transmission || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          sortBy: sortBy || undefined,
          page,
          limit: LIMIT,
        };

        const res = await getCars(params);

        setCars(res.cars);
        setTotal(res.total);
      } catch (err) {
        console.error("❌ Failed to fetch cars", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchParams, filters, sortBy, page]);

  return { cars, total, loading };
};
