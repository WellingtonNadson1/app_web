/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  skipMiddlewareUrlNormalize: true,
}

module.exports = nextConfig
