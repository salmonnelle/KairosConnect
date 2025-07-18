"use client";

import { motion } from "@/lib/animation";

// Using default export instead of named export
export default function SimpleEventSection() {
  return (
    <div className="py-8">
      <motion.h2 
        className="text-3xl font-bold mb-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Simple Event Section
      </motion.h2>
      <p className="text-center">This is a simplified version of the event section for testing purposes.</p>
    </div>
  );
}
