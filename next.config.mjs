/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://dcafwtbvminkdcwurdrl.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjYWZ3dGJ2bWlua2Rjd3VyZHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU2MTIsImV4cCI6MjA2NzY4MTYxMn0.3g2OGjMKwGZ42DX3CV3hx2y4W45RKMbw0-k3znzXWK4',
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
