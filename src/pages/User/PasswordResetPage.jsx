import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const generateRandomPassword = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const PasswordResetPage = () => {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [useRandomPassword, setUseRandomPassword] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!useRandomPassword && tempPassword !== confirmPassword) {
      setStatusMessage("Passwords do not match.");
      return;
    }

    const password = useRandomPassword
      ? generateRandomPassword()
      : tempPassword;

    try {
      if (e.nativeEvent.submitter.innerText === "Close") {
        navigate("/login");
        return;
      }
      setDisabled(true);
      await axios.post(`${import.meta.env.VITE_UNIDIR_AUTH_SERVER}/forgot-pw`, {
        email,
        password,
      });
      setStatusMessage("Reset link and password have been sent successfully!");
      setEmail("");
      setTempPassword("");
      setConfirmPassword("");
      setSent(true);
    } catch (error) {
      console.error("Error sending reset link:", error);
      setStatusMessage("Failed to send reset link. Please try again.");
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:text-slate-500 dark:bg-slate-700/50 ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Password Reset</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">User Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={useRandomPassword}
              onChange={() => setUseRandomPassword(!useRandomPassword)}
              className="form-checkbox"
            />
            <span className="ml-2">Use random password</span>
          </label>
        </div>

        {!useRandomPassword && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Manual Temp Password
              </label>
              <input
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Confirm Temp Password
              </label>
              <input
                type="text"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full ${
            disabled
              ? "bg-gray-500"
              : "bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer"
          } text-white font-bold py-2 px-4 rounded`}
          disabled={disabled}
        >
          {sent ? "Close" : disabled ? "Processing..." : "Send Reset Link"}
        </button>

        {statusMessage && (
          <p className="text-center text-sm mt-4">{statusMessage}</p>
        )}
      </form>
    </div>
  );
};

export default PasswordResetPage;
