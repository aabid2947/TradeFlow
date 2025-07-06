// src/pages/ErrorPage.jsx
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-[#1A89C1] text-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-3">💿 Oops!</h1>
        <p className="text-lg mb-2">Something went wrong.</p>
        <p className="text-sm opacity-90 mb-6">
          {error?.statusText || error?.message || "Unexpected application error."}
        </p>
        <a
          href="/"
          className="inline-block bg-white text-[#1A89C1] font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
