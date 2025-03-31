import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-pink-400 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 lg:py-16 items-center">
            <div className="text-white max-w-xl">
              <h1 className="text-6xl font-bold mb-6 leading-tight">
                Welcome to Beautify!
              </h1>
              <p className="text-2xl mb-8">
                Your one-stop platform for all beauty services
              </p>

              {/* Search Form */}
              <div className="bg-white p-8 rounded-3xl shadow-lg">
                <h2 className="text-pink-600 text-xl font-semibold mb-6">
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
                      className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
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
                        className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
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
                        className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-800"
                      />
                    </div>
                  </div>

                  <Link
                    href="/search"
                    className="bg-pink-600 text-white text-center w-full block py-3 px-6 rounded-full font-medium hover:bg-pink-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Search
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full h-full flex justify-end items-end">
              <img
                src="/images/hero-woman.png"
                alt="Beautiful hairstyle"
                className="w-[80%] h-[500px] object-cover rounded-tl-3xl"
                style={{ objectPosition: "right bottom" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Beautify Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What is Beautify?
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Beautify is a comprehensive platform connecting beauty seekers
              with top-rated beauty salons and professionals. We make it easy to
              discover, book, and experience a wide range of beauty services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
            <div className="bg-pink-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Discover Services
              </h3>
              <p className="text-gray-600">
                Browse through our extensive catalog of beauty services - from
                hair styling to nail care and face & body treatments.
              </p>
            </div>

            <div className="bg-pink-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Easy Booking
              </h3>
              <p className="text-gray-600">
                Book appointments with your favorite salons in just a few
                clicks, choosing from available time slots that suit your
                schedule.
              </p>
            </div>

            <div className="bg-pink-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                For Businesses
              </h3>
              <p className="text-gray-600">
                Beauty salons can join our platform to showcase their services,
                manage bookings, and grow their customer base.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/sign-up"
              className="bg-pink-600 text-white px-8 py-3 rounded-full font-medium hover:bg-pink-700 transition-colors shadow-md inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center mb-12">
            What we offer to our customers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">
                Online Booking System
              </h3>
              <p className="text-gray-600 text-center mt-2">
                Customers can quickly find and book appointments with various
                businesses
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">
                Calendar Scheduling System
              </h3>
              <p className="text-gray-600 text-center mt-2">
                Our calendar system makes scheduling easy! View real-time
                availability
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-center">
                Appointment Alert
              </h3>
              <p className="text-gray-600 text-center mt-2">
                Effortless scheduling with real-time availability and
                appointment alerts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Where we Located?
          </h2>
          <h3 className="text-xl text-center mb-12">
            Find Us in These Popular Cities
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {["Colombo", "Kaluthra", "Gampaha", "Galle", "Kandy", "Matara"].map(
              (city) => (
                <div key={city} className="text-center">
                  <h4 className="font-semibold text-gray-900">{city}</h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>City Center</li>
                    <li>Suburbs</li>
                    <li>Downtown</li>
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
