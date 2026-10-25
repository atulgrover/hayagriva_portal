/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/dashboard/my-assets',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/dashboard/community',
        destination: '/dashboard/discussions',
        permanent: false,
      },
      {
        source: '/dashboard/community-agents',
        destination: '/dashboard/agents',
        permanent: false,
      },
      {
        source: '/admin/community',
        destination: '/admin/discussions',
        permanent: false,
      },
      {
        source: '/admin/invoices',
        destination: '/admin/billing',
        permanent: false,
      },
      {
        source: '/admin/downloads',
        destination: '/admin/telemetry',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
