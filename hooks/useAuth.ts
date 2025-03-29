"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError("");

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      router.refresh();
      return true;
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed");
        return false;
      }

      // Auto login after successful signup
      return await login(userData.email, userData.password);
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    isAuthenticated: !!session?.user,
    isLoading: status === "loading" || loading,
    isBusinessUser: session?.user?.userType === "business",
    isCustomerUser: session?.user?.userType === "customer",
    error,
    login,
    signup,
    logout,
  };
}
