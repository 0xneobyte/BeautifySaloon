"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { salonAPI } from "@/utils/api";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  minDuration: number;
  maxDuration: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface Appointment {
  _id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  service: Service;
  user: User;
  notes?: string;
  createdAt: string;
}

interface Salon {
  _id: string;
  name: string;
  appointments: Appointment[];
}

export default function ManageAppointments() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const { session, isAuthenticated, isBusinessUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    // Check if user is authenticated and is a business user
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isBusinessUser) {
      router.push("/");
    } else {
      fetchSalonAndAppointments();
    }
  }, [isAuthenticated, isBusinessUser, router, id]);

  const fetchSalonAndAppointments = async () => {
    try {
      setLoading(true);

      // Fetch salon details
      const salonResponse = await salonAPI.getSalon(id);

      if (salonResponse && salonResponse.salon) {
        setSalon(salonResponse.salon);

        // Fetch appointments for this salon
        const appointmentsResponse = await salonAPI.getSalonAppointments(id);

        if (appointmentsResponse && appointmentsResponse.appointments) {
          setAppointments(appointmentsResponse.appointments);
        }
      } else {
        setError("Salon not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load salon and appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string
  ) => {
    try {
      setLoading(true);

      // Update appointment status
      const response = await salonAPI.updateAppointmentStatus(
        appointmentId,
        newStatus
      );

      if (response && response.success) {
        // Refresh appointments
        fetchSalonAndAppointments();

        // Show success message
        alert(`Appointment status updated to ${newStatus}`);
      } else {
        setError("Failed to update appointment status");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update appointment status");
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on status and date
  const filteredAppointments = appointments.filter((appointment) => {
    // Filter by status
    if (statusFilter !== "all" && appointment.status !== statusFilter) {
      return false;
    }

    // Filter by date
    if (dateFilter && !appointment.date.includes(dateFilter)) {
      return false;
    }

    return true;
  });

  // Sort appointments by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // Sort by date
    const dateComparison =
      new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;

    // If dates are the same, sort by time
    return a.time.localeCompare(b.time);
  });

  // Group appointments by date
  const appointmentsByDate: Record<string, Appointment[]> = {};
  sortedAppointments.forEach((appointment) => {
    if (!appointmentsByDate[appointment.date]) {
      appointmentsByDate[appointment.date] = [];
    }
    appointmentsByDate[appointment.date].push(appointment);
  });

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get appropriate status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href={`/dashboard/business/edit/${id}`}
          className="text-pink-600 mb-6 inline-flex items-center"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Salon
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Manage Appointments
            </h1>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : salon ? (
              <div className="space-y-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    {salon.name} - Appointments
                  </h2>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <label
                        htmlFor="status-filter"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div className="flex-1">
                      <label
                        htmlFor="date-filter"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="date-filter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setDateFilter("");
                        }}
                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>

                  {appointments.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                      <p className="text-gray-600">No appointments found.</p>
                      <p className="text-gray-500 text-sm mt-1">
                        As customers book appointments, they will appear here.
                      </p>
                    </div>
                  ) : sortedAppointments.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      <p className="text-gray-600">
                        No appointments match your filters.
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Try adjusting your filter criteria.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.keys(appointmentsByDate).map((date) => (
                        <div
                          key={date}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-100 px-4 py-3 border-b">
                            <h3 className="font-medium text-gray-800">
                              {formatDate(date)}
                            </h3>
                          </div>

                          <div className="divide-y">
                            {appointmentsByDate[date].map((appointment) => (
                              <div
                                key={appointment._id}
                                className="p-4 hover:bg-gray-50"
                              >
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                  <div>
                                    <div className="flex items-center">
                                      <span className="text-gray-500 mr-2">
                                        {appointment.time}
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                          appointment.status
                                        )}`}
                                      >
                                        {appointment.status
                                          .charAt(0)
                                          .toUpperCase() +
                                          appointment.status.slice(1)}
                                      </span>
                                    </div>

                                    <h4 className="font-medium mt-2">
                                      {appointment.service.name}
                                    </h4>

                                    <div className="text-sm text-gray-600 mt-1">
                                      <p>
                                        Duration:{" "}
                                        {appointment.service.minDuration}-
                                        {appointment.service.maxDuration} min |
                                        Price: $
                                        {appointment.service.price.toFixed(2)}
                                      </p>
                                    </div>

                                    <div className="text-sm mt-3">
                                      <p className="font-medium">Customer:</p>
                                      <p>
                                        {appointment.user.firstName}{" "}
                                        {appointment.user.lastName}
                                      </p>
                                      <p className="text-gray-600">
                                        {appointment.user.email}{" "}
                                        {appointment.user.phone &&
                                          `| ${appointment.user.phone}`}
                                      </p>
                                    </div>

                                    {appointment.notes && (
                                      <div className="text-sm mt-2">
                                        <p className="font-medium">Notes:</p>
                                        <p className="text-gray-600 italic">
                                          "{appointment.notes}"
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex flex-col gap-2">
                                    {appointment.status === "pending" && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleStatusChange(
                                              appointment._id,
                                              "confirmed"
                                            )
                                          }
                                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                        >
                                          Confirm
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleStatusChange(
                                              appointment._id,
                                              "cancelled"
                                            )
                                          }
                                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    )}

                                    {appointment.status === "confirmed" && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleStatusChange(
                                              appointment._id,
                                              "completed"
                                            )
                                          }
                                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Mark Completed
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleStatusChange(
                                              appointment._id,
                                              "cancelled"
                                            )
                                          }
                                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Salon not found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
