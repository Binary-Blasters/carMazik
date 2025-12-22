import React, { useEffect, useState } from "react";
import { adminService } from "../../api/admin";
import AdminCarCard from "../../components/admin/AdminCarCard";
import LoadingScreen from "../../components/ui/LoadingScreen";
import CarMazikAlert from "../../components/ui/CarmazikAlert";

export default function PendingCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const loadPendingCars = async () => {
    try {
      setLoading(true);
      const res = await adminService.getPendingCars();
    
      
      setCars(res.data.data.cars);
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to load pending cars",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingCars();
  }, []);

  const handleApprove = async (carId) => {
    try {
      
      
      await adminService.approveCar(carId);
      setCars((prev) => prev.filter((c) => c._id !== carId));
      setAlert({
        type: "success",
        message: "Car approved successfully",
      });
    } catch {
      setAlert({
        type: "error",
        message: "Failed to approve car",
      });
    }
  };

  const handleReject = async (carId) => {
    try {
      await adminService.rejectCar(carId);
      setCars((prev) => prev.filter((c) => c._id !== carId));
      setAlert({
        type: "error",
        message: "Car rejected",
      });
    } catch {
      setAlert({
        type: "error",
        message: "Failed to reject car",
      });
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading pending cars..." />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Cars</h1>

      {alert && (
        <CarMazikAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {cars.length === 0 ? (
        <p className="text-gray-500">No pending cars found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <AdminCarCard
              key={car._id}
              car={car}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
