/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/video", destination: "/tu-van", permanent: false },
      { source: "/food-guide", destination: "/tu-van", permanent: false },
    ];
  },
};
export default nextConfig;
