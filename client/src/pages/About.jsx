// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const features = [
  { title: "Certified inspections", icon: <CheckCircleIcon className="h-6 w-6 text-red-500" /> },
  { title: "7-day test drive policy", icon: <CheckCircleIcon className="h-6 w-6 text-red-500" /> },
  { title: "On-demand finance options", icon: <CheckCircleIcon className="h-6 w-6 text-red-500" /> },
  { title: "Doorstep delivery", icon: <CheckCircleIcon className="h-6 w-6 text-red-500" /> },
];

function FeatureCard({ feature }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 p-4 rounded-xl flex items-center gap-3 text-gray-200 shadow hover:shadow-lg transition"
    >
      {feature.icon}
      <span className="font-medium">{feature.title}</span>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black/90 to-gray-900 text-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl font-extrabold mb-6">Why Choose <span className="text-red-500">CarMazik</span>?</h1>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            CarMazik blends expert curation with transparent pricing and a premium buying experience. Each vehicle undergoes a multi-point inspection and is hand-picked by our team.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold shadow-lg hover:bg-red-500 transition">
              Get Started
            </button>
            <button className="px-6 py-3 rounded-full border border-gray-700 text-gray-200 hover:bg-white/5 transition">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c2a1b4d6e7f8a9b0c1d2e3f4a5b6c7d"
              alt="About CarMazik"
              className="w-full h-[400px] md:h-[500px] lg:h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl" />
          </div>
          <div className="absolute -mt-16 ml-6 bg-black/40 p-4 rounded-xl border border-white/6 shadow-lg">
            <div className="text-xs text-gray-300">Trusted Dealer Network</div>
            <div className="text-white font-semibold text-lg">CarMazik Verified</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
