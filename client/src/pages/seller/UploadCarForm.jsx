import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { createCar } from "../../api/car";
import CarmazikAlert from "../../components/ui/CarmazikAlert";

const STORAGE_KEY = "carUploadDraft";

const UploadCarForm = () => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showDraftModal, setShowDraftModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    year: "",
    variant: "",
    bodyType: "",
    price: "",
    negotiable: false,
    fuelType: "",
    transmission: "",
    kmDriven: "",
    ownership: "",
    color: "",
    mileage: "",
    seatingCapacity: "",
    location: "",
    engine: { capacity: "", power: "", torque: "" },
    description: "",
    features: [],
    images: [],
  });

  const progress = (step / 7) * 100;

 
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasData =
        parsed &&
        parsed.formData &&
        Object.values(parsed.formData).some(
          (val) =>
            (typeof val === "string" && val.trim() !== "") ||
            (Array.isArray(val) && val.length > 0) ||
            (typeof val === "object" &&
              Object.values(val).some((v) => v && v.toString().trim() !== ""))
        );
      if (hasData) setShowDraftModal(true);
    }
  }, []);

  
  useEffect(() => {
    const hasData = Object.values(formData).some(
      (val) =>
        (typeof val === "string" && val.trim() !== "") ||
        (Array.isArray(val) && val.length > 0) ||
        (typeof val === "object" &&
          Object.values(val).some((v) => v && v.toString().trim() !== ""))
    );
    if (hasData || previewImages.length > 0) {
      const dataToSave = { formData, step, previewImages };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, step, previewImages]);

 
  const restoreDraft = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData || {});
      setStep(parsed.step || 1);
      setPreviewImages(parsed.previewImages || []);
      setAlert({
        type: "info",
        title: "Draft Restored",
        message: "✅ Your saved progress has been restored.",
      });
    }
    setShowDraftModal(false);
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({
      title: "",
      brand: "",
      model: "",
      year: "",
      variant: "",
      bodyType: "",
      price: "",
      negotiable: false,
      fuelType: "",
      transmission: "",
      kmDriven: "",
      ownership: "",
      color: "",
      mileage: "",
      seatingCapacity: "",
      location: "",
      engine: { capacity: "", power: "", torque: "" },
      description: "",
      features: [],
      images: [],
    });
    setPreviewImages([]);
    setStep(1);
    setShowDraftModal(false);
  };

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEngineChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      engine: { ...prev.engine, [name]: value },
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature],
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((file) => file.type.startsWith("image/"));
    if (valid.length + previewImages.length > 30) {
      setAlert({
        type: "warning",
        title: "Too many images!",
        message: "⚠️ You can upload up to 30 images only.",
      });
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

  const nextStep = () => step < 7 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const data = new FormData();
      for (const key in formData) {
        if (key === "engine") data.append("engine", JSON.stringify(formData.engine));
        else if (key === "features") data.append("features", JSON.stringify(formData.features));
        else if (key === "images")
          formData.images.forEach((file) => data.append("images", file));
        else data.append(key, formData[key]);
      }

      await createCar(data);
      setAlert({
        type: "success",
        title: "Car Uploaded!",
        message: "✅ Your car has been submitted for approval.",
      });
      localStorage.removeItem(STORAGE_KEY);
      clearDraft();
    } catch (err) {
      setAlert({
        type: "error",
        title: "Upload Failed",
        message: err.response?.data?.message || "❌ Something went wrong.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-10 relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            Upload Your Car 🚗
          </h1>
          <p className="text-gray-600 mt-2">Auto-save enabled. Your progress is safe!</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 transition-all hover:shadow-2xl">
          <Progress value={progress} />
          <p className="text-center text-gray-500 text-sm mt-2">Step {step} of 7</p>

          <form onSubmit={handleSubmit} className="space-y-10 mt-6">
            {renderStep(step, formData, handleChange, handleEngineChange, handleFeatureToggle, handleImageUpload, previewImages, removeImage)}

            <div className="flex flex-col sm:flex-row justify-between pt-6 gap-3">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  disabled={uploading}
                  className="cursor-pointer border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 7 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="cursor-pointer ml-auto bg-gradient-to-r from-blue-600 to-orange-500 text-white flex items-center justify-center gap-2 hover:opacity-90"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={uploading}
                  className="cursor-pointer ml-auto bg-gradient-to-r from-green-600 to-green-500 text-white flex items-center justify-center gap-2 hover:opacity-90"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {uploading ? "Uploading..." : "Submit"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {alert && <CarmazikAlert {...alert} onClose={() => setAlert(null)} />}

      {showDraftModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Resume Draft?
            </h2>
            <p className="text-gray-600 mb-6">
              We found a saved draft from your previous session.
              <br /> Would you like to continue where you left off?
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={restoreDraft} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                Resume Draft
              </Button>
              <Button onClick={clearDraft} variant="outline" className="cursor-pointer border-red-500 text-red-500 hover:bg-red-50">
                Start Fresh
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const renderStep = (step, formData, handleChange, handleEngineChange, handleFeatureToggle, handleImageUpload, previewImages, removeImage) => {
  switch (step) {
    case 1:
      return (
        <StepWrapper title="🧾 Basic Details">
          <div className="grid sm:grid-cols-2 gap-6">
            {["title", "brand", "model", "variant"].map((f) => (
              <FloatInput key={f} name={f} label={f.toUpperCase()} value={formData[f]} onChange={handleChange} />
            ))}
            <SelectInput name="bodyType" label="Body Type" value={formData.bodyType} onChange={handleChange} options={["Hatchback", "Sedan", "SUV", "MUV", "Luxury", "Sports", "Convertible"]} />
          </div>
        </StepWrapper>
      );

    case 2:
      return (
        <StepWrapper title="📅 Registration & Usage">
          <div className="grid sm:grid-cols-2 gap-6">
            <FloatInput name="year" label="Manufacture Year" value={formData.year} onChange={handleChange} type="number" />
            <FloatInput name="kmDriven" label="Kilometers Driven" value={formData.kmDriven} onChange={handleChange} type="number" />
            <SelectInput name="ownership" label="Ownership" value={formData.ownership} onChange={handleChange} options={["1st Owner", "2nd Owner", "3rd Owner", "4th Owner or More"]} />
            <FloatInput name="location" label="Location (City, State)" value={formData.location} onChange={handleChange} />
          </div>
        </StepWrapper>
      );

    case 3:
      return (
        <StepWrapper title="💰 Pricing">
          <div className="grid sm:grid-cols-2 gap-6">
            <FloatInput name="price" label="Expected Price (₹)" value={formData.price} onChange={handleChange} type="number" />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange} className="cursor-pointer accent-blue-600" />
              Negotiable Price
            </label>
          </div>
        </StepWrapper>
      );

    case 4:
      return (
        <StepWrapper title="⚙️ Engine & Performance">
          <div className="grid sm:grid-cols-2 gap-6">
            {["capacity", "power", "torque"].map((f) => (
              <FloatInput key={f} name={f} label={`Engine ${f}`} value={formData.engine[f]} onChange={handleEngineChange} />
            ))}
            <SelectInput name="fuelType" label="Fuel Type" value={formData.fuelType} onChange={handleChange} options={["Petrol", "Diesel", "CNG", "Electric", "Hybrid"]} />
            <SelectInput name="transmission" label="Transmission" value={formData.transmission} onChange={handleChange} options={["Manual", "Automatic"]} />
          </div>
        </StepWrapper>
      );

    case 5:
      return (
        <StepWrapper title="✨ Features">
          <div className="grid sm:grid-cols-2 gap-4">
            {["Air Conditioning", "Power Steering", "ABS", "Sunroof", "Cruise Control", "Rear Camera", "Touchscreen", "Alloy Wheels"].map((feature) => (
              <label key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={formData.features.includes(feature)} onChange={() => handleFeatureToggle(feature)} className="cursor-pointer accent-blue-600" />
                {feature}
              </label>
            ))}
          </div>
        </StepWrapper>
      );

    case 6:
      return (
        <StepWrapper title="🛋️ Interior & Description">
          <div className="grid sm:grid-cols-2 gap-6">
            <FloatInput name="color" label="Exterior Color" value={formData.color} onChange={handleChange} />
            <FloatInput name="mileage" label="Mileage / Range" value={formData.mileage} onChange={handleChange} />
            <FloatInput name="seatingCapacity" label="Seating Capacity" value={formData.seatingCapacity} onChange={handleChange} />
          </div>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your car (condition, extras, etc.)" rows="4" className="border mt-4 p-3 w-full rounded-md focus:ring-2 focus:ring-blue-400 outline-none" />
        </StepWrapper>
      );

    case 7:
      return (
        <StepWrapper title="📸 Upload Images">
          <div onClick={() => document.getElementById("carImages").click()} className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
            <ImageIcon className="h-10 w-10 text-blue-500 mb-2" />
            <p className="text-gray-700 font-medium">Click or Drag to Upload Images</p>
            <p className="text-xs text-gray-500">(Max 30 images)</p>
            <input id="carImages" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-6">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative group border rounded-lg overflow-hidden">
                  <img src={img} alt="preview" className="w-full h-24 sm:h-28 object-cover" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </StepWrapper>
      );
    default:
      return null;
  }
};

const StepWrapper = ({ title, children }) => (
  <div className="p-6 bg-gradient-to-r from-gray-50 to-white border rounded-xl shadow-sm hover:shadow-md transition-all">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const FloatInput = ({ label, name, value, onChange, type = "text" }) => (
  <div className="relative">
    <input
      id={name} name={name} type={type} value={value} onChange={onChange} className="peer border border-gray-300 rounded-md w-full p-3 pt-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" placeholder=" " /> <label htmlFor={name} className="absolute text-gray-500 text-sm left-3 top-2.5 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:top-2.5 peer-focus:text-blue-500"> {label} </label>

  </div>
);const SelectInput = ({ label, name, value, onChange, options }) => (

  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select id={name} name={name} value={value} onChange={onChange} className="cursor-pointer border border-gray-300 rounded-md w-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);export default UploadCarForm;