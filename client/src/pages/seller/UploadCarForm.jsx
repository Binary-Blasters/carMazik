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

/* ======================================================
   MAIN COMPONENT
====================================================== */
const UploadCarForm = () => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showDraftModal, setShowDraftModal] = useState(false);

  const [formData, setFormData] = useState({
    /* STEP 1 */
    title: "",
    brand: "",
    model: "",
    variant: "",
    bodyType: "",

    /* STEP 2 */
    year: "",
    kmDriven: "",
    ownership: "",
    location: "",

    /* STEP 3 */
    fuelType: "",
    transmission: "",

    /* STEP 4 – DYNAMIC */
    engine: { capacity: "", power: "", torque: "" },
    electric: { range: "", batteryCapacity: "", chargingTime: "" },
    cng: { tankCapacity: "" },
    mileage: "",

    /* STEP 5 */
    price: "",
    negotiable: false,

    /* STEP 6 */
    features: [],
    description: "",

    /* STEP 7 */
    images: [],
  });

  const progress = (step / 7) * 100;

  /* ======================================================
     DRAFT AUTO SAVE
  ====================================================== */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setShowDraftModal(true);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ formData, step, previewImages })
    );
  }, [formData, step, previewImages]);

  const restoreDraft = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      setFormData(saved.formData);
      setStep(saved.step);
      setPreviewImages(saved.previewImages || []);
    }
    setShowDraftModal(false);
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  /* ======================================================
     HANDLERS
  ====================================================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEngineChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      engine: { ...p.engine, [name]: value },
    }));
  };

  const handleElectricChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      electric: { ...p.electric, [name]: value },
    }));
  };

  const handleCngChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({
      ...p,
      cng: { ...p.cng, [name]: value },
    }));
  };

  const toggleFeature = (feature) => {
    setFormData((p) => ({
      ...p,
      features: p.features.includes(feature)
        ? p.features.filter((f) => f !== feature)
        : [...p.features, feature],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((p) => ({ ...p, images: [...p.images, ...files] }));
    setPreviewImages((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (i) => {
    setPreviewImages((p) => p.filter((_, idx) => idx !== i));
    setFormData((p) => ({
      ...p,
      images: p.images.filter((_, idx) => idx !== i),
    }));
  };

  /* ======================================================
     SUBMIT
  ====================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUploading(true);
      const data = new FormData();

      Object.entries(formData).forEach(([k, v]) => {
        if (["engine", "electric", "cng", "features"].includes(k)) {
          data.append(k, JSON.stringify(v));
        } else if (k === "images") {
          v.forEach((img) => data.append("images", img));
        } else {
          data.append(k, v);
        }
      });

      await createCar(data);
      localStorage.removeItem(STORAGE_KEY);
      setAlert({
        type: "success",
        title: "Car Uploaded 🚗",
        message: "Your car has been sent for admin approval.",
      });
    } catch {
      setAlert({
        type: "error",
        title: "Upload Failed",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  /* ======================================================
     UI
  ====================================================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Upload Your Car 🚗
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Step {step} of 7
        </p>

        <Progress value={progress} />

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {renderStep(
            step,
            formData,
            handleChange,
            handleEngineChange,
            handleElectricChange,
            handleCngChange,
            toggleFeature,
            handleImageUpload,
            previewImages,
            removeImage
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}

            {step < 7 ? (
              <Button type="button" onClick={() => setStep(step + 1)}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check />}
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>

      {alert && <CarmazikAlert {...alert} onClose={() => setAlert(null)} />}

      {showDraftModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <h2 className="font-bold mb-3">Resume Draft?</h2>
            <div className="flex gap-4 justify-center">
              <Button onClick={restoreDraft}>Resume</Button>
              <Button variant="outline" onClick={clearDraft}>
                Start Fresh
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ======================================================
   STEPS
====================================================== */
const renderStep = (
  step,
  formData,
  handleChange,
  handleEngineChange,
  handleElectricChange,
  handleCngChange,
  toggleFeature,
  handleImageUpload,
  previewImages,
  removeImage
) => {
  switch (step) {

    case 1:
      return (
        <Step title="🚗 Car Identity">
          <Grid>
            <Input name="title" label="Title" value={formData.title} onChange={handleChange} />
            <Input name="brand" label="Brand" value={formData.brand} onChange={handleChange} />
            <Input name="model" label="Model" value={formData.model} onChange={handleChange} />
            <Input name="variant" label="Variant" value={formData.variant} onChange={handleChange} />
            <Select name="bodyType" label="Body Type" value={formData.bodyType} onChange={handleChange}
              options={["Hatchback", "Sedan", "SUV", "MUV", "Luxury"]} />
          </Grid>
        </Step>
      );

    case 2:
      return (
        <Step title="📅 Registration & Usage">
          <Grid>
            <Input name="year" label="Manufacture Year" value={formData.year} onChange={handleChange} />
            <Input name="kmDriven" label="KM Driven" value={formData.kmDriven} onChange={handleChange} />
            <Select name="ownership" label="Ownership" value={formData.ownership} onChange={handleChange}
              options={["1st Owner", "2nd Owner", "3rd Owner", "4th Owner+"]} />
            <Input name="location" label="Location" value={formData.location} onChange={handleChange} />
          </Grid>
        </Step>
      );

    case 3:
      return (
        <Step title="⛽ Fuel & Transmission">
          <Grid>
            <Select name="fuelType" label="Fuel Type" value={formData.fuelType} onChange={handleChange}
              options={["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]} />
            <Select name="transmission" label="Transmission" value={formData.transmission} onChange={handleChange}
              options={["Manual", "Automatic"]} />
          </Grid>
        </Step>
      );

    case 4:
      return (
        <Step title="⚙️ Performance">
          {["Petrol", "Diesel"].includes(formData.fuelType) && (
            <Grid>
              <Input name="capacity" label="Engine Capacity (cc)" value={formData.engine.capacity} onChange={handleEngineChange} />
              <Input name="power" label="Power (bhp)" value={formData.engine.power} onChange={handleEngineChange} />
              <Input name="torque" label="Torque (Nm)" value={formData.engine.torque} onChange={handleEngineChange} />
              <Input name="mileage" label="Mileage (km/l)" value={formData.mileage} onChange={handleChange} />
            </Grid>
          )}

          {formData.fuelType === "Electric" && (
            <Grid>
              <Input name="range" label="Range (km)" value={formData.electric.range} onChange={handleElectricChange} />
              <Input name="batteryCapacity" label="Battery Capacity (kWh)" value={formData.electric.batteryCapacity} onChange={handleElectricChange} />
              <Input name="chargingTime" label="Charging Time (hrs)" value={formData.electric.chargingTime} onChange={handleElectricChange} />
            </Grid>
          )}

          {formData.fuelType === "Hybrid" && (
            <Grid>
              <Input name="capacity" label="Engine Capacity (cc)" value={formData.engine.capacity} onChange={handleEngineChange} />
              <Input name="range" label="Electric Range (km)" value={formData.electric.range} onChange={handleElectricChange} />
            </Grid>
          )}

          {formData.fuelType === "CNG" && (
            <Grid>
              <Input name="capacity" label="Engine Capacity (cc)" value={formData.engine.capacity} onChange={handleEngineChange} />
              <Input name="tankCapacity" label="CNG Tank Capacity (kg)" value={formData.cng.tankCapacity} onChange={handleCngChange} />
            </Grid>
          )}
        </Step>
      );

    case 5:
      return (
        <Step title="💰 Pricing">
          <Grid>
            <Input name="price" label="Expected Price (₹)" value={formData.price} onChange={handleChange} />
            <label className="flex gap-2 items-center">
              <input type="checkbox" name="negotiable" checked={formData.negotiable} onChange={handleChange} />
              Negotiable
            </label>
          </Grid>
        </Step>
      );

    case 6:
      return (
        <Step title="✨ Features & Description">
          <div className="grid grid-cols-2 gap-3">
            {["ABS", "Airbags", "Sunroof", "Touchscreen", "Alloy Wheels"].map((f) => (
              <label key={f} className="flex gap-2">
                <input type="checkbox" checked={formData.features.includes(f)} onChange={() => toggleFeature(f)} />
                {f}
              </label>
            ))}
          </div>
          <textarea
            name="description"
            placeholder="Describe your car condition..."
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-3 rounded mt-4"
            rows={4}
          />
        </Step>
      );

    case 7:
  return (
    <Step title="📸 Upload Car Photos">
      {/* Upload Box */}
      <div
        onClick={() => document.getElementById("carImages").click()}
        className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 hover:bg-blue-100 transition"
      >
        <ImageIcon className="h-12 w-12 text-blue-500 mb-3" />
        <p className="text-lg font-semibold text-gray-700">
          Click or Drag & Drop Images
        </p>
        <p className="text-sm text-gray-500 mt-1">
          JPG / PNG • Max 30 images
        </p>

        <input
          id="carImages"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Image Count */}
      {previewImages.length > 0 && (
        <p className="text-sm text-gray-500 mt-3">
          {previewImages.length} / 30 images uploaded
        </p>
      )}

      {/* Preview Grid */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {previewImages.map((img, i) => (
            <div
              key={i}
              className="relative group rounded-lg overflow-hidden border shadow-sm"
            >
              {/* Image */}
              <img
                src={img}
                alt="preview"
                className="w-full h-32 object-cover transition-transform group-hover:scale-105"
              />

              {/* Primary Badge */}
              {i === 0 && (
                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                  Primary
                </span>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <div className="mt-4 text-sm text-gray-600">
        <ul className="list-disc ml-5 space-y-1">
          <li>First image will be shown as main cover</li>
          <li>Add clear exterior & interior shots</li>
          <li>Avoid blurry or dark photos</li>
        </ul>
      </div>
    </Step>
  );


    default:
      return null;
  }
};

/* ======================================================
   SMALL UI COMPONENTS
====================================================== */
const Step = ({ title, children }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid sm:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <input {...props} className="w-full border p-2 rounded" />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <select {...props} className="w-full border p-2 rounded">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

export default UploadCarForm;
