/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
  },
  // Add transpile modules to fix potential tailwind issues
  transpilePackages: ["tailwindcss"],
};

module.exports = nextConfig;
