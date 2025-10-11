
import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h1 className="text-5xl font-extrabold mb-6">Get in Touch</h1>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Have questions or need assistance? Our team at CarMazik is here to help. Fill out the form and we’ll get back to you as soon as possible.
          </p>
          <div className="space-y-4 text-gray-300">
            <p><span className="font-semibold">Email:</span> support@carmazik.com</p>
            <p><span className="font-semibold">Phone:</span> +91 12345 67890</p>
            <p><span className="font-semibold">Address:</span> 123 CarMazik Street, Mumbai, India</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <form className="bg-white/5 p-8 rounded-3xl shadow-lg backdrop-blur-sm flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-600 transition" 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-600 transition" 
            />
            <textarea 
              placeholder="Your Message" 
              rows={5} 
              className="p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-600 transition" 
            />
            <button className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold shadow-lg hover:bg-red-500 transition">
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
