import React, { useEffect, useState } from "react";
import { getApprovedCarsApi } from "../../api/seller";
import LoadingScreen from "../ui/LoadingScreen";
import ApprovedCarCard from "../dashboard/AprrovedCarCard";

export default function ApprovedCars() {
  const [approvedCars, setApprovedCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApprovedCars = async () => {
      setLoading(true);
      try {
        const data = await getApprovedCarsApi();
        setApprovedCars(data?.data || []);
      } catch (err) {
        console.error("Error fetching approved cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedCars();
  }, []);

  if (loading) {
    return <LoadingScreen message="Fetching approved cars..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Approved Cars
        </h1>

        {approvedCars.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No approved cars available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedCars.map((car) => (
              <ApprovedCarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
