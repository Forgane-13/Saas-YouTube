import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.ytimg.com', 'yt3.ggpht.com'], // Autoriser les images de YouTube
  },
  async headers() {
    return [
      {
        // Appliquer ces en-têtes à toutes les routes
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://www.googleapis.com https://api.anthropic.com; img-src 'self' data: https://i.ytimg.com https://yt3.ggpht.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
