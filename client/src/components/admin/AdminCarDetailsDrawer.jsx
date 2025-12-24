import { X } from "lucide-react";

const AdminCarDetailsDrawer = ({ car, onClose }) => {
  if (!car) return null;

  const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      {/* MODAL */}
      <div
        className="
          w-full max-w-3xl 
          bg-white rounded-2xl shadow-2xl 
          overflow-hidden
          animate-scaleIn
          max-h-[90vh]
          flex flex-col
        "
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">Car Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-6 space-y-6">

          {/* IMAGES */}
          {car.images?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {car.images.map((img, i) => (
                <img
                  key={i}
                  src={`${BASE_IMAGE_URL}${img}`}
                  alt="car"
                  className="h-40 w-full object-cover rounded-xl"
                />
              ))}
            </div>
          )}

          {/* BASIC INFO */}
          <Section title="Car Information">
            <Info label="Title" value={car.title} />
            <Info label="Brand" value={car.brand} />
            <Info label="Model" value={car.model} />
            <Info label="Variant" value={car.variant} />
            <Info label="Body Type" value={car.bodyType} />
          </Section>

          {/* SPECS */}
          <Section title="Specifications">
            <Info label="Fuel Type" value={car.fuelType} />
            <Info label="Transmission" value={car.transmission} />
            <Info label="Year" value={car.year} />
            <Info label="KM Driven" value={`${car.kmDriven} km`} />
            <Info label="Location" value={car.location} />
          </Section>

          {/* PRICE */}
          <div className="bg-blue-50 p-4 rounded-xl text-center">
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{car.price?.toLocaleString()}
            </p>
          </div>

          {/* DESCRIPTION */}
          {car.description && (
            <Section title="Description">
              <p className="text-gray-600 leading-relaxed">
                {car.description}
              </p>
            </Section>
          )}

          {/* SELLER */}
          <Section title="Seller Details">
            <Info label="Name" value={car.seller?.name} />
            <Info label="Contact" value={car.seller?.contact} />
          </Section>
        </div>
      </div>
    </div>
  );
};

/* ---------------- SMALL UI ---------------- */

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold border-b pb-1">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-right">{value || "-"}</span>
  </div>
);

export default AdminCarDetailsDrawer;
