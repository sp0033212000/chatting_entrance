/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/rewrite/chatting-api/:path*",
        destination: `${process.env.CHATTING_API_URL}/:path*`,
        locale: false,
      },
    ];
  },
  env: {
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    CHATTING_API_URL: process.env.CHATTING_API_URL,
    ENTRANCE_WEB_DOMAIN: process.env.ENTRANCE_WEB_DOMAIN,
  },
};

module.exports = nextConfig;
