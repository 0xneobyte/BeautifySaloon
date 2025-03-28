import Navbar from "../components/Navbar";

export default function Appointment() {
  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Make an Appointment Hair Services & Styling
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <div className="mb-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between p-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <h3 className="text-lg font-semibold">March</h3>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="border-t">
                    <div className="grid grid-cols-7 gap-px">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                        <div
                          key={day}
                          className="text-center py-2 text-sm font-semibold"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-gray-200">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <button
                          key={i}
                          className="bg-white p-2 hover:bg-pink-50 focus:bg-pink-100 focus:outline-none"
                        >
                          <time dateTime="2024-03-01" className="text-sm">
                            {i + 1}
                          </time>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "9:00 AM",
                    "10:00 AM",
                    "11:00 AM",
                    "2:00 PM",
                    "3:00 PM",
                    "4:00 PM",
                  ].map((time) => (
                    <button
                      key={time}
                      className="py-2 px-4 text-sm border rounded-lg hover:bg-pink-50 focus:ring-2 focus:ring-pink-500"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Selection Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Choose Your Beauty Treatment
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative rounded-lg overflow-hidden h-48 bg-gradient-to-r from-pink-300 to-pink-500">
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                      Hair Style
                    </button>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden h-48 bg-gradient-to-r from-purple-300 to-purple-500">
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                      Nails
                    </button>
                  </div>
                </div>

                <div className="relative rounded-lg overflow-hidden h-48 bg-gradient-to-r from-blue-300 to-blue-500">
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button className="px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
                      Face and Body
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
