import { useEffect, useState } from "react";
import { Plus, Rocket } from "lucide-react";
import { adminService } from "../../../api/admin";
import { Button } from "../../../components/ui/Button";
import AdminUpcomingCarForm from "./AdminUpcomingCarForm";

const AdminUpcomingCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editCar, setEditCar] = useState(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUpcomingCars();
      setCars(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSave = async (formData) => {
    if (editCar) {
      await adminService.updateUpcomingCar(editCar._id, formData);
    } else {
      await adminService.addUpcomingCar(formData);
    }
    setOpenForm(false);
    setEditCar(null);
    fetchCars();
  };

  const handleLaunch = async (id) => {
    await adminService.launchUpcomingCar(id);
    fetchCars();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Upcoming Cars</h1>

        <Button
          onClick={() => setOpenForm(true)}
          className="bg-gradient-to-r from-blue-600 to-orange-500 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Upcoming Car
        </Button>
      </div>

      {!loading && cars.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          <Rocket className="h-10 w-10 mx-auto mb-3 text-orange-500" />
          No upcoming cars added yet
        </div>
      )}

      <div className="grid gap-4">
        {cars.map((car) => (
          <div
            key={car._id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-gray-500">
                Launch: {new Date(car.expectedLaunchDate).toDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditCar(car);
                  setOpenForm(true);
                }}
              >
                Edit
              </Button>

              <Button
                className="bg-green-500 text-white"
                onClick={() => handleLaunch(car._id)}
              >
                Launch
              </Button>
            </div>
          </div>
        ))}
      </div>

      {openForm && (
        <AdminUpcomingCarForm
          car={editCar}
          onClose={() => {
            setOpenForm(false);
            setEditCar(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminUpcomingCars;
