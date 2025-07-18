"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "@/lib/animation";

interface Sparkle {
  id: string
  x: number
  y: number
  size: number
  opacity: number
  duration: number
}

export default function SparkleAnimation() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const sparkleIdCounter = useRef(0)
  
  // Create a new sparkle at random position with a unique ID
  const createSparkle = () => {
    const id = `sparkle-${sparkleIdCounter.current++}-${Math.random().toString(36).substring(2, 9)}`
    const x = Math.random() * 100 // percentage of viewport width
    const y = Math.random() * 100 // percentage of viewport height
    const size = Math.random() * 4 + 1 // between 1-5px
    const opacity = Math.random() * 0.5 + 0.3 // between 0.3-0.8
    const duration = Math.random() * 1 + 1 // between 1-2 seconds
    
    return { id, x, y, size, opacity, duration }
  }
  
  useEffect(() => {
    // Initial sparkles
    const initialSparkles = Array.from({ length: 10 }, createSparkle)
    setSparkles(initialSparkles)
    
    // Add new sparkles periodically
    const interval = setInterval(() => {
      setSparkles(prev => {
        // Remove some old sparkles if there are too many
        if (prev.length > 30) {
          return [...prev.slice(-20), createSparkle()]
        }
        return [...prev, createSparkle()]
      })
    }, 800)
    
    // Clean up
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <motion.div
            key={sparkle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: sparkle.opacity, 
              scale: 1,
              x: `${sparkle.x}vw`,
              y: `${sparkle.y}vh`,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: sparkle.duration }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: sparkle.size,
              height: sparkle.size,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffffff, #8b5cf6)',
              boxShadow: '0 0 8px 2px rgba(139, 92, 246, 0.3)',
            }}
            className="sparkle"
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
