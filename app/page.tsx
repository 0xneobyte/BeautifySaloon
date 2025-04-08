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

      {/* Recommended Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-semibold">
              Recommended For <span className="text-pink-600">You</span>
            </h2>
            <Link
              href="/recommended"
              className="text-pink-600 hover:text-pink-700 font-medium flex items-center"
            >
              View All
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hair Styling */}
            <Link href="/hair-styles" className="group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600 opacity-90 z-10"></div>
                <Image
                  src="/images/hair.jpg"
                  alt="Hair Styling"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Hair Styling</h3>
                  <p className="mb-4 opacity-90">
                    Discover the latest hair trends and expert stylists to
                    transform your look
                  </p>
                  <div className="bg-white bg-opacity-30 p-2 rounded-lg backdrop-blur-sm inline-flex items-center justify-center">
                    <span className="text-white font-medium">
                      Explore Services
                    </span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Nails */}
            <Link href="/nails" className="group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-90 z-10"></div>
                <Image
                  src="/images/nails.jpg"
                  alt="Nail Care"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Nail Care</h3>
                  <p className="mb-4 opacity-90">
                    Experience beautiful, healthy nails with professional
                    manicure and pedicure services
                  </p>
                  <div className="bg-white bg-opacity-30 p-2 rounded-lg backdrop-blur-sm inline-flex items-center justify-center">
                    <span className="text-white font-medium">
                      Explore Services
                    </span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Face & Body */}
            <Link href="/face-and-body" className="group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-90 z-10"></div>
                <Image
                  src="/images/face.jpg"
                  alt="Face & Body"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Face & Body</h3>
                  <p className="mb-4 opacity-90">
                    Rejuvenate your skin and relax your body with our
                    comprehensive face and body treatments
                  </p>
                  <div className="bg-white bg-opacity-30 p-2 rounded-lg backdrop-blur-sm inline-flex items-center justify-center">
                    <span className="text-white font-medium">
                      Explore Services
                    </span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Business Sign-up Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Are You a Salon Owner?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our platform and reach more customers! Register your salon,
            manage appointments, and grow your business.
          </p>
          <Link
            href="/signup"
            className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
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
            Sign Up as Business
          </Link>
          <p className="mt-4 text-sm opacity-80">
            Already have an account?{" "}
            <Link href="/login" className="underline hover:opacity-100">
              Login
            </Link>
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Beautify</h3>
              <p className="text-gray-400">
                Your one-stop platform for all beauty services. Connect with
                top-rated salons and professionals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/hair-styles"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Hair Styles
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nails"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Nails
                  </Link>
                </li>
                <li>
                  <Link
                    href="/face-and-body"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Face & Body
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recommended"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Recommended
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Business</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/signup"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Register Your Salon
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Business Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@beautify.com
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +94 123 456 7890
                </li>
              </ul>
              <div className="mt-4 flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Beautify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
