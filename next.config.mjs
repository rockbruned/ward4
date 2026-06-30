/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "map.oshawa.ca",
        pathname: "/arcgis/rest/services/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|images/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
