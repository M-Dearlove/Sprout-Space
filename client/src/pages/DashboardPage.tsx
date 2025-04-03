import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/authService";


function DashboardPage() {

  //Temporary code to test login
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to main page
    if (!AuthService.loggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate("/"); // Redirect to main page after logout
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard</h1>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
  