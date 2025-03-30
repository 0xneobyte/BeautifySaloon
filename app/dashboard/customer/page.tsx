"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { appointmentAPI } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Appointment {
  _id: string;
  salon: {
    _id: string;
    name: string;
    logo?: string;
    address: string;
    city: string;
  };
  service: {
    name: string;
    category: string;
    duration: number;
    price: number;
  };
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export default function CustomerDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { session, isAuthenticated, isCustomerUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is a customer
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isCustomerUser) {
      router.push("/");
    } else {
      fetchAppointments();
    }
  }, [isAuthenticated, isCustomerUser, router]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAppointments();

      if (response && response.appointments) {
        setAppointments(response.appointments);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      await appointmentAPI.updateAppointment(id, "cancelled");
      // Update the local state to reflect the cancellation
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to cancel appointment");
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="bg-pink-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <Link
              href="/hair-styles"
              className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              Book New Appointment
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">My Appointments</h2>

              {appointments.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-600 mb-6">
                    You don't have any appointments yet. Book your first
                    appointment now!
                  </p>
                  <Link
                    href="/hair-styles"
                    className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
                  >
                    Explore Salons
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                            {appointment.salon.logo ? (
                              <Image
                                src={appointment.salon.logo}
                                alt={appointment.salon.name}
                                width={64}
                                height={64}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl font-bold text-pink-300">
                                {appointment.salon.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {appointment.salon.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.salon.address},{" "}
                              {appointment.salon.city}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 text-right">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                          <p className="text-sm font-medium mt-1">
                            {new Date(appointment.date).toLocaleDateString()},{" "}
                            {appointment.startTime} - {appointment.endTime}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              {appointment.service.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.service.category} •{" "}
                              {appointment.service.duration} min • $
                              {appointment.service.price}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <Link
                              href={`/salon/${appointment.salon._id}`}
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              View Salon
                            </Link>
                            {appointment.status === "pending" && (
                              <button
                                onClick={() =>
                                  cancelAppointment(appointment._id)
                                }
                                className="text-sm text-red-600 hover:text-red-500"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recommended Salons Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Recommended For You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/hair-styles" className="group">
                  <div className="aspect-w-1 aspect-h-1 bg-pink-100 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center h-full p-6 text-center group-hover:bg-pink-200 transition-colors">
                      <span className="text-xl font-semibold text-pink-800">
                        Hair Styling Services
                      </span>
                    </div>
                  </div>
                </Link>
                <Link href="/nails" className="group">
                  <div className="aspect-w-1 aspect-h-1 bg-pink-100 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center h-full p-6 text-center group-hover:bg-pink-200 transition-colors">
                      <span className="text-xl font-semibold text-pink-800">
                        Nail Care
                      </span>
                    </div>
                  </div>
                </Link>
                <Link href="/face-and-body" className="group">
                  <div className="aspect-w-1 aspect-h-1 bg-pink-100 rounded-lg overflow-hidden">
                    <div className="flex items-center justify-center h-full p-6 text-center group-hover:bg-pink-200 transition-colors">
                      <span className="text-xl font-semibold text-pink-800">
                        Face & Body Treatments
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
