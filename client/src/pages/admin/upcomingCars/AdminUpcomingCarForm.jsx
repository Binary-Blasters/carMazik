import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

const AdminUpcomingCarForm = ({ car, onClose, onSave }) => {
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    variant: "",
    bodyType: "",
    fuelType: "",
    transmission: "",
    expectedLaunchDate: "",
    year: "",
    engine: { capacity: "", power: "", torque: "" },
    battery: { range: "", chargingTime: "" },
    features: "",
    description: "",
    images: [],
  });

  const [previews, setPreviews] = useState([]);

  /* ---------- EDIT MODE ---------- */
  useEffect(() => {
    if (!car) return;

    setFormData({
      title: car.title || "",
      brand: car.brand || "",
      model: car.model || "",
      variant: car.variant || "",
      bodyType: car.bodyType || "",
      fuelType: car.fuelType || "",
      transmission: car.transmission || "",
      expectedLaunchDate: car.expectedLaunchDate
        ? car.expectedLaunchDate.split("T")[0]
        : "",
      year: car.year || "",
      engine: car.engine || { capacity: "", power: "", torque: "" },
      battery: car.battery || { range: "", chargingTime: "" },
      features: car.features?.join(", ") || "",
      description: car.description || "",
      images: [],
    });

    if (car.images?.length) setPreviews(car.images);
  }, [car]);

  /* ---------- HANDLERS ---------- */

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNestedChange = (group, field, value) =>
    setFormData({
      ...formData,
      [group]: { ...formData[group], [field]: value },
    });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  /* ---------- VALIDATION ---------- */

  const validateForm = () => {
    if (
      !formData.title ||
      !formData.brand ||
      !formData.model ||
      !formData.fuelType ||
      !formData.expectedLaunchDate
    ) {
      setError("Please fill all required fields");
      return false;
    }
    setError("");
    return true;
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();

    data.append("title", formData.title);
    data.append("brand", formData.brand);
    data.append("model", formData.model);
    data.append("variant", formData.variant);
    data.append("bodyType", formData.bodyType);
    data.append("fuelType", formData.fuelType);
    data.append("transmission", formData.transmission);
    data.append("expectedLaunchDate", formData.expectedLaunchDate);
    data.append("year", formData.year);

    data.append("engine", JSON.stringify(formData.engine));
    data.append("battery", JSON.stringify(formData.battery));

    data.append(
      "features",
      JSON.stringify(
        formData.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean)
      )
    );

    data.append("description", formData.description);

    formData.images.forEach((img) => {
      data.append("images", img);
    });

    onSave(data);
  };

  /* ---------- UI ---------- */

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between p-4 border-b">
          <h2 className="text-xl font-bold">
            {car ? "Edit Upcoming Car" : "Add Upcoming Car"}
          </h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-6"
        >
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* BASIC INFO */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Title *" name="title" value={formData.title} onChange={handleChange} />
            <Input label="Brand *" name="brand" value={formData.brand} onChange={handleChange} />
            <Input label="Model *" name="model" value={formData.model} onChange={handleChange} />
            <Input label="Variant" name="variant" value={formData.variant} onChange={handleChange} />
            <Input label="Body Type" name="bodyType" value={formData.bodyType} onChange={handleChange} />

            <Select
              label="Fuel Type *"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              options={["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]}
            />

            <Select
              label="Transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              options={["Manual", "Automatic"]}
            />

            <Input
              type="date"
              label="Expected Launch *"
              name="expectedLaunchDate"
              value={formData.expectedLaunchDate}
              onChange={handleChange}
            />
          </div>

          {/* ENGINE / BATTERY */}
          {formData.fuelType !== "Electric" ? (
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Engine Capacity" value={formData.engine.capacity}
                onChange={(e) => handleNestedChange("engine", "capacity", e.target.value)}
              />
              <Input label="Power" value={formData.engine.power}
                onChange={(e) => handleNestedChange("engine", "power", e.target.value)}
              />
              <Input label="Torque" value={formData.engine.torque}
                onChange={(e) => handleNestedChange("engine", "torque", e.target.value)}
              />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Range" value={formData.battery.range}
                onChange={(e) => handleNestedChange("battery", "range", e.target.value)}
              />
              <Input label="Charging Time" value={formData.battery.chargingTime}
                onChange={(e) => handleNestedChange("battery", "chargingTime", e.target.value)}
              />
            </div>
          )}

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <Textarea
            label="Features (comma separated)"
            name="features"
            value={formData.features}
            onChange={handleChange}
          />

          {/* IMAGES */}
          <label className="border-dashed border-2 p-6 rounded cursor-pointer block text-center">
            <Upload className="mx-auto mb-2" />
            Upload Images
            <input
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            {previews.map((img, i) => (
              <img key={i} src={img} className="h-24 object-cover rounded" />
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-5 py-2 rounded"
            >
              {car ? "Update Upcoming Car" : "Add Upcoming Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- SMALL COMPONENTS ---------- */

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm">{label}</label>
    <input {...props} className="w-full border p-2 rounded" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="text-sm">{label}</label>
    <textarea {...props} rows={4} className="w-full border p-2 rounded" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm">{label}</label>
    <select {...props} className="w-full border p-2 rounded">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default AdminUpcomingCarForm;
