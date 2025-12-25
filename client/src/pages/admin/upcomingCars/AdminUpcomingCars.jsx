import { useEffect, useState } from "react";
import { Plus, Rocket } from "lucide-react";
import { adminService } from "../../../api/admin";
import { Button } from "../../../components/ui/Button";
import AdminUpcomingCarForm from "./AdminUpcomingCarForm";
import { toast } from "../../../hooks/use-toast";

const AdminUpcomingCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUpcomingCars();
      setCars(res.data.data || []);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load upcoming cars",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  /* ---------------- SAVE ---------------- */

  const handleSave = async (formData) => {
    if (actionLoading) return;
    setActionLoading(true);

    const t = toast({
      title: editCar ? "Updating car..." : "Adding upcoming car...",
      description: "Please wait",
    });

    try {
      if (editCar) {
        await adminService.updateUpcomingCar(editCar._id, formData);
        t.update({
          title: "Updated",
          description: "Upcoming car updated successfully",
        });
      } else {
        await adminService.addUpcomingCar(formData);
        t.update({
          title: "Added",
          description: "Upcoming car added successfully",
        });
      }

      setOpenForm(false);
      setEditCar(null);
      fetchCars();
    } catch (err) {
      t.update({
        title: "Error",
        description: "Failed to save upcoming car",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------- LAUNCH ---------------- */

  const handleLaunch = async (id) => {
    if (actionLoading) return;

    if (!window.confirm("Are you sure you want to launch this car?")) return;

    setActionLoading(true);

    const t = toast({
      title: "Launching car...",
      description: "Please wait",
    });

    try {
      await adminService.launchUpcomingCar(id);
      t.update({
        title: "Launched 🚀",
        description: "Car launched successfully",
      });
      fetchCars();
    } catch (err) {
      t.update({
        title: "Error",
        description: "Failed to launch car",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Upcoming Cars</h1>

        <Button
          onClick={() => setOpenForm(true)}
          className="
            bg-gradient-to-r from-blue-600 to-orange-500 text-white
            cursor-pointer hover:from-blue-700 hover:to-orange-600
            active:scale-95 transition
          "
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Upcoming Car
        </Button>
      </div>

      {/* EMPTY STATE */}
      {!loading && cars.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          <Rocket className="h-10 w-10 mx-auto mb-3 text-orange-500" />
          No upcoming cars added yet
        </div>
      )}

      {/* LIST */}
      <div className="grid gap-4">
        {cars.map((car) => (
          <div
            key={car._id}
            className="
              bg-white p-4 rounded-xl shadow
              flex justify-between items-center
              hover:shadow-lg transition
            "
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
                disabled={actionLoading}
                onClick={() => {
                  setEditCar(car);
                  setOpenForm(true);
                }}
                className="cursor-pointer hover:bg-blue-50"
              >
                Edit
              </Button>

              <Button
                disabled={actionLoading}
                onClick={() => handleLaunch(car._id)}
                className="
                  bg-green-500 text-white
                  cursor-pointer hover:bg-green-600
                "
              >
                Launch
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
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
