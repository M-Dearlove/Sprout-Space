import logo from "../assets/images/logo.png";
import { useState, useEffect } from "react";
import ResetPassword from "../components/ResetPassword";
import AuthService from "../utils/authService";
import LoginModal from "../components/LoginModal";
import "../styles/MainPage.css";
import heading from "../assets/images/heading.png";

function MainPage() {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [isResetPasswordMode, setIsResetPasswordMode] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(AuthService.loggedIn());


  useEffect(() => {
    if (AuthService.loggedIn()) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    console.log(isLoggedIn);
  };

  return (
    <main className="main-container">
      <div className="top-image">
        <img src={heading} alt="Woman Gardening" className="heading" />
      </div>
      <div className="content-container">
        <div className="left-side">
          <div className="text-container">
            <h1>What is Sprout Space?</h1>
            <div className="about-text">
              <p>Sprout Space is your ultimate gardening companion, designed to simplify garden planning using the popular square foot gardening method. By dividing your garden into easy-to-manage 1-foot squares, you can easily plant vegetables, fruits, and herbs based on their ideal spacing needs. With a rich plant database, personalized planting instructions, harvest timelines, and more, Sprout Space helps you grow a thriving garden with ease.</p>
              <p>Our app also comes with a powerful pest search tool, giving you quick access to valuable pest information, helping you identify and manage threats to your garden. Keep track of your garden’s progress, save multiple layouts, and stay organized every step of the way. Whether you’re just starting out or have years of gardening experience, Sprout Space makes gardening more efficient, fun, and resilient. Start planning today and watch your garden grow!</p>
            </div>
          </div>
        </div>
        <div className="right-side">
          <img src={logo} alt="logo" className="logo" />
          <div className="login-container">
            {/*Hide form when logged in */}
            {isLoggedIn ? (
            <div>
              <h2>You are logged in.</h2>
              <p>Enjoy digging into your next garden design!</p>
            </div>
            ):(
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
      </div>
    </main>
  );
}

export default MainPage;
