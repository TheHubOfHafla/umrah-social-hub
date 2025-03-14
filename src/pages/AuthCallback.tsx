
import { Navigate } from "react-router-dom";

const AuthCallback = () => {
  // This component is not used anymore as the route has been removed
  // Redirect to homepage if somehow accessed
  return <Navigate to="/" replace />;
};

export default AuthCallback;
