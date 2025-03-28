import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function BusinessSignup() {
  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-pink-50 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              Sign Up with Beautify as A Business Owner!
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Join Us & level up your business with us!
            </p>

            <form className="space-y-4">
              {/* Personal Information */}
              <div>
                <input
                  type="text"
                  placeholder="Business Owner's First name"
                  className="input-field"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Business Owner's Last name"
                  className="input-field"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="input-field"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-[2]">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +94-
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter Mobile Number"
                      className="input-field rounded-l-none"
                    />
                  </div>
                </div>
                <div className="flex-[2]">
                  <input
                    type="text"
                    placeholder="YYYY/MM/DD"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <select className="input-field">
                  <option value="">Select District</option>
                  <option value="colombo">Colombo</option>
                  <option value="gampaha">Gampaha</option>
                  <option value="kalutara">Kalutara</option>
                  {/* Add more districts */}
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Enter Address"
                  className="input-field"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Enter Postal Code"
                  className="input-field"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-center text-pink-500 mb-4">
                  Set Password!
                </h3>
                <input
                  type="password"
                  placeholder="Password"
                  className="input-field mb-4"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input-field"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Create Account
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
