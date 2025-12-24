import { useEffect, useState } from "react";
import { getCars } from "../api/listing";

const LIMIT = 9;

export const useCars = ({ searchParams, filters, sortBy, page }) => {
  const [cars, setCars] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);

        const fuelTypeFromUrl = searchParams.get("fuelType");
        const bodyTypeFromUrl = searchParams.get("bodyType");
        const categoryFromUrl = searchParams.get("category");
        const searchFromUrl = searchParams.get("search");

        const params = {
          search: searchFromUrl || undefined,

          bodyType: bodyTypeFromUrl || undefined,
          category: categoryFromUrl || undefined,

          // ✅ IMPORTANT FIX
          fuelType: fuelTypeFromUrl || filters.fuelType || undefined,

          brand: filters.brand || undefined,
          transmission: filters.transmission || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,

          sortBy: sortBy || undefined,
          page,
          limit: LIMIT,
        };

        

        const res = await getCars(params);

        setCars(res.cars || []);
        setTotal(res.total || 0);
      } catch (err) {
        console.error("❌ Failed to fetch cars", err);
        setCars([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [searchParams, filters, sortBy, page]);

  return { cars, total, loading };
};
