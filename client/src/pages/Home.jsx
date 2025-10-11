
import React from "react";
import { motion } from "framer-motion";

const featuredCars = [
  { id: 1, name: "Mazik GT", price: "₹ 32,49,000", specs: "450 HP · 3.2s 0-100km/h · AWD", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&s=5f4f2c1d1b4f1a9a9a6f6e1b1a1c0d2e" },
  { id: 2, name: "CarMazik Lux", price: "₹ 42,99,000", specs: "380 HP · 0.8L turbo · RWD", image: "https://images.unsplash.com/photo-1511910849309-1b58c1a84f45?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a2b6e3f7b7a8c0d1e2f3a4b5c6d7e8f" },
  { id: 3, name: "Mazik Urban", price: "₹ 15,99,000", specs: "120 HP · Efficient · Compact", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c2a1b4d6e7f8a9b0c1d2e3f4a5b6c7d" },
];

function Hero() {
  return (
    <section className="relative pt-24 md:pt-28 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
            Discover Your Next <span className="text-red-500">Drive</span>
          </h1>
          <p className="mt-4 text-gray-300 max-w-xl">
            CarMazik curates the best vehicles — performance, luxury and everyday reliability.
          </p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <button className="px-6 py-3 bg-red-600 rounded-full text-white font-semibold hover:bg-red-500 transition">Explore Cars</button>
            <button className="px-6 py-3 border border-gray-700 rounded-full text-gray-200 hover:bg-white/5 transition">Quick Tour</button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img src={featuredCars[0].image} alt="hero car" className="w-full h-[480px] object-cover brightness-90" />
            <div className="absolute left-6 bottom-6 bg-gradient-to-r from-red-700/60 to-transparent backdrop-blur-sm rounded-2xl p-4 w-[70%]">
              <div className="text-xs text-gray-100">Featured</div>
              <div className="mt-1 font-semibold text-white text-lg">{featuredCars[0].name}</div>
              <div className="mt-1 text-sm text-gray-200">{featuredCars[0].specs} • {featuredCars[0].price}</div>
            </div>
            <div className="absolute -top-20 -right-40 w-72 h-72 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedSection() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <h2 className="text-2xl font-bold text-white mb-6">Featured Cars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car, idx) => (
            <motion.div key={car.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="rounded-2xl overflow-hidden bg-gradient-to-b from-white/3 to-black/20 border border-white/6">
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
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-12 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h3 className="text-3xl text-white font-bold">Why CarMazik?</h3>
          <p className="mt-4 text-gray-300">We blend expert curation with transparent pricing and a premium buying experience. Each vehicle undergoes a multi-point inspection and is hand-selected by our team.</p>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
            <li className="bg-white/6 p-3 rounded-lg">Certified inspections</li>
            <li className="bg-white/6 p-3 rounded-lg">7-day test drive policy</li>
            <li className="bg-white/6 p-3 rounded-lg">On-demand finance options</li>
            <li className="bg-white/6 p-3 rounded-lg">Doorstep delivery</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <button className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold shadow">Get Started</button>
            <button className="px-5 py-2 rounded-full border border-white/8 text-gray-200">Learn More</button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img alt="about car" src={featuredCars[2].image} className="w-full object-cover h-80" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-12 mt-8">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h3 className="text-2xl text-white font-bold">Ready to roll?</h3>
          <p className="mt-3 text-gray-300">Book a test drive or list your car in minutes.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold shadow">Book Test Drive</button>
            <button className="px-6 py-3 rounded-full border border-white/8 text-gray-200">List Your Car</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <main className="pt-6">
        <Hero />
        <FeaturedSection />
        <AboutSection />
        <CTASection />
      </main>
    </div>
  );
}