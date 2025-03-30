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
      <div className="bg-pink-50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Business Dashboard
            </h1>
            <Link
              href="/signup/business/setup"
              className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              Register New Salon
            </Link>
          </div>

          {/* Upcoming Appointments Section */}
          {appointments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600">
                <h2 className="text-xl font-bold text-white">
                  Upcoming Appointments
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-pink-50">
                        <th className="px-4 py-2 text-left text-pink-700">
                          Customer
                        </th>
                        <th className="px-4 py-2 text-left text-pink-700">
                          Salon
                        </th>
                        <th className="px-4 py-2 text-left text-pink-700">
                          Service
                        </th>
                        <th className="px-4 py-2 text-left text-pink-700">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-pink-700">
                          Time
                        </th>
                        <th className="px-4 py-2 text-left text-pink-700">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-pink-700">
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
                        .map((appointment) => (
                          <tr
                            key={appointment._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3">
                              {appointment.customer.firstName}{" "}
                              {appointment.customer.lastName}
                            </td>
                            <td className="px-4 py-3">
                              {appointment.salon.name}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-medium">
                                {appointment.service.name}
                              </span>
                              <span className="text-sm text-gray-500 block">
                                {appointment.service.category}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {formatDate(appointment.date)}
                            </td>
                            <td className="px-4 py-3">
                              {appointment.startTime} - {appointment.endTime}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                {appointment.status === "pending" && (
                                  <button
                                    onClick={() =>
                                      updateAppointmentStatus(
                                        appointment._id,
                                        "confirmed"
                                      )
                                    }
                                    className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
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
                                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
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
                                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
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
                  <p className="text-center py-4 text-gray-500">
                    No upcoming appointments
                  </p>
                )}

                <div className="mt-4 text-right">
                  <Link
                    href="/dashboard/business/appointments"
                    className="text-pink-600 hover:text-pink-800 font-medium"
                  >
                    View All Appointments →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {salons.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">
                Welcome to Your Business Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't registered any salons yet. Get started by
                registering your first salon!
              </p>
              <Link
                href="/signup/business/setup"
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
              >
                Register Your Salon
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {salons.map((salon) => (
                <div
                  key={salon._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4">
                        {salon.logo ? (
                          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                            <Image
                              src={salon.logo}
                              alt={salon.name}
                              width={300}
                              height={300}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-w-1 aspect-h-1 rounded-lg bg-pink-100 flex items-center justify-center">
                            <span className="text-4xl font-bold text-pink-300">
                              {salon.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="md:w-3/4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-bold">{salon.name}</h2>
                            {salon.slogan && (
                              <p className="text-gray-600">{salon.slogan}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Link
                              href={`/salon/${salon._id}`}
                              className="text-pink-500 hover:text-pink-700"
                            >
                              View Profile
                            </Link>
                            <Link
                              href={`/dashboard/business/edit/${salon._id}`}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-700">
                              Contact Information
                            </h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                              <li>{salon.email}</li>
                              <li>{salon.phone}</li>
                              <li>
                                {salon.address}, {salon.city}, {salon.district}{" "}
                                {salon.postalCode}
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-700">
                              Services Offered
                            </h3>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {salon.services.map((service, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs"
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
                            <div className="mt-6">
                              <h3 className="font-semibold text-gray-700 mb-2">
                                Recent Appointments
                              </h3>
                              <div className="overflow-x-auto max-h-40 overflow-y-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-2 py-1 text-left">
                                        Customer
                                      </th>
                                      <th className="px-2 py-1 text-left">
                                        Service
                                      </th>
                                      <th className="px-2 py-1 text-left">
                                        Date
                                      </th>
                                      <th className="px-2 py-1 text-left">
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
                                          className="border-b hover:bg-gray-50"
                                        >
                                          <td className="px-2 py-1">
                                            {apt.customer.firstName}{" "}
                                            {apt.customer.lastName}
                                          </td>
                                          <td className="px-2 py-1">
                                            {apt.service.name}
                                          </td>
                                          <td className="px-2 py-1">
                                            {formatDate(apt.date)}{" "}
                                            {apt.startTime}
                                          </td>
                                          <td className="px-2 py-1">
                                            <span
                                              className={`px-1 py-0.5 rounded-full text-xs ${
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

                        <div className="mt-6 flex gap-4">
                          <Link
                            href={`/dashboard/business/appointments/${salon._id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                          >
                            Manage Appointments
                          </Link>
                          <Link
                            href={`/dashboard/business/gallery/${salon._id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                          >
                            Manage Gallery
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
