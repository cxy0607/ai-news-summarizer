/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用SWC压缩
  swcMinify: true,
  // 服务器外部包
  serverExternalPackages: [],
  // 图片配置
  images: {
    unoptimized: true,
    domains: [],
  },
  // 允许的开发源
  allowedDevOrigins: ['192.168.184.1'],
}

module.exports = nextConfig