"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

export default function Appointment() {
  const { isAuthenticated, isCustomerUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const salonId = searchParams.get("salon");
  const [salon, setSalon] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [month, setMonth] = useState("");
  const [days, setDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ]);

  // Map display times to 24hr format for API
  const timeMap = {
    "9:00 AM": "09:00",
    "10:00 AM": "10:00",
    "11:00 AM": "11:00",
    "2:00 PM": "14:00",
    "3:00 PM": "15:00",
    "4:00 PM": "16:00",
  };

  // Redirect if not authenticated or not a customer
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(
        "/login?redirect=/appointment" + (salonId ? `?salon=${salonId}` : "")
      );
    } else if (!isCustomerUser) {
      toast.error("Only customers can book appointments");
      router.push("/");
    }
  }, [isAuthenticated, isCustomerUser, router, salonId]);

  // Initialize calendar
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    });
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    setMonth(currentMonth);
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    setSelectedDate(currentDate.toISOString().split("T")[0]);
  }, []);

  // Fetch salon data
  useEffect(() => {
    if (salonId) {
      fetchSalon();
    } else {
      setLoading(false);
    }
  }, [salonId]);

  const fetchSalon = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/salons/${salonId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch salon");
      }

      const data = await response.json();
      setSalon(data.salon);
    } catch (error) {
      toast.error("Error loading salon information");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (day) => {
    const dateObj = new Date();
    dateObj.setDate(day);
    setSelectedDate(dateObj.toISOString().split("T")[0]);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedService(null);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedService || !salonId) {
      toast.error("Please select all appointment details");
      return;
    }

    try {
      setSubmitting(true);

      // Calculate end time (assuming 1 hour appointments)
      const startTimeHour = parseInt(timeMap[selectedTime].split(":")[0]);
      const endTime = `${(startTimeHour + 1).toString().padStart(2, "0")}:00`;

      const appointmentData = {
        salon: salonId,
        service: {
          name: selectedService.name,
          category: selectedService.category,
          duration: selectedService.minDuration,
          price: selectedService.price,
        },
        date: selectedDate,
        startTime: timeMap[selectedTime],
        endTime: endTime,
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book appointment");
      }

      const data = await response.json();
      toast.success("Appointment booked successfully!");
      router.push("/dashboard/customer");
    } catch (error) {
      toast.error(error.message || "Error booking appointment");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-pink-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800">
            {salon
              ? `Book Appointment at ${salon.name}`
              : "Schedule Your Beauty Treatment"}
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Select your preferred date, time, and service to book your next
            beauty appointment with our experienced professionals.
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Calendar Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01] duration-300">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                  Select Date & Time
                </h2>
                <div className="mb-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-xl">
                      <button className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all">
                        <svg
                          className="w-5 h-5 text-gray-700"
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
                      <h3 className="text-xl font-bold text-gray-800">
                        {month}
                      </h3>
                      <button className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all">
                        <svg
                          className="w-5 h-5 text-gray-700"
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
                    <div>
                      <div className="grid grid-cols-7 gap-px">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                          <div
                            key={day}
                            className="text-center py-3 text-sm font-bold text-gray-600"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-px bg-white">
                        {days.map((day) => {
                          const today = new Date();
                          const isToday = day === today.getDate();
                          const date = new Date();
                          date.setDate(day);
                          const dateStr = date.toISOString().split("T")[0];
                          const isSelected = dateStr === selectedDate;

                          return (
                            <button
                              key={day}
                              onClick={() => handleDateSelect(day)}
                              className={`py-3 hover:bg-pink-50 focus:outline-none transition-colors ${
                                isSelected
                                  ? "bg-pink-100 font-bold text-pink-700"
                                  : "text-gray-700"
                              } ${
                                isToday ? "ring-2 ring-pink-400 ring-inset" : ""
                              }`}
                            >
                              <time dateTime={dateStr} className="text-sm">
                                {day}
                              </time>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
                    Available Time Slots
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`py-3 px-4 text-sm rounded-xl transition-all duration-200 ${
                          selectedTime === time
                            ? "bg-pink-500 text-white font-bold shadow-md transform -translate-y-1"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-pink-300 hover:shadow"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Selection Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01] duration-300">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
                  Choose Your Beauty Treatment
                </h2>

                {!salon ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <svg
                      className="w-16 h-16 text-pink-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg text-red-500 font-semibold mb-2">
                      Please select a salon first
                    </p>
                    <p className="text-gray-500 max-w-xs">
                      You need to select a salon before booking an appointment.
                      Visit our salons page to find the perfect match.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      <div
                        onClick={() => handleCategorySelect("Hair Styling")}
                        className={`relative rounded-xl overflow-hidden h-28 cursor-pointer transition-all duration-300 ${
                          selectedCategory === "Hair Styling"
                            ? "ring-4 ring-pink-500 transform scale-[1.02]"
                            : "hover:shadow-lg"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600"></div>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="px-6 py-2 bg-white text-gray-900 rounded-full font-bold shadow-md">
                            Hair Style
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => handleCategorySelect("Nails")}
                        className={`relative rounded-xl overflow-hidden h-28 cursor-pointer transition-all duration-300 ${
                          selectedCategory === "Nails"
                            ? "ring-4 ring-purple-500 transform scale-[1.02]"
                            : "hover:shadow-lg"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="px-6 py-2 bg-white text-gray-900 rounded-full font-bold shadow-md">
                            Nails
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => handleCategorySelect("Face and Body")}
                        className={`relative rounded-xl overflow-hidden h-28 cursor-pointer transition-all duration-300 ${
                          selectedCategory === "Face and Body"
                            ? "ring-4 ring-blue-500 transform scale-[1.02]"
                            : "hover:shadow-lg"
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <div className="px-6 py-2 bg-white text-gray-900 rounded-full font-bold shadow-md">
                            Face and Body
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedCategory && (
                      <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">
                          Select Service
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 styled-scrollbar">
                          {salon.services.filter(
                            (service) => service.category === selectedCategory
                          ).length === 0 ? (
                            <p className="text-center py-8 text-gray-500">
                              No services available in this category
                            </p>
                          ) : (
                            salon.services
                              .filter(
                                (service) =>
                                  service.category === selectedCategory
                              )
                              .map((service, index) => (
                                <div
                                  key={index}
                                  onClick={() => setSelectedService(service)}
                                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                    selectedService &&
                                    selectedService.name === service.name
                                      ? "bg-gradient-to-r from-pink-50 to-pink-100 border-pink-300 shadow-md transform -translate-y-1"
                                      : "hover:border-pink-200 hover:shadow"
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-bold text-gray-800">
                                        {service.name}
                                      </p>
                                      <div className="flex items-center mt-1">
                                        <svg
                                          className="w-4 h-4 text-gray-400 mr-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                          />
                                        </svg>
                                        <p className="text-sm text-gray-500">
                                          {service.minDuration} min
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-lg text-pink-600">
                                        ${service.price}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-10">
                      <button
                        onClick={handleSubmit}
                        disabled={
                          !selectedDate ||
                          !selectedTime ||
                          !selectedService ||
                          submitting
                        }
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                          !selectedDate ||
                          !selectedTime ||
                          !selectedService ||
                          submitting
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transform hover:-translate-y-1"
                        }`}
                      >
                        {submitting ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Book Appointment"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
