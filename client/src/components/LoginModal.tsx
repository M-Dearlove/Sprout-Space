import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER, REGISTER_USER } from "../graphQL/mutations";
import AuthService from "../utils/authService";

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

// Clear input fields when toggling login/register mode
useEffect(() => {
      setEmail("");
      setPassword("");
}, [isLoginMode]);

  // GraphQL mutations for login and register
  const [login] = useMutation(LOGIN_USER);
  const [register] = useMutation(REGISTER_USER);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      let response;
      if (isLoginMode) {
        response = await login({
          variables: { email, password },
        });
      } else {
        console.log("Register credentials:");
        console.log(email, password);
        response = await register({
          variables: { email, password },
        });
      }

      if (response.data) {
        const token = isLoginMode
          ? response.data.login.token
          : response.data.register.token;
        AuthService.login(token);
        setEmail(""); // Reset fields before navigating
        setPassword("");
        onLoginSuccess();
      } else {
        alert("Authentication failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-gray">
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
