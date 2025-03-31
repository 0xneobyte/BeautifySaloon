"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { salonAPI } from "@/utils/api";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Service {
  _id?: string;
  name: string;
  category: string;
  minDuration: number;
  maxDuration: number;
  price: number;
}

interface Salon {
  _id: string;
  name: string;
  services: Service[];
}

export default function ManageServices() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newService, setNewService] = useState<Service>({
    name: "",
    category: "Hair Styling",
    minDuration: 30,
    maxDuration: 60,
    price: 0,
  });
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      fetchSalon();
    }
  }, [isAuthenticated, isBusinessUser, router, id]);

  const fetchSalon = async () => {
    try {
      setLoading(true);
      const response = await salonAPI.getSalon(id);

      if (response && response.salon) {
        setSalon(response.salon);
      } else {
        setError("Salon not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load salon");
    } finally {
      setLoading(false);
    }
  };

  const handleNewServiceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setNewService({
      ...newService,
      [name]:
        name === "price" || name === "minDuration" || name === "maxDuration"
          ? parseFloat(value)
          : value,
    });
  };

  const handleEditServiceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editingService) return;

    const { name, value } = e.target;

    setEditingService({
      ...editingService,
      [name]:
        name === "price" || name === "minDuration" || name === "maxDuration"
          ? parseFloat(value)
          : value,
    });
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon) return;

    try {
      setIsSubmitting(true);
      setError("");

      // Add new service
      const updatedServices = [...salon.services, newService];

      // Update salon with new services
      await salonAPI.updateSalon(id, {
        services: updatedServices,
      });

      // Reset form
      setNewService({
        name: "",
        category: "Hair Styling",
        minDuration: 30,
        maxDuration: 60,
        price: 0,
      });

      // Refresh salon data
      fetchSalon();

      // Show success message
      alert("Service added successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to add service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon || !editingService) return;

    try {
      setIsSubmitting(true);
      setError("");

      // Update service in the array
      const updatedServices = salon.services.map((service) =>
        service._id === editingService._id ? editingService : service
      );

      // Update salon with edited services
      await salonAPI.updateSalon(id, {
        services: updatedServices,
      });

      // Reset form
      setEditingService(null);
      setIsEditing(false);

      // Refresh salon data
      fetchSalon();

      // Show success message
      alert("Service updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!salon) return;

    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // Remove service from array
      const updatedServices = salon.services.filter(
        (service) => service._id !== serviceId
      );

      // Update salon with removed service
      await salonAPI.updateSalon(id, {
        services: updatedServices,
      });

      // Refresh salon data
      fetchSalon();

      // Show success message
      alert("Service deleted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to delete service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (service: Service) => {
    setEditingService(service);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditingService(null);
    setIsEditing(false);
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
              Manage Services
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
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {salon.name} - Services
                  </h2>

                  {salon.services.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
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
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <p className="text-gray-600">No services added yet.</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Add your first service using the form below.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Service Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {salon.services.map((service) => (
                            <tr key={service._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {service.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {service.category}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {service.minDuration}-{service.maxDuration}{" "}
                                  min
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  ${service.price.toFixed(2)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => startEditing(service)}
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteService(service._id!)
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {isEditing && editingService ? (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Edit Service</h3>
                    <form onSubmit={handleEditService} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Service Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={editingService.name}
                            onChange={handleEditServiceChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={editingService.category}
                            onChange={handleEditServiceChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="Hair Styling">Hair Styling</option>
                            <option value="Nails">Nails</option>
                            <option value="Face and Body">Face and Body</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="minDuration"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Minimum Duration (minutes)
                          </label>
                          <input
                            type="number"
                            id="minDuration"
                            name="minDuration"
                            value={editingService.minDuration}
                            onChange={handleEditServiceChange}
                            required
                            min="5"
                            step="5"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="maxDuration"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Maximum Duration (minutes)
                          </label>
                          <input
                            type="number"
                            id="maxDuration"
                            name="maxDuration"
                            value={editingService.maxDuration}
                            onChange={handleEditServiceChange}
                            required
                            min="5"
                            step="5"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Price ($)
                          </label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={editingService.price}
                            onChange={handleEditServiceChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Add New Service
                    </h3>
                    <form onSubmit={handleAddService} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Service Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={newService.name}
                            onChange={handleNewServiceChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g. Haircut, Manicure, Facial"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Category
                          </label>
                          <select
                            id="category"
                            name="category"
                            value={newService.category}
                            onChange={handleNewServiceChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="Hair Styling">Hair Styling</option>
                            <option value="Nails">Nails</option>
                            <option value="Face and Body">Face and Body</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="minDuration"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Minimum Duration (minutes)
                          </label>
                          <input
                            type="number"
                            id="minDuration"
                            name="minDuration"
                            value={newService.minDuration}
                            onChange={handleNewServiceChange}
                            required
                            min="5"
                            step="5"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="maxDuration"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Maximum Duration (minutes)
                          </label>
                          <input
                            type="number"
                            id="maxDuration"
                            name="maxDuration"
                            value={newService.maxDuration}
                            onChange={handleNewServiceChange}
                            required
                            min="5"
                            step="5"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Price ($)
                          </label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={newService.price}
                            onChange={handleNewServiceChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Adding..." : "Add Service"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
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
