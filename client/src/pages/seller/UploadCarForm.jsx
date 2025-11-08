import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  Upload,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import axios from "axios";

const UploadCarForm = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    price: "",
    fuelType: "",
    transmission: "",
    kmDriven: "",
    ownership: "",
    color: "",
    description: "",
    engine: { capacity: "", power: "", torque: "" },
    mileage: "",
    seatingCapacity: "",
    images: [],
  });

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEngineChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      engine: { ...prev.engine, [name]: value },
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((file) => file.type.startsWith("image/"));
    if (valid.length + previewImages.length > 30) {
      alert("⚠️ You can upload up to 30 images only.");
      return;
    }
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...valid] }));
    setPreviewImages((prev) => [
      ...prev,
      ...valid.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => step < 4 && (setStep(step + 1), setProgress((p) => p + 25));
  const prevStep = () => step > 1 && (setStep(step - 1), setProgress((p) => p - 25));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const data = new FormData();
      for (const key in formData) {
        if (key === "engine") data.append("engine", JSON.stringify(formData.engine));
        else if (key === "images") formData.images.forEach((f) => data.append("images", f));
        else data.append(key, formData[key]);
      }
      await axios.post("/api/v1/cars/create", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Car uploaded successfully!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-3">
            Upload Your Car 🚗
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Provide details to list your car for sale
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
          <div className="mb-8">
            <Progress value={progress} />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Step {step} of 4
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  🧾 Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["title", "brand", "model", "year", "price"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      type={field === "year" || field === "price" ? "number" : "text"}
                      placeholder={field.toUpperCase()}
                      value={formData[field]}
                      onChange={handleChange}
                      className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                      required
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  ⚙️ Technical Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Fuel Type</option>
                    {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>

                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Transmission</option>
                    <option>Manual</option>
                    <option>Automatic</option>
                  </select>

                  <input
                    type="number"
                    name="kmDriven"
                    placeholder="KM Driven"
                    value={formData.kmDriven}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                  />

                  <select
                    name="ownership"
                    value={formData.ownership}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Ownership</option>
                    <option>1st Owner</option>
                    <option>2nd Owner</option>
                    <option>3rd Owner</option>
                    <option>4th Owner or More</option>
                  </select>

                  <input
                    name="color"
                    placeholder="Color"
                    value={formData.color}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    name="mileage"
                    placeholder="Mileage (km/l)"
                    value={formData.mileage}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                  <input
                    type="number"
                    name="seatingCapacity"
                    placeholder="Seating Capacity"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                    className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  🧩 Engine & Performance
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["capacity", "power", "torque"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      placeholder={`Engine ${field}`}
                      value={formData.engine[field]}
                      onChange={handleEngineChange}
                      className="border p-3 rounded-md focus:ring-2 focus:ring-blue-400"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  📸 Upload Images & Description
                </h3>
                <textarea
                  name="description"
                  placeholder="Describe your car (features, condition, etc.)"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <div
                  onClick={() => document.getElementById("carImages").click()}
                  className="mt-6 flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
                >
                  <ImageIcon className="h-10 w-10 text-blue-500 mb-2" />
                  <p className="text-gray-700 font-medium">
                    Drag & Drop or <span className="text-blue-600 font-semibold">Browse</span>
                  </p>
                  <p className="text-xs text-gray-500">(Max 30 images)</p>
                  <input
                    id="carImages"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-6">
                    {previewImages.map((img, idx) => (
                      <div key={idx} className="relative group border rounded-lg overflow-hidden">
                        <img src={img} alt="preview" className="w-full h-24 sm:h-28 object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between pt-6 gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  disabled={uploading}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto bg-gradient-to-r from-blue-600 to-orange-500 text-white flex items-center justify-center gap-2 hover:opacity-90"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={uploading}
                  className="ml-auto bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center justify-center gap-2 hover:opacity-90"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {uploading ? "Uploading..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadCarForm;
