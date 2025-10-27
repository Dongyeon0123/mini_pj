/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // styled-components 최적화
    styledComponents: true,
  },
  // 이미지 최적화 비활성화 (메모리 절약)
  images: {
    unoptimized: true
  },
}

module.exports = nextConfig
