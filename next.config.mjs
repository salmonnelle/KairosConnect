/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://zbbdqsdvykuksganpjaw.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiYmRxc2R2eWt1a3NnYW5wamF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Mjk5NDAsImV4cCI6MjA2NjQwNTk0MH0.UbEEECO8JdTKxrHj-8DvUuc4kYl6thmPmNCAwKciFoc',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent client bundle from trying to polyfill server-only modules
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ws: false,
      }
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
