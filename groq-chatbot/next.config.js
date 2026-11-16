// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude paket Node.js-only dari Edge runtime bundle (middleware)
  // Mencegah error "proxy.js not found" saat Turbopack mem-bundle mysql2/bcryptjs
  serverExternalPackages: ["mysql2", "bcryptjs", "nodemailer"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;