/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { "child_process": false }
    // config.externals = { "sharp": "commonjs sharp" }
    return config
  }
}

module.exports = nextConfig
