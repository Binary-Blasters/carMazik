import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryStats } from "../../api/listing";

const categories = [
  {
    key: "hatchback",
    name: "Hatchback",
    img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400",
    count: "150+ Cars",
  },
  {
    key: "sedan",
    name: "Sedan",
    img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400",
    count: "120+ Cars",
  },
  {
    key: "suv",
    name: "SUV",
    img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400",
    count: "200+ Cars",
  },
  {
    key: "luxury",
    name: "Luxury",
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
    count: "80+ Cars",
  },
];

const BrowseByCategory = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    getCategoryStats().then((res) => {

      setStats(res || {});
    });
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              to={`/listings?bodyType=${cat.key}`}
              className="group relative overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={cat.img}
                className="w-full h-48 object-cover group-hover:scale-110 transition"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold">{cat.name}</h3>
                <p className="text-white/80 text-sm">
                  {stats[cat.key] ? `${stats[cat.key]} Cars` : "Coming Soon 🚀"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByCategory;
