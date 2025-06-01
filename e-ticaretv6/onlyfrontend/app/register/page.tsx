"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register as registerUser } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto max-w-md p-8">
      <h2 className="text-2xl mb-6 font-bold">Create Account</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        required
        value={formData.fullName}
        onChange={handleChange}
        className="mb-4 w-full border rounded px-3 py-2"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        value={formData.email}
        onChange={handleChange}
        className="mb-4 w-full border rounded px-3 py-2"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        value={formData.password}
        onChange={handleChange}
        className="mb-4 w-full border rounded px-3 py-2"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        required
        value={formData.confirmPassword}
        onChange={handleChange}
        className="mb-6 w-full border rounded px-3 py-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Register"}
      </button>
    </form>
  );
}
