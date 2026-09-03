import { next } from '@vercel/functions';

export const config = {
  matcher: '/:path*',
};

export default function middleware(request) {
  const auth = request.headers.get('authorization');

  if (auth) {
    const [, encoded] = auth.split(' ');
    const [user, pass] = atob(encoded).split(':');

    if (user === process.env.DOCS_USER && pass === process.env.DOCS_PASSWORD) {
      return next();
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="TM Docs"' },
  });
}