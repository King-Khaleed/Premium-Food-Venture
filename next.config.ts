
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
          protocol: 'https',
          hostname: '*.supabase.co',
          port: '',
          pathname: '/**', // Allow any path within the Supabase storage
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/products',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
