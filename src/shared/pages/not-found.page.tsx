import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/shared/components/Logo.component";
import notFoundIllustration from "@/assets/svgs/not-found.svg";

function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
        <Link to="/auth" className="flex-shrink-0">
          <Logo />
        </Link>
        <Link
          to="/auth/login"
          className="text-[#6619DE] hover:text-[#5915c7] font-medium text-sm sm:text-base transition-colors duration-300"
        >
          Login or Sign Up Now
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          {/* Large 404 Text */}
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold text-[#6619DE]/20 mb-4 sm:mb-6 lg:mb-8">
            404
          </h1>

          {/* Illustration */}
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mb-6 sm:mb-8 lg:mb-10">
            <img
              src={notFoundIllustration}
              alt="Page not found illustration"
              className="w-full h-auto max-w-[20.625rem] max-h-[20.625rem] mx-auto"
            />
          </div>

          {/* Error Message */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6619DE] mb-4 sm:mb-6">
            Sorry, Page Not Found
          </h2>

          {/* Go Back Button */}
          <Button
            onClick={handleGoBack}
            className="bg-[var(--primary-color)] hover:bg-[#7a3dd9] h-11 sm:h-[2.543rem] md:h-14  text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-medium rounded-lg transition-colors duration-300 shadow-sm"
          >
            Go Back
          </Button>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
