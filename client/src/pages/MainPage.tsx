import logo from "../assets/images/Logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import ResetPassword from "../components/ResetPassword";
import AuthService from "../utils/authService"; // Import AuthService to check token

function MainPage () {
  //toggle between registration and login form in same modal
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  // State for reset password form visibility
  const [isResetPasswordMode, setIsResetPasswordMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(AuthService.loggedIn()); // Track login status
  const navigate = useNavigate() as (path:string) => void;  //to navigate to the dashboard upon login

  useEffect(() => {
    if (AuthService.loggedIn()) {
      setIsLoggedIn(true);
    }
  }, []);


  useEffect(() => {

    // If the user is already logged in, redirect to the dashboard
    if (AuthService.loggedIn()) {
      console.log('Already logged in')
      navigate("/dash");

    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    // After a successful login, navigate to the dashboard
    console.log('Change to the Dash Page')
    setIsLoggedIn(true); // Show logout button instead of navigating away
    navigate("/dash");
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    console.log("User logged out");
  };


  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
  };

  const handleForgotPasswordClick = () => {
    setIsLoginMode(false); // Switch to register mode (if needed)
    setIsResetPasswordMode(true); // Show the reset password form
  };


  return (
    <main className="main-container">
      <div className="left-side">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="right-side">
        <div className="login-container">
          {isLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <h2>
                {isResetPasswordMode
                  ? "Reset Password"
                  : isLoginMode
                  ? "Welcome Back!"
                  : "Create an Account"}
              </h2>

              {isResetPasswordMode ? (
                <ResetPassword onCancel={() => setIsResetPasswordMode(false)} />
              ) : (
                <LoginModal
                  isLoginMode={isLoginMode}
                  onLoginSuccess={handleLoginSuccess}
                  onForgotPassword={handleForgotPasswordClick}
                />
              )}

              <p>
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <span className="auth-toggle" onClick={toggleMode}>
                  {isLoginMode ? "Register Here" : "Login Here"}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default MainPage;