import logo from "../assets/images/logo.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import ResetPassword from "../components/ResetPassword";
import AuthService from "../utils/authService";

function MainPage() {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [isResetPasswordMode, setIsResetPasswordMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(AuthService.loggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.loggedIn()) {
      setIsLoggedIn(true);
    }
  }, []);



  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dash");
    }
  }, [isLoggedIn, navigate]);
  

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/dash");
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
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
                {isResetPasswordMode ? "Reset Password" : isLoginMode ? "Welcome Back!" : "Create an Account"}
              </h2>
              {isResetPasswordMode ? (
                  <ResetPassword 
                      onCancel={() => setIsResetPasswordMode(false)} 
                      onSuccess={() => { 
                      setIsResetPasswordMode(false);
                      setIsLoginMode(true); 
                       }} 
                    />
              ) : (
                <LoginModal
                  isLoginMode={isLoginMode}
                  onLoginSuccess={handleLoginSuccess}
                  onForgotPassword={() => setIsResetPasswordMode(true)}
                />
              )}

              <p>
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <span className="auth-toggle" onClick={() => setIsLoginMode(!isLoginMode)}>
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
