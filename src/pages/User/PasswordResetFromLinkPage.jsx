import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PasswordResetFromLinkPage = () => {
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const emailParam = searchParams.get("email");
  const tokenParam = searchParams.get("token");
  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [disabled, setDisabled] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setStatusMessage("New passwords do not match.");
      return;
    }

    try {
      if (e.nativeEvent.submitter.innerText === "Close") {
        navigate("/login");
        return;
      }
      setDisabled(true);
      await axios.post(
        `${import.meta.env.VITE_UNIDIR_AUTH_SERVER}/forgot-pw-reset`,
        {
          email,
          token,
          tempPassword,
          newPassword,
        }
      );
      setStatusMessage("Password has been reset successfully!");
      setEmail("");
      setTempPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSent(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      setStatusMessage("Failed to reset password. Please try again.");
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
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Your Password
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            readOnly
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Temporary Password</label>
          <input
            type="password"
            value={tempPassword}
            onChange={(e) => setTempPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:cursor-pointer"
        >
          {sent ? "Close" : disabled ? "Processing..." : "Reset Password"}
        </button>

        {statusMessage && (
          <p className="text-center text-sm mt-4">{statusMessage}</p>
        )}
      </form>
    </div>
  );
};

export default PasswordResetFromLinkPage;
