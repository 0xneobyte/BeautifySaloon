import Navbar from "../components/Navbar";
import Link from "next/link";

export default function SignupChoice() {
  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-pink-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Create your account
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose how you want to use Beautify. You can always switch between
              modes later.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Option */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">I'm a Customer</h2>
                <p className="text-gray-600 mb-6">
                  Looking for beauty services? Sign up to book appointments,
                  review salons, and track your favorites.
                </p>
                <Link
                  href="/signup/customer"
                  className="block w-full text-center py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign up as Customer
                </Link>
              </div>
            </div>

            {/* Business Option */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden group">
              <div className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  I'm a Business Owner
                </h2>
                <p className="text-gray-600 mb-6">
                  Own a salon or beauty business? Join Beautify to manage your
                  business, grow your client base, and increase bookings.
                </p>
                <Link
                  href="/signup/business"
                  className="block w-full text-center py-3 px-4 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-colors font-medium"
                >
                  Sign up as Business
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-pink-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
