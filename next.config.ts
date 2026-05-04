import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // Gift cards temporarily disabled pending owner approval. 307 (permanent: false)
      // signals "may come back" — preserves SEO equity if/when /gift is restored.
      { source: '/gift', destination: '/', permanent: false },
      { source: '/gift/:path*', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
