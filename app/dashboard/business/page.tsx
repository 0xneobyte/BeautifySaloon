"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { salonAPI } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Service {
  name: string;
  category: string;
  minDuration: number;
  maxDuration: number;
  price: number;
}

interface Salon {
  _id: string;
  name: string;
  slogan?: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  postalCode: string;
  services: Service[];
  logo?: string;
  gallery?: string[];
  rating?: number;
}

interface Appointment {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  salon: {
    name: string;
    address: string;
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
  notes?: string;
  createdAt: string;
}

export default function BusinessDashboard() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { session, isAuthenticated, isBusinessUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is a business user
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isBusinessUser) {
      router.push("/");
    } else {
      fetchSalons();
      fetchAppointments();
    }
  }, [isAuthenticated, isBusinessUser, router]);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response = await salonAPI.getSalons();

      if (response && response.salons) {
        setSalons(response.salons);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load salons");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch (err: any) {
      console.error("Error fetching appointments:", err);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: string
  ) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      // Update local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status: status as any }
            : appointment
        )
      );

      toast.success(`Appointment ${status}`);
    } catch (error) {
      toast.error("Failed to update appointment");
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  // Group appointments by salon
  const appointmentsBySalon: Record<string, Appointment[]> = {};
  appointments.forEach((appointment) => {
    const salonName = appointment.salon.name;
    if (!appointmentsBySalon[salonName]) {
      appointmentsBySalon[salonName] = [];
    }
    appointmentsBySalon[salonName].push(appointment);
  });

  return (
    <main>
      <Navbar />
      <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Business Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your salons and appointments in one place
              </p>
            </div>
            <Link
              href="/signup/business/setup"
              className="mt-4 md:mt-0 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:from-pink-600 hover:to-pink-700 flex items-center"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Register New Salon
            </Link>
          </div>

          {/* Upcoming Appointments Section */}
          {appointments.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10 transform transition-all duration-300 hover:shadow-2xl">
              <div className="px-6 py-5 bg-gradient-to-r from-pink-500 to-pink-600">
                <h2 className="text-2xl font-bold text-white flex items-center">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Upcoming Appointments
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto styled-scrollbar">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-pink-50 text-left">
                        <th className="px-4 py-3 text-pink-700 font-bold rounded-tl-lg">
                          Customer
                        </th>
                        <th className="px-4 py-3 text-pink-700 font-bold">
                          Salon
                        </th>
                        <th className="px-4 py-3 text-pink-700 font-bold">
                          Service
                        </th>
                        <th className="px-4 py-3 text-pink-700 font-bold">
                          Date
                        </th>
                        <th className="px-4 py-3 text-pink-700 font-bold">
                          Time
                        </th>
                        <th className="px-4 py-3 text-pink-700 font-bold">
                          Status
                        </th>
                        <th className="px-4 py-3 text-pink-700 font-bold rounded-tr-lg">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(
                          (apt) =>
                            apt.status !== "cancelled" &&
                            apt.status !== "completed"
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        )
                        .slice(0, 5) // Show only the next 5 appointments
                        .map((appointment, index, array) => (
                          <tr
                            key={appointment._id}
                            className={`border-b hover:bg-pink-50 transition-colors ${
                              index === array.length - 1 ? "border-b-0" : ""
                            }`}
                          >
                            <td className="px-4 py-4">
                              <div className="font-medium text-gray-800">
                                {appointment.customer.firstName}{" "}
                                {appointment.customer.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.customer.email}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-medium text-gray-800">
                              {appointment.salon.name}
                            </td>
                            <td className="px-4 py-4">
                              <div className="font-medium text-gray-800">
                                {appointment.service.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.service.category}
                              </div>
                            </td>
                            <td className="px-4 py-4 font-medium text-gray-800">
                              {formatDate(appointment.date)}
                            </td>
                            <td className="px-4 py-4 font-medium text-gray-800">
                              {appointment.startTime} - {appointment.endTime}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  appointment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : appointment.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex space-x-2">
                                {appointment.status === "pending" && (
                                  <button
                                    onClick={() =>
                                      updateAppointmentStatus(
                                        appointment._id,
                                        "confirmed"
                                      )
                                    }
                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors shadow-sm"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {(appointment.status === "pending" ||
                                  appointment.status === "confirmed") && (
                                  <>
                                    <button
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          appointment._id,
                                          "completed"
                                        )
                                      }
                                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors shadow-sm"
                                    >
                                      Complete
                                    </button>
                                    <button
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          appointment._id,
                                          "cancelled"
                                        )
                                      }
                                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors shadow-sm"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {appointments.filter(
                  (apt) =>
                    apt.status !== "cancelled" && apt.status !== "completed"
                ).length === 0 && (
                  <div className="text-center py-10">
                    <svg
                      className="w-16 h-16 text-pink-200 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      No upcoming appointments
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Your upcoming appointments will appear here
                    </p>
                  </div>
                )}

                <div className="mt-6 text-right">
                  <Link
                    href="/dashboard/business/appointments"
                    className="text-pink-600 hover:text-pink-800 font-bold flex items-center justify-end"
                  >
                    View All Appointments
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {salons.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center transform transition-all duration-300 hover:shadow-2xl">
              <svg
                className="w-20 h-20 text-pink-300 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Your Business Dashboard
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't registered any salons yet. Get started by
                registering your first salon to manage appointments and
                services.
              </p>
              <Link
                href="/signup/business/setup"
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-xl hover:from-pink-600 hover:to-pink-700 transform transition-all duration-300 hover:-translate-y-1 inline-flex items-center"
              >
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Register Your Salon
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {salons.map((salon) => (
                <div
                  key={salon._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
                >
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="lg:w-1/4">
                        {salon.logo ? (
                          <div className="rounded-xl overflow-hidden shadow-lg aspect-square">
                            <Image
                              src={salon.logo}
                              alt={salon.name}
                              width={300}
                              height={300}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ) : (
                          <div className="rounded-xl bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center aspect-square shadow-lg">
                            <span className="text-5xl font-extrabold text-white">
                              {salon.name.charAt(0)}
                            </span>
                          </div>
                        )}

                        <div className="mt-4 flex lg:flex-col gap-2">
                          <Link
                            href={`/salon/${salon._id}`}
                            className="flex-1 text-center text-pink-600 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Profile
                          </Link>
                          <Link
                            href={`/dashboard/business/edit/${salon._id}`}
                            className="flex-1 text-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </Link>
                        </div>
                      </div>

                      <div className="lg:w-3/4">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                          <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                              {salon.name}
                            </h2>
                            {salon.slogan && (
                              <p className="text-gray-600 mt-1 italic">
                                {salon.slogan}
                              </p>
                            )}
                            <div className="flex items-center mt-2">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  salon.gender === "Male"
                                    ? "bg-blue-100 text-blue-800"
                                    : salon.gender === "Female"
                                    ? "bg-pink-100 text-pink-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {salon.gender}
                              </span>
                              {salon.rating && (
                                <div className="ml-3 flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                  <svg
                                    className="w-4 h-4 mr-1 text-yellow-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  {salon.rating.toFixed(1)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                              <svg
                                className="w-5 h-5 mr-2 text-gray-500"
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
                              Contact Information
                            </h3>
                            <ul className="space-y-2 text-gray-600">
                              <li className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2 text-pink-500"
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
                                {salon.email}
                              </li>
                              <li className="flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2 text-pink-500"
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
                                {salon.phone}
                              </li>
                              <li className="flex items-start">
                                <svg
                                  className="w-4 h-4 mr-2 mt-0.5 text-pink-500 flex-shrink-0"
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
                                <span>
                                  {salon.address}, {salon.city},{" "}
                                  {salon.district} {salon.postalCode}
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                              <svg
                                className="w-5 h-5 mr-2 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                              Services Offered
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {salon.services.map((service, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
                                >
                                  {service.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Salon Appointments */}
                        {appointmentsBySalon[salon.name] &&
                          appointmentsBySalon[salon.name].length > 0 && (
                            <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                              <div className="p-4 border-b bg-gray-50 rounded-t-xl">
                                <h3 className="font-bold text-gray-800 flex items-center">
                                  <svg
                                    className="w-5 h-5 mr-2 text-pink-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  Recent Appointments
                                </h3>
                              </div>
                              <div className="overflow-x-auto max-h-48 overflow-y-auto styled-scrollbar">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                      <th className="px-4 py-2 text-left font-semibold">
                                        Customer
                                      </th>
                                      <th className="px-4 py-2 text-left font-semibold">
                                        Service
                                      </th>
                                      <th className="px-4 py-2 text-left font-semibold">
                                        Date
                                      </th>
                                      <th className="px-4 py-2 text-left font-semibold">
                                        Status
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {appointmentsBySalon[salon.name]
                                      .sort(
                                        (a, b) =>
                                          new Date(a.date).getTime() -
                                          new Date(b.date).getTime()
                                      )
                                      .slice(0, 3)
                                      .map((apt) => (
                                        <tr
                                          key={apt._id}
                                          className="border-b hover:bg-gray-50 transition-colors"
                                        >
                                          <td className="px-4 py-3 font-medium">
                                            {apt.customer.firstName}{" "}
                                            {apt.customer.lastName}
                                          </td>
                                          <td className="px-4 py-3">
                                            {apt.service.name}
                                          </td>
                                          <td className="px-4 py-3">
                                            {formatDate(apt.date)}{" "}
                                            <span className="text-gray-500">
                                              {apt.startTime}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3">
                                            <span
                                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                apt.status === "pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : apt.status === "confirmed"
                                                  ? "bg-green-100 text-green-800"
                                                  : apt.status === "completed"
                                                  ? "bg-blue-100 text-blue-800"
                                                  : "bg-red-100 text-red-800"
                                              }`}
                                            >
                                              {apt.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                        <div className="mt-6 flex flex-wrap gap-4">
                          <Link
                            href={`/dashboard/business/appointments/${salon._id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                          >
                            <svg
                              className="w-5 h-5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Manage Appointments
                          </Link>
                          <Link
                            href={`/dashboard/business/gallery/${salon._id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                          >
                            <svg
                              className="w-5 h-5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Manage Gallery
                          </Link>
                          <Link
                            href={`/dashboard/business/services/${salon._id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                          >
                            <svg
                              className="w-5 h-5 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                            Manage Services
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
