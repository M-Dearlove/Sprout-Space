//ResetPassword.tsx
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../graphQL/mutations";


interface ResetPasswordProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onCancel, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
 

  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await resetPassword({
        variables: { email, newPassword },
      });

      if (data?.resetPassword) {
        alert("Password reset successful! Please log in.");
        setEmail("")
        onSuccess(); //switch to login form
      } else {
        alert("Failed to reset password.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    setEmail(""); // Clear input fields
    setNewPassword("");
    onCancel();
  };

  return (
    <form onSubmit={handleReset} className="reset-password-form">
      {/* <h2>Reset Password</h2> */}
      {error && <p className="error-message">Error: {error.message}</p>}
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
        <button type="submit" className="btn btn-gray" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
