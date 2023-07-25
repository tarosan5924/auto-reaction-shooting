/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.GITHUB_PAGES ? "/auto-reaction-shooting" : "",
};

module.exports = nextConfig;
