/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*', // تغییر از /api/:path* به /api/v1/:path*
        destination: 'http://localhost:5000/api/v1/:path*',
      },
    ];
  },
  
  // CSP تنظیمات (اختیاری - می‌توانید نگه دارید یا حذف کنید)
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'production'
              ? "default-src 'self'; connect-src 'self' https: wss:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
              : "default-src * 'unsafe-inline' 'unsafe-eval' http: ws: data: blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
