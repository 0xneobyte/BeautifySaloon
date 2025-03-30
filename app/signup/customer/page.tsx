"use client";

import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Male",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const { signup, error, isLoading } = useAuth();
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear password error when either password field changes
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Call signup with user data
    const success = await signup({
      ...formData,
      userType: "customer",
    });

    if (success) {
      // After successful signup, redirect to home
      router.push("/");
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-pink-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              Sign Up with Beautify!
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Join Us & Book Your Beauty Experience!
            </p>

            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter First name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter Last name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email Address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <select
                    name="gender"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex-[2]">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +94-
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter Mobile Number"
                      className="w-full px-4 py-2 rounded-r-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Enter Address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-center text-pink-500 mb-4">
                  Set Password!
                </h3>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500 mb-4"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none ${
                    passwordError
                      ? "border-red-500"
                      : "border-gray-300 focus:border-pink-500"
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Already a member?{" "}
                <Link href="/login" className="text-pink-500 hover:underline">
                  Login!
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
