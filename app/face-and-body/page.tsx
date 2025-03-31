import Navbar from "../components/Navbar";
import SalonSearchForm from "../components/SalonSearchForm";
import Link from "next/link";
import Image from "next/image";

export default function FaceAndBody() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section with Search Form */}
      <section className="bg-amber-500 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 lg:py-16 items-center">
            <div className="text-white max-w-xl">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                Find The Best Place For Your Face And The Body
              </h1>
              <p className="text-2xl mb-8">
                Explore, Choose, and Transform – Your Ideal Look Awaits!
              </p>

              {/* Search Form */}
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <h2 className="text-amber-600 text-xl font-semibold mb-6">
                  Search and Find The Best Solution For Your need
                </h2>

                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search by Saloon Name"
                      className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Search by location"
                        className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800"
                      />
                    </div>

                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Search by Postcode"
                        className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800"
                      />
                    </div>
                  </div>

                  <Link
                    href="/search?category=face-and-body"
                    className="bg-amber-600 text-white text-center w-full block py-3 px-6 rounded-full font-medium hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Search
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full h-full flex justify-end items-end">
              <img
                src="/images/hero-face.jpg"
                alt="Face and body treatments"
                className="w-[80%] h-[500px] object-cover rounded-tl-3xl"
                style={{ objectPosition: "right bottom" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Face & Body Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Indulge in our wide range of face and body treatments designed for
              your relaxation and well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Facials
              </h3>
              <p className="text-gray-600">
                Rejuvenating facial treatments for all skin types and concerns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Massages
              </h3>
              <p className="text-gray-600">
                From relaxing to therapeutic, our massages will ease your stress
                and tension.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Body Treatments
              </h3>
              <p className="text-gray-600">
                Revitalize your body with our specialized treatments and wraps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="bg-amber-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Popular Cities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find face and body treatment salons in these popular locations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/search?city=London&category=face-and-body"
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-amber-500">London</h3>
              <p className="text-gray-600 text-sm">86 Salons</p>
            </Link>

            <Link
              href="/search?city=Manchester&category=face-and-body"
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-amber-500">
                Manchester
              </h3>
              <p className="text-gray-600 text-sm">54 Salons</p>
            </Link>

            <Link
              href="/search?city=Birmingham&category=face-and-body"
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-amber-500">
                Birmingham
              </h3>
              <p className="text-gray-600 text-sm">39 Salons</p>
            </Link>

            <Link
              href="/search?city=Edinburgh&category=face-and-body"
              className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-amber-500">
                Edinburgh
              </h3>
              <p className="text-gray-600 text-sm">27 Salons</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
