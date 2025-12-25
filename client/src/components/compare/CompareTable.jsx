import {
  IndianRupee,
  Gauge,
  Fuel,
  Calendar,
  Car,
  Users,
} from "lucide-react";

const SpecRow = ({ icon: Icon, label, a, b, winA, winB }) => (
  <div className="grid md:grid-cols-3 gap-4 items-center py-4 border-b">
    {/* SPEC */}
    <div className="flex items-center gap-2 text-gray-600 text-sm">
      <Icon className="h-4 w-4" />
      {label}
    </div>

    {/* CAR A */}
    <div
      className={`p-3 rounded-lg ${
        winA ? "bg-green-50 border border-green-300" : "bg-gray-50"
      }`}
    >
      <div className="font-medium">{a}</div>
      {winA && (
        <div className="text-xs text-green-600 mt-1">Better choice</div>
      )}
    </div>

    {/* CAR B */}
    <div
      className={`p-3 rounded-lg ${
        winB ? "bg-green-50 border border-green-300" : "bg-gray-50"
      }`}
    >
      <div className="font-medium">{b}</div>
      {winB && (
        <div className="text-xs text-green-600 mt-1">Better choice</div>
      )}
    </div>
  </div>
);

const CompareTable = ({ carA, carB, comparison }) => {
  if (!comparison) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* HEADER */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div></div>

        <div className="text-center">
          <h3 className="font-bold text-lg">{carA.model}</h3>
          <p className="text-sm text-gray-500">{carA.fuelType}</p>
        </div>

        <div className="text-center">
          <h3 className="font-bold text-lg">{carB.model}</h3>
          <p className="text-sm text-gray-500">{carB.fuelType}</p>
        </div>
      </div>

      {/* PRICE */}
      <SpecRow
        icon={IndianRupee}
        label="Price"
        a={`₹${Number(carA.price).toLocaleString()}`}
        b={`₹${Number(carB.price).toLocaleString()}`}
        winA={comparison.price.a === "better"}
        winB={comparison.price.b === "better"}
      />

      {/* MILEAGE */}
      <SpecRow
        icon={Gauge}
        label="Mileage"
        a={carA.mileage || "—"}
        b={carB.mileage || "—"}
        winA={comparison.mileage.a === "better"}
        winB={comparison.mileage.b === "better"}
      />

      {/* YEAR */}
      <SpecRow
        icon={Calendar}
        label="Model Year"
        a={carA.year}
        b={carB.year}
        winA={comparison.year.a === "better"}
        winB={comparison.year.b === "better"}
      />

      {/* FUEL */}
      <SpecRow
        icon={Fuel}
        label="Fuel Type"
        a={carA.fuelType}
        b={carB.fuelType}
      />

      {/* TRANSMISSION */}
      <SpecRow
        icon={Car}
        label="Transmission"
        a={carA.transmission}
        b={carB.transmission}
      />

      {/* SEATING */}
      <SpecRow
        icon={Users}
        label="Seating Capacity"
        a={carA.seatingCapacity || "—"}
        b={carB.seatingCapacity || "—"}
      />
    </div>
  );
};

export default CompareTable;
