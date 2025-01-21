/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/uno',
        destination: '/games/uno', // Maps /uno to /games/uno
      },
      {
        source: '/uno/game',
        destination: '/games/uno', // game without a gameId is not a page, so redirect to uno home
      },
      {
        source: '/uno/game/:gameId',
        destination: '/games/uno/game/:gameId', // Maps /uno/game/:gameId to /games/uno/game/:gameId
      },
      {
        source: '/uno/quick',
        destination: '/games/uno/quick', // Maps /uno/quick to /games/uno/quick
      },
      {
        source: '/babylon',
        destination: '/games/babylon', // Maps /babylon to /games/babylon
      }
      // You can add additional rewrites here as needed
    ];
  },
};

export default nextConfig;
