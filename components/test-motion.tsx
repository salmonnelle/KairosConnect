"use client";

// Import motion from our custom animation utility
import { motion } from "@/lib/animation";

// Import EventSearchSection to test integration
import { EventSearchSection } from "@/components/event-search-section";

export default function TestMotion() {
  return (
    <div className="space-y-8">
      {/* Test motion component */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-blue-100 p-4 rounded-md"
      >
        <motion.h2 className="text-xl font-bold mb-2">Test Motion Component</motion.h2>
        <motion.p>This is a simple test of our custom motion components.</motion.p>
      </motion.div>
      
      {/* EventSearchSection component */}
      <div className="mt-8">
        <EventSearchSection />
      </div>
    </div>
  );
}
