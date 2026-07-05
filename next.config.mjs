import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public', // Where the service worker will be generated
  disable: process.env.NODE_ENV === 'development', // Disable in dev mode for easier debugging
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPWA(nextConfig);