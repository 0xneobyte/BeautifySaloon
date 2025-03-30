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
      <div className="min-h-[calc(100vh-4rem)] bg-pink-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            {salon
              ? `Book Appointment at ${salon.name}`
              : "Make an Appointment Hair Services & Styling"}
          </h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
          ) : (
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
                      <h3 className="text-lg font-semibold">{month}</h3>
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
                              className={`bg-white p-2 hover:bg-pink-50 focus:outline-none ${
                                isSelected ? "bg-pink-100 font-bold" : ""
                              } ${isToday ? "border border-pink-500" : ""}`}
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

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Available Time Slots
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`py-2 px-4 text-sm border rounded-lg hover:bg-pink-50 focus:outline-none ${
                          selectedTime === time
                            ? "bg-pink-100 border-pink-500 font-bold"
                            : ""
                        }`}
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

                {!salon ? (
                  <div className="text-center py-8 text-red-600">
                    Please select a salon first
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      <div
                        onClick={() => handleCategorySelect("Hair Styling")}
                        className={`relative rounded-lg overflow-hidden h-24 cursor-pointer ${
                          selectedCategory === "Hair Styling"
                            ? "ring-2 ring-pink-500"
                            : ""
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-pink-500"></div>
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="px-6 py-2 bg-white text-gray-900 rounded-full">
                            Hair Style
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => handleCategorySelect("Nails")}
                        className={`relative rounded-lg overflow-hidden h-24 cursor-pointer ${
                          selectedCategory === "Nails"
                            ? "ring-2 ring-pink-500"
                            : ""
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-purple-500"></div>
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="px-6 py-2 bg-white text-gray-900 rounded-full">
                            Nails
                          </div>
                        </div>
                      </div>

                      <div
                        onClick={() => handleCategorySelect("Face and Body")}
                        className={`relative rounded-lg overflow-hidden h-24 cursor-pointer ${
                          selectedCategory === "Face and Body"
                            ? "ring-2 ring-pink-500"
                            : ""
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-500"></div>
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="px-6 py-2 bg-white text-gray-900 rounded-full">
                            Face and Body
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedCategory && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Select Service
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {salon.services
                            .filter(
                              (service) => service.category === selectedCategory
                            )
                            .map((service, index) => (
                              <div
                                key={index}
                                onClick={() => setSelectedService(service)}
                                className={`p-3 border rounded-lg cursor-pointer hover:bg-pink-50 ${
                                  selectedService &&
                                  selectedService.name === service.name
                                    ? "bg-pink-100 border-pink-500"
                                    : ""
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">
                                      {service.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {service.minDuration} min
                                    </p>
                                  </div>
                                  <p className="font-semibold">
                                    ${service.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <button
                        onClick={handleSubmit}
                        disabled={
                          !selectedDate ||
                          !selectedTime ||
                          !selectedService ||
                          submitting
                        }
                        className={`w-full py-3 rounded-lg font-medium text-white ${
                          !selectedDate ||
                          !selectedTime ||
                          !selectedService ||
                          submitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600"
                        }`}
                      >
                        {submitting ? "Processing..." : "Book Appointment"}
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
