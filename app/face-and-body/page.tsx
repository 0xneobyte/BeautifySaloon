import Navbar from "../components/Navbar";
import SalonSearchForm from "../components/SalonSearchForm";
import Link from "next/link";

export default function FaceAndBody() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Search Form */}
      <section className="relative bg-pink-50 py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Find Face & Body Treatments
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover top-rated spas and salons for facials, massages,
              skincare, and other beauty treatments.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <SalonSearchForm
              category="face-body"
              buttonText="Find Face & Body Salons"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Relax and rejuvenate with our range of face and body treatments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Facials
              </h3>
              <p className="text-gray-600">
                Rejuvenating facials to cleanse, exfoliate, and nourish your
                skin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Massages
              </h3>
              <p className="text-gray-600">
                Relaxing massages to relieve tension and promote overall
                wellness.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Skin Treatments
              </h3>
              <p className="text-gray-600">
                Advanced skin treatments to address specific concerns and
                enhance your natural beauty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="bg-pink-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Popular Cities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find face and body treatments in these top locations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/search?city=London&category=face-body"
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-pink-500">London</h3>
              <p className="text-gray-600 text-sm">85 Spas & Salons</p>
            </Link>

            <Link
              href="/search?city=Manchester&category=face-body"
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-pink-500">
                Manchester
              </h3>
              <p className="text-gray-600 text-sm">49 Spas & Salons</p>
            </Link>

            <Link
              href="/search?city=Birmingham&category=face-body"
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-pink-500">
                Birmingham
              </h3>
              <p className="text-gray-600 text-sm">38 Spas & Salons</p>
            </Link>

            <Link
              href="/search?city=Edinburgh&category=face-body"
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-pink-500">Edinburgh</h3>
              <p className="text-gray-600 text-sm">31 Spas & Salons</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
