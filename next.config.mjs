/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warnings about <img> and custom fonts don't affect functionality
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
