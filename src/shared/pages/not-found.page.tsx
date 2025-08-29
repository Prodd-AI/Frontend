import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="mb-2 text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-gray-600">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block text-blue-500 hover:underline hover:text-blue-600 transition-colors duration-300 *:hover"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
