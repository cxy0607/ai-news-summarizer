/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // 确保静态资源正确加载
  trailingSlash: false,
  // 优化图片加载
  images: {
    unoptimized: true, // Vercel会自动优化
    domains: [],
  },
  // 启用SWC压缩
  swcMinify: true,
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig