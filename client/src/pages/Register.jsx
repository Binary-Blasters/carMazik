
import React from "react";
import { motion } from "framer-motion";

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-6 md:px-12 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-800/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h1>

        <form className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Full Name"
            className="p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-600 transition"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-600 transition"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-red-600 transition"
          />
          <button className="py-3 rounded-full bg-red-600 text-white font-semibold shadow-lg hover:bg-red-500 transition">
            Register
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <span className="text-red-500 font-semibold cursor-pointer hover:underline">
            Login
          </span>
        </div>
      </motion.div>
    </div>
  );
}
