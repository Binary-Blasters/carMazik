import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const QUICK_COMPARE = [
  {
    id: 1,
    title: "Compact: Hatchback vs Sedan",
    data: [
      ["Starting Price", "₹5L - ₹9L"],
      ["Fuel Avg", "18 - 22 kmpl"],
      ["Seating", "4 - 5"],
      ["Best For", "City commute"],
    ],
  },
  {
    id: 2,
    title: "SUVs: City vs Highway",
    data: [
      ["Starting Price", "₹8L - ₹25L"],
      ["Fuel Avg", "12 - 18 kmpl"],
      ["Seating", "5 - 7"],
      ["Best For", "Family trips"],
    ],
  },
  {
    id: 3,
    title: "Electric: Short vs Long range",
    data: [
      ["Range", "200 - 500+ km"],
      ["Charging Time", "30 min - 8 hrs"],
      ["Running Cost", "Low"],
      ["Ideal Buyer", "City / commuters"],
    ],
  },
];

const CompareQuickSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">
              Compare & choose the right car
            </h2>
            <p className="text-gray-600">
              Quick comparisons to help you decide
            </p>
          </div>

          <Link
            to="/compare"
            className="border px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50"
          >
            Start Comparing <ArrowRight size={16} />
          </Link>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {QUICK_COMPARE.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl p-6 hover:shadow-lg transition"
            >
              <h3 className="font-semibold mb-4">{item.title}</h3>

              <div className="space-y-2 text-sm">
                {item.data.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between text-gray-600"
                  >
                    <span>{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <Link
                to={`/compare/${item.id}`}
                className="text-blue-600 text-sm mt-4 inline-block"
              >
                See detailed comparison →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompareQuickSection;
