import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-[#0F172A]">404</h1>
        <p className="mt-2 text-slate-600">Page not found.</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-white font-bold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

