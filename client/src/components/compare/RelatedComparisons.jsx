import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const RelatedComparisons = ({ brand }) => {
  // temporary static suggestions (later API se aayega)
  const suggestions = [
    { a: "Swift", b: "Baleno" },
    { a: "Creta", b: "Seltos" },
    { a: "Nexon", b: "Brezza" },
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">
        Similar car comparisons
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((c, i) => {
          const slug = `${c.a.toLowerCase()}-vs-${c.b.toLowerCase()}`;
          return (
            <Link
              key={i}
              to={`/compare/${slug}`}
              className="border rounded-xl p-4 hover:shadow transition bg-white"
            >
              <div className="font-semibold">
                {c.a} vs {c.b}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Compare price, mileage & features
              </div>

              <div className="flex items-center text-orange-600 text-sm mt-3">
                Compare now <ArrowRight className="h-4 w-4 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedComparisons;
