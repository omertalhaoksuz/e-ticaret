"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, changePassword } from "@/services/auth";

export default function ProfilePage() {
  const { token } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!token) throw new Error("User not authenticated");

      await updateProfile({ fullName, phone }, token);
      setSuccessMsg("Profile updated successfully.");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (!token) throw new Error("User not authenticated");

      if (password.new !== password.confirm) {
        throw new Error("Passwords do not match");
      }

      await changePassword({ currentPassword: password.current, newPassword: password.new }, token);
      setSuccessMsg("Password changed successfully.");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMsg}</div>
      )}

      {/* Profile Update Section */}
      <form onSubmit={handleProfileSubmit}>
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <label className="block mb-2" htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2" htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded mb-6"
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {/* Password Change Section */}
      <form onSubmit={handlePasswordSubmit} className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <label className="block mb-2" htmlFor="currentPassword">Current Password</label>
        <input
          id="currentPassword"
          type="password"
          value={password.current}
          onChange={(e) => setPassword({ ...password, current: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2" htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          value={password.new}
          onChange={(e) => setPassword({ ...password, new: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2" htmlFor="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={password.confirm}
          onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
          className="w-full p-2 border rounded mb-6"
        />

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50">
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
