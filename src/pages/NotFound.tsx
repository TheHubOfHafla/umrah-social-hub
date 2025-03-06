
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import Button from "@/components/Button";
import { Home } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm px-4">
      <Container size="sm">
        <div className="text-center bg-white/90 p-8 rounded-lg shadow-medium max-w-md w-full glass">
          <h1 className="text-6xl font-bold mb-6 text-primary">404</h1>
          <p className="text-xl text-gray-700 mb-6 font-medium">Page not found</p>
          <p className="text-gray-600 mb-8">The page you are looking for might have been removed or is temporarily unavailable.</p>
          <Button 
            onClick={handleNavigateHome}
            variant="primary"
            size="lg" 
            fullWidth
            rounded
            withShadow
            icon={<Home />}
          >
            Return to Home
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
