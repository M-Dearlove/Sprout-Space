//ResetPassword.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ResetPasswordProps {
  onCancel: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onCancel }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) throw new Error("Failed to reset password");

      alert("Password reset successful! Please log in.");
      navigate("/login"); //return to login
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleReset} className="reset-password-form">
      <h2>Reset Password</h2>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="button-group">
        <button type="submit" className="btn btn-gray">
          Reset Password
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
