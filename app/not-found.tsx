import Link from "next/link";
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
            <h1 className="text-7xl font-extrabold text-gray-800 select-none">
                404
            </h1>
            <h2 className="text-2xl font-semibold mt-4 text-gray-700">
                The page you're looking for doesn't exist.
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
                It seems you may have taken a wrong turn, or this link has changed.
            </p>
            <Link
                href="/"
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
                ⬅️ Back to home
            </Link>
        </div>
    );
}
