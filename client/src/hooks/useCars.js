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

        // ✅ URL params
        const fuelTypeFromUrl = searchParams.get("fuelType");
        const bodyTypeFromUrl = searchParams.get("bodyType");
        const categoryFromUrl = searchParams.get("category");
        const searchFromUrl = searchParams.get("search");
        const minPriceFromUrl = searchParams.get("minPrice");
        const maxPriceFromUrl = searchParams.get("maxPrice");
        const brandFromUrl = searchParams.get("brand");

       
        const params = {
          search: searchFromUrl || undefined,
          category: categoryFromUrl || undefined,
          bodyType: bodyTypeFromUrl || undefined,

          fuelType: fuelTypeFromUrl || filters.fuelType || undefined,
          brand: brandFromUrl || filters.brand || undefined,
          transmission: filters.transmission || undefined,

        
          minPrice: minPriceFromUrl || filters.minPrice || undefined,
          maxPrice: maxPriceFromUrl || filters.maxPrice || undefined,

          sortBy: sortBy || undefined,
          page,
          limit: LIMIT,
        };

      

        const res = await getCars(params);

       
        if (Array.isArray(res)) {
          setCars(res);
          setTotal(res.length);
        } else {
          setCars(res.cars || []);
          setTotal(res.total || 0);
        }
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
