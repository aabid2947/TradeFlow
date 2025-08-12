import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "../home/homeComponents/Header";
import Footer from "../home/homeComponents/Footer";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] bg-gray-50 px-4 text-center">
        <h1 className="text-[8rem] md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-blue-600 leading-none">
          404
        </h1>
        <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
          Page Not Found
        </p>
        <p className="text-gray-600 mt-2 max-w-md">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to Homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
