//LoginModal.tsx
import { login } from "../api/authAPI";
import React,  { useState } from "react";

interface LoginModalProps {
  isLoginMode: boolean;
  onLoginSuccess: ()=> void; //callback for a successful login
  onForgotPassword: ()=> void; //callback for forgot password
}

const LoginModal: React.FC<LoginModalProps> = ({ isLoginMode, onLoginSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  
  const handleLoginOrRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        // Use login function from authAPI.tsx
        const data = await login({email, password});
         if (data && data.token) {
          localStorage.setItem("token", data.token);
          console.log('HANDLE LOGIN SUCCESS')
          onLoginSuccess(); //Navigate to the dahsboard page
          setEmail(""); //clear the input fields
          setPassword("");
        } else {
          alert("Login failed");
        }
      } else {
        // Handle user registration
        const response = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Registration failed");
        }

        alert("Registration successful! Logging you in...");
        setEmail(""); //clear the input fields
        setPassword("");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLoginOrRegister}>
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
        {isLoginMode ? "Sign In" : "Submit" }
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
