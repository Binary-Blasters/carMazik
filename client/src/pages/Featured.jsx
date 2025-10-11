
import React from "react";
import { motion } from "framer-motion";

const featuredCars = [
  { id: 1, name: "Mazik GT", price: "₹ 32,49,000", specs: "450 HP · 3.2s 0-100km/h · AWD", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&s=5f4f2c1d1b4f1a9a9a6f6e1b1a1c0d2e" },
  { id: 2, name: "CarMazik Lux", price: "₹ 42,99,000", specs: "380 HP · 0.8L turbo · RWD", image: "https://images.unsplash.com/photo-1511910849309-1b58c1a84f45?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a2b6e3f7b7a8c0d1e2f3a4b5c6d7e8f" },
  { id: 3, name: "Mazik Urban", price: "₹ 15,99,000", specs: "120 HP · Efficient · Compact", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c2a1b4d6e7f8a9b0c1d2e3f4a5b6c7d" },
  { id: 4, name: "Mazik Sport", price: "₹ 55,49,000", specs: "600 HP · 2.9s 0-100km/h · AWD", image: "https://images.unsplash.com/photo-1618173970380-351b9d13d89f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=4b2c2a1f7e6d9c3a2f1b0c8a7d6e5f4a" },
  { id: 5, name: "Mazik Lux SUV", price: "₹ 62,99,000", specs: "450 HP · 0.9L Turbo · AWD", image: "https://images.unsplash.com/photo-1605902711622-cfb43c4430b0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=7c1a9b5d3e2f1a4b6c7d8e9f0a1b2c3d" },
  { id: 6, name: "Mazik Compact", price: "₹ 12,49,000", specs: "100 HP · Efficient · Compact", image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=5f4b3c2a1d0e7f8a9b0c1d2e3f4a5b6c" },
];

function CarCard({ car, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="rounded-2xl overflow-hidden bg-gradient-to-b from-white/3 to-black/20 border border-white/6"
    >
      <div className="relative">
        <img src={car.image} alt={car.name} className="w-full h-44 object-cover" />
        <div className="absolute left-3 top-3 bg-black/40 px-3 py-1 rounded-full text-xs text-white">{car.name.split(' ')[0]}</div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-semibold">{car.name}</div>
            <div className="text-xs text-gray-300 mt-1">{car.specs}</div>
          </div>
          <div className="text-red-400 font-bold">{car.price}</div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button className="flex-1 py-2 rounded-lg bg-red-600 text-white font-medium shadow">View</button>
          <button className="px-3 py-2 rounded-lg border border-gray-700 text-gray-200">Compare</button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Featured() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <main className="pt-24 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Featured Cars</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car, idx) => (
            <CarCard key={car.id} car={car} idx={idx} />
          ))}
        </div>
      </main>
    </div>
  );
}
