import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Login() {
  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-pink-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              Welcome Back to Beautify!
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Sign in to continue your beauty journey
            </p>

            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="input-field"
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="input-field"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-pink-500 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="btn-primary w-full">
                Login
              </button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link href="/signup" className="text-pink-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
