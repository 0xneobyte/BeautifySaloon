import Navbar from "../components/Navbar";

export default function HairStyles() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-200 to-pink-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl font-bold text-white mb-4">
                Find Your Perfect Hair style!
              </h1>
              <p className="text-xl text-white mb-8">
                Explore, Choose, and Transform – Your Ideal Look Awaits!
              </p>

              {/* Search Form */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-pink-500 mb-4">
                  Search and Find The Best Solution For Your need
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Search by Salon Name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  />
                  <input
                    type="text"
                    placeholder="Search by location"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  />
                  <input
                    type="text"
                    placeholder="Search by Postcode"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <button className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors w-full mt-4">
                  Search
                </button>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="relative h-96 rounded-lg overflow-hidden bg-pink-300">
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <span className="text-2xl font-semibold">
                    Hair Model Image
                  </span>
                </div>
              </div>
            </div>
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
                    <li>Colombo</li>
                    <li>Dehiwala</li>
                    <li>Nugegoda</li>
                    <li>Mount Lavinia</li>
                    <li>Rajagiriya</li>
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
