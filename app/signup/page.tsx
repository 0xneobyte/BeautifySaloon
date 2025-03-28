import Navbar from "../components/Navbar";
import Link from "next/link";

export default function SignupChoice() {
  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-pink-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              You are signing up as a,
            </h1>

            <div className="space-y-4 mt-8">
              <Link
                href="/signup/business"
                className="block w-full text-center py-3 px-4 rounded-lg border-2 border-pink-500 text-pink-500 hover:bg-pink-50 transition-colors"
              >
                Business Owner
              </Link>

              <Link
                href="/signup/customer"
                className="block w-full text-center py-3 px-4 rounded-lg bg-white border-2 border-pink-500 text-pink-500 hover:bg-pink-50 transition-colors"
              >
                Customer
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already a member?{" "}
                <Link href="/login" className="text-pink-500 hover:underline">
                  Login!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
