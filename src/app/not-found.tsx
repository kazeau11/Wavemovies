import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-gradient text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg text-wave-muted">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 font-semibold text-white transition-all hover:brightness-110"
      >
        Back to Home
      </Link>
    </div>
  );
}
