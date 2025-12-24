import { useEffect, useState } from "react";
import { Star, Eye } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { adminService } from "../../api/admin";
import AdminCarDetailsDrawer from "../../components/admin/AdminCarDetailsDrawer";
import { useToast } from "../../hooks/use-toast";
import LoadingScreen from "../../components/ui/LoadingScreen";

const AdminAllCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);

  const [featureLoadingId, setFeatureLoadingId] = useState(null);

  const { toast } = useToast();

  const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

  const toggleFeatured = async (car) => {
    try {
      setFeatureLoadingId(car._id);

      await adminService.toggleFeaturedCar(car._id);

      setCars((prev) =>
        prev.map((c) =>
          c._id === car._id ? { ...c, featured: !c.featured } : c
        )
      );

      toast({
        title: car.featured ? "Removed from Featured" : "Marked as Featured ⭐",
        description: `${car.brand} ${car.model}`,
        variant: "featured",
      });
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Could not update featured status",
        variant: "destructive",
      });
    } finally {
      setFeatureLoadingId(null);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminCars();
      setCars(res.data.data.cars || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">All Cars (Approved)</h1>

      <div className="grid gap-4">
        {cars.map((car) => {
          const isLoading = featureLoadingId === car._id;

          return (
            <div
              key={car._id}
              className="
                bg-white rounded-xl shadow p-4
                flex flex-col sm:flex-row
                sm:items-center gap-4
                hover:shadow-md transition
              "
            >
              {/* IMAGE */}
              <img
                src={
                  car.images?.[0]
                    ? `${BASE_IMAGE_URL}${car.images[0]}`
                    : "/car-placeholder.png"
                }
                alt="car"
                className="h-24 w-full sm:h-20 sm:w-28 object-cover rounded-lg"
              />

              {/* INFO */}
              <div className="flex-1">
                <h3 className="font-semibold">
                  {car.brand} {car.model}
                </h3>
                <p className="text-sm text-gray-500">
                  Seller: {car.seller?.name || "-"}
                </p>
                <p className="font-bold text-blue-600">
                  ₹{car.price?.toLocaleString()}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCar(car)}
                  className="w-full sm:w-auto"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>

                {/* FEATURE BUTTON */}
                <button
                  disabled={isLoading}
                  onClick={() => toggleFeatured(car)}
                  className={`
                    relative overflow-hidden
                    px-4 py-2 rounded-md text-sm font-medium
                    transition-all duration-300
                    ${
                      car.featured
                        ? "bg-yellow-400 text-black"
                        : "border border-gray-300 bg-white"
                    }
                    ${isLoading ? "pointer-events-none" : ""}
                  `}
                >
                  {isLoading && (
                    <span
                      className="
                        absolute inset-0
                        bg-gradient-to-r
                        from-yellow-400 via-white to-yellow-400
                        animate-shimmer
                      "
                    />
                  )}

                  <span className="relative flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {car.featured ? "Featured" : "Feature"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCar && (
        <AdminCarDetailsDrawer
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
};

export default AdminAllCars;
