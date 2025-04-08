import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER, REGISTER_USER } from "../graphQL/mutations";
import AuthService from "../utils/authService";
import "../styles/LoginModal.css";

interface LoginModalProps {
  isLoginMode: boolean;
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isLoginMode,
  onLoginSuccess,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState(""); 
  const [lastname, setLastname] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");

// Clear input fields when toggling login/register mode
useEffect(() => {
      setEmail("");
      setPassword("");
      setFirstname("");
      setLastname("");
      setErrorMessage("");
}, [isLoginMode]);

  // GraphQL mutations for login and register
  const [login] = useMutation(LOGIN_USER);
  const [register] = useMutation(REGISTER_USER);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      let response;
      if (isLoginMode) {
        response = await login({
          variables: { email, password },
        });
      } else {
         response = await register({
          variables: { firstname, lastname, email, password },
        });
      }

      if (response.data) {
        const token = isLoginMode
          ? response.data.login.token
          : response.data.register.token;
        AuthService.login(token);
        setEmail(""); // Reset fields 
        setPassword("");
        setFirstname(""); 
        setLastname(""); 
        onLoginSuccess();
      } else {
        alert("Authentication failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      //get error message from GtapfQL error
      const errorMsg = err instanceof Error ? err.message : 
      typeof err === 'object' && err !== null && 'message' in err ? 
      (err as {message: string}).message : "An unknown error occurred";

      if (isLoginMode) {
        if (errorMsg.includes("Invalid credentials")) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage("Login failed. Please check your credentials and try again.");
        }
      } else {
        if (errorMsg.includes("User already exists")) {
          setErrorMessage("This email is already registered. Please use a different email or try logging in.");
        } else {
          setErrorMessage("Registration failed. Please check your information and try again.");
        }
      }
    }
  };

  return (

    <form onSubmit={handleSubmit} className="login-form">
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      <div className="emailEntry">
        <label>Email:</label>
        <input
          type="email"
          className="form-control-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="passwordEntry">
        <label>Password:</label>
        <input
          type="password"
          className="form-control-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {!isLoginMode && (
        <>
          <div className="nameEntry">
            <label>First Name:</label>
            <input
              type="text"
              className="form-control-3"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </div>
          <div className="nameEntry">
            <label>Last Name:</label>
            <input
              type="text"
              className="form-control-3"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
        </>
      )}
      <button type="submit" className="submit">
        {isLoginMode ? "Sign In" : "Sign Up"}
      </button>
      {isLoginMode && (
        <p>
          <a href="#" onClick={onForgotPassword}>
            Forgot Password?
          </a>
        </p>
      )}
    </form>
  );
};

export default LoginModal;
