"use client"

export default function DynamicGradientBackground() {
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base Black Foundation */}
      <div className="absolute inset-0 bg-black" />

      {/* Primary Subtle Gradient Layer */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-black to-blue-900/60 animate-gradient-shift-subtle" />
      </div>

      {/* Secondary Depth Layer */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-purple-800/40 to-blue-800/40 animate-gradient-pulse-subtle" />
      </div>

      {/* Tertiary Ambient Layer */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-900/30 via-black to-purple-900/30 animate-gradient-flow-subtle" />
      </div>

      {/* Refined Ambient Orbs */}
      <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-to-r from-purple-500/8 to-transparent rounded-full blur-3xl animate-float-gentle" />
      <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-gradient-to-l from-blue-500/6 to-transparent rounded-full blur-3xl animate-float-gentle-reverse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/4 to-purple-500/4 rounded-full blur-3xl animate-pulse-gentle" />

      {/* Subtle Texture Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-texture-slide" />
      </div>

      {/* Custom SVG Integration - More Subtle */}
      <div
        className="absolute inset-0 opacity-8 mix-blend-soft-light"
        style={{
          backgroundImage: "url(/kairos-gradient.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Noise Texture for Depth */}
      <div className="absolute inset-0 opacity-3 bg-gradient-to-br from-gray-900 via-transparent to-gray-800" />
    </div>
  )
}
