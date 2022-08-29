import { Navigate } from "react-router-dom";

function ProtecedRoute({  loggedIn, children }) {
  return loggedIn ? children : <Navigate to="/sign-in" />;
}
export default ProtecedRoute;
