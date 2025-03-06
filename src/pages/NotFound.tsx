
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigateHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
        <p className="text-lg text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-sm text-gray-500 mb-6">The page you are looking for might have been removed or is temporarily unavailable.</p>
        <button 
          onClick={handleNavigateHome}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors w-full"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
