import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Header from "../home/homeComponents/Header";
import Footer from "../home/homeComponents/Footer";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  // --- UI for 404 Not Found Error ---
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <>
      <Header/>
 
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <div className="flex flex-col items-center">
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-blue-600">
            404
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
            Page Not Found
          </p>
          <p className="text-gray-600 mt-2 max-w-md">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Homepage
          </Link>
        </div>
      </div>
      <Footer/>
           </>
    );
  }

  // --- Fallback UI for any other error ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-6">
          {error?.statusText || error?.message || "An unexpected error occurred."}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-black transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}