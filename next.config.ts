/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "via.placeholder.com",
      "picsum.photos",
      "example.com",
      "pixabay.com",
      "img.cdnx.in" // ✅ Add this line
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.example.com",
      },
      {
        protocol: "https",
        hostname: "pixabay.com",
      },
      {
        protocol: "https",
        hostname: "img.cdnx.in",
      },
    ],
  },
};

export default nextConfig;
