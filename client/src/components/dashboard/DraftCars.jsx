import React, { useEffect, useState } from "react";
import { Trash2, Edit3, CarFront, Loader2 } from "lucide-react";
import CarmazikAlert from "../ui/CarmazikAlert";

const DRAFT_KEY = "carUploadDrafts";

const DraftCars = ({ onEditDraft }) => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const loadDrafts = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_KEY)) || [];
      setDrafts(saved);
    } catch (err) {
      console.error("Failed to load drafts:", err);
      setDrafts([]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadDrafts();
      setLoading(false);
    }, 300);

    // Live sync when other components update localStorage
    const syncHandler = () => loadDrafts();
    window.addEventListener("storage", syncHandler);
    return () => window.removeEventListener("storage", syncHandler);
  }, []);

  const deleteDraft = (index) => {
    const updated = drafts.filter((_, i) => i !== index);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
    setDrafts(updated);
    setAlert({
      type: "success",
      title: "Deleted",
      message: "Draft removed successfully.",
    });
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center py-20 text-gray-500">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-3" />
        Loading your drafts...
      </div>
    );

  if (drafts.length === 0)
    return (
      <div className="flex flex-col justify-center items-center py-20 text-gray-500">
        <CarFront className="h-16 w-16 text-gray-400 mb-3" />
        <p className="text-lg font-semibold">No draft cars found</p>
        <p className="text-sm text-gray-400">
          Upload a car to start saving drafts.
        </p>
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-orange-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
        My Draft Cars
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.map((car, i) => {
          const title = car.title?.trim() || "Untitled Car";
          const brand = car.brand?.trim() || "Brand N/A";
          const model = car.model?.trim() || "Model N/A";
          const price = car.price ? `₹ ${car.price}` : "Price not set";
          const img =
            car.previewImages?.[0] ||
            car.images?.[0] ||
            "https://via.placeholder.com/400x250?text=Car+Image";

          return (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
            >
              <img
                src={img}
                alt={title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {brand} • {model}
                </p>
                <p className="text-sm text-gray-600">{price}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => onEditDraft(car, i)}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Edit3 className="h-4 w-4" /> Edit
                  </button>
                  <button
                    onClick={() => deleteDraft(i)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {alert && <CarmazikAlert {...alert} onClose={() => setAlert(null)} />}
    </div>
  );
};

export default DraftCars;
