"use client";

import Navbar from "../../../components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { salonAPI } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";

interface ServiceInput {
  checked: boolean;
  name: string;
  category: string;
  minDuration: number;
  maxDuration: number;
  price: number;
}

export default function BusinessSetup() {
  const router = useRouter();
  const { session, isAuthenticated, isBusinessUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1 = salon info, 2 = services

  // Salon info
  const [salonInfo, setSalonInfo] = useState({
    name: "",
    slogan: "",
    gender: "Unisex",
    email: "",
    phone: "",
    address: "",
    district: "",
    city: "",
    postalCode: "",
  });

  // Services state
  const [hairServices, setHairServices] = useState<ServiceInput[]>([
    {
      checked: false,
      name: "Men's Haircut",
      category: "Hair Styling",
      minDuration: 30,
      maxDuration: 60,
      price: 20,
    },
    {
      checked: false,
      name: "Full Color",
      category: "Hair Styling",
      minDuration: 60,
      maxDuration: 120,
      price: 50,
    },
    {
      checked: false,
      name: "Keratin Treatment",
      category: "Hair Styling",
      minDuration: 90,
      maxDuration: 180,
      price: 100,
    },
  ]);

  const [nailServices, setNailServices] = useState<ServiceInput[]>([
    {
      checked: false,
      name: "Basic Manicure",
      category: "Nails",
      minDuration: 30,
      maxDuration: 60,
      price: 25,
    },
    {
      checked: false,
      name: "Basic Pedicure",
      category: "Nails",
      minDuration: 30,
      maxDuration: 60,
      price: 35,
    },
    {
      checked: false,
      name: "Hand Painted Nail Art",
      category: "Nails",
      minDuration: 60,
      maxDuration: 90,
      price: 45,
    },
  ]);

  const [faceBodyServices, setFaceBodyServices] = useState<ServiceInput[]>([
    {
      checked: false,
      name: "Basic Facial",
      category: "Face and Body",
      minDuration: 45,
      maxDuration: 75,
      price: 40,
    },
    {
      checked: false,
      name: "Eyebrow Waxing",
      category: "Face and Body",
      minDuration: 15,
      maxDuration: 30,
      price: 15,
    },
    {
      checked: false,
      name: "Eyebrow Threading",
      category: "Face and Body",
      minDuration: 15,
      maxDuration: 30,
      price: 15,
    },
  ]);

  useEffect(() => {
    // Check if user is authenticated and is a business user
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isBusinessUser) {
      router.push("/");
    }

    // If session has user data, pre-fill email
    if (session?.user?.email) {
      setSalonInfo((prev) => ({
        ...prev,
        email: session.user.email,
      }));
    }
  }, [isAuthenticated, isBusinessUser, router, session]);

  // Handle salon info change
  const handleSalonInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSalonInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change
  const handleServiceCheck = (
    index: number,
    serviceType: "hair" | "nails" | "faceBody",
    checked: boolean
  ) => {
    if (serviceType === "hair") {
      const newServices = [...hairServices];
      newServices[index].checked = checked;
      setHairServices(newServices);
    } else if (serviceType === "nails") {
      const newServices = [...nailServices];
      newServices[index].checked = checked;
      setNailServices(newServices);
    } else {
      const newServices = [...faceBodyServices];
      newServices[index].checked = checked;
      setFaceBodyServices(newServices);
    }
  };

  // Handle duration change
  const handleDurationChange = (
    index: number,
    serviceType: "hair" | "nails" | "faceBody",
    field: "minDuration" | "maxDuration",
    value: number
  ) => {
    if (serviceType === "hair") {
      const newServices = [...hairServices];
      newServices[index][field] = value;
      setHairServices(newServices);
    } else if (serviceType === "nails") {
      const newServices = [...nailServices];
      newServices[index][field] = value;
      setNailServices(newServices);
    } else {
      const newServices = [...faceBodyServices];
      newServices[index][field] = value;
      setFaceBodyServices(newServices);
    }
  };

  // Handle price change
  const handlePriceChange = (
    index: number,
    serviceType: "hair" | "nails" | "faceBody",
    value: number
  ) => {
    if (serviceType === "hair") {
      const newServices = [...hairServices];
      newServices[index].price = value;
      setHairServices(newServices);
    } else if (serviceType === "nails") {
      const newServices = [...nailServices];
      newServices[index].price = value;
      setNailServices(newServices);
    } else {
      const newServices = [...faceBodyServices];
      newServices[index].price = value;
      setFaceBodyServices(newServices);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate salon info
    if (
      !salonInfo.name ||
      !salonInfo.email ||
      !salonInfo.phone ||
      !salonInfo.address ||
      !salonInfo.city ||
      !salonInfo.district ||
      !salonInfo.postalCode
    ) {
      setError("Please fill in all required salon information");
      return;
    }

    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Prepare the services data
      const selectedServices = [
        ...hairServices.filter((service) => service.checked),
        ...nailServices.filter((service) => service.checked),
        ...faceBodyServices.filter((service) => service.checked),
      ];

      // Validate that at least one service is selected
      if (selectedServices.length === 0) {
        setError("Please select at least one service");
        setIsSubmitting(false);
        return;
      }

      // Prepare salon data for API
      const salonData = {
        ...salonInfo,
        services: selectedServices.map((service) => ({
          name: service.name,
          category: service.category,
          minDuration: service.minDuration,
          maxDuration: service.maxDuration,
          price: service.price,
        })),
      };

      // Create the salon
      const response = await salonAPI.createSalon(salonData);

      if (response) {
        // Redirect to dashboard
        router.push("/dashboard/business");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create salon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-pink-50 flex items-center justify-center py-12">
        <div className="max-w-2xl w-full mx-4">
          <div className="bg-white rounded-xl shadow-md p-8">
            {step === 1 ? (
              <>
                <h1 className="text-2xl font-bold text-center mb-2">
                  Salon Information
                </h1>
                <p className="text-center text-gray-600 mb-8">
                  Enter the details of your salon
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleNextStep} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="name"
                      >
                        Salon Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.name}
                        onChange={handleSalonInfoChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="slogan"
                      >
                        Slogan
                      </label>
                      <input
                        type="text"
                        id="slogan"
                        name="slogan"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.slogan}
                        onChange={handleSalonInfoChange}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="gender"
                      >
                        Gender Type *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.gender}
                        onChange={handleSalonInfoChange}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unisex">Unisex</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="email"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.email}
                        onChange={handleSalonInfoChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="phone"
                      >
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.phone}
                        onChange={handleSalonInfoChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="address"
                      >
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.address}
                        onChange={handleSalonInfoChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="district"
                      >
                        District *
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.district}
                        onChange={handleSalonInfoChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="city"
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.city}
                        onChange={handleSalonInfoChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="postalCode"
                      >
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salonInfo.postalCode}
                        onChange={handleSalonInfoChange}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors w-full"
                  >
                    Next: Choose Services
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-center mb-2">
                  Enter Approximate Time
                </h1>
                <p className="text-center text-gray-600 mb-8">
                  Enter approximate time for the selected services
                </p>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Hair Styling Services */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Hair Styling</h2>
                    <div className="space-y-3">
                      {hairServices.map((service, index) => (
                        <div
                          key={`hair-${index}`}
                          className="flex flex-col md:flex-row md:items-center gap-4"
                        >
                          <label className="flex items-center gap-2 md:w-1/3">
                            <input
                              type="checkbox"
                              className="form-checkbox text-pink-500"
                              checked={service.checked}
                              onChange={(e) =>
                                handleServiceCheck(
                                  index,
                                  "hair",
                                  e.target.checked
                                )
                              }
                            />
                            <span>{service.name}</span>
                          </label>
                          <div className="flex flex-wrap items-center gap-2 md:w-2/3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="__"
                                className="w-16 input-field"
                                value={service.minDuration || ""}
                                onChange={(e) =>
                                  handleDurationChange(
                                    index,
                                    "hair",
                                    "minDuration",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />{" "}
                              MIN -
                              <input
                                type="number"
                                placeholder="__"
                                className="w-16 input-field"
                                value={service.maxDuration || ""}
                                onChange={(e) =>
                                  handleDurationChange(
                                    index,
                                    "hair",
                                    "maxDuration",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />{" "}
                              MIN
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              <span>$</span>
                              <input
                                type="number"
                                placeholder="Price"
                                className="w-16 input-field"
                                value={service.price || ""}
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    "hair",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nails Services */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Nails</h2>
                    <div className="space-y-3">
                      {nailServices.map((service, index) => (
                        <div
                          key={`nail-${index}`}
                          className="flex flex-col md:flex-row md:items-center gap-4"
                        >
                          <label className="flex items-center gap-2 md:w-1/3">
                            <input
                              type="checkbox"
                              className="form-checkbox text-pink-500"
                              checked={service.checked}
                              onChange={(e) =>
                                handleServiceCheck(
                                  index,
                                  "nails",
                                  e.target.checked
                                )
                              }
                            />
                            <span>{service.name}</span>
                          </label>
                          <div className="flex flex-wrap items-center gap-2 md:w-2/3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="__"
                                className="w-16 input-field"
                                value={service.minDuration || ""}
                                onChange={(e) =>
                                  handleDurationChange(
                                    index,
                                    "nails",
                                    "minDuration",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />{" "}
                              MIN -
                              <input
                                type="number"
                                placeholder="__"
                                className="w-16 input-field"
                                value={service.maxDuration || ""}
                                onChange={(e) =>
                                  handleDurationChange(
                                    index,
                                    "nails",
                                    "maxDuration",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />{" "}
                              MIN
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              <span>$</span>
                              <input
                                type="number"
                                placeholder="Price"
                                className="w-16 input-field"
                                value={service.price || ""}
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    "nails",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Face and Body Services */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Face and Body
                    </h2>
                    <div className="space-y-3">
                      {faceBodyServices.map((service, index) => (
                        <div
                          key={`face-${index}`}
                          className="flex flex-col md:flex-row md:items-center gap-4"
                        >
                          <label className="flex items-center gap-2 md:w-1/3">
                            <input
                              type="checkbox"
                              className="form-checkbox text-pink-500"
                              checked={service.checked}
                              onChange={(e) =>
                                handleServiceCheck(
                                  index,
                                  "faceBody",
                                  e.target.checked
                                )
                              }
                            />
                            <span>{service.name}</span>
                          </label>
                          <div className="flex flex-wrap items-center gap-2 md:w-2/3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="__"
                                className="w-16 input-field"
                                value={service.minDuration || ""}
                                onChange={(e) =>
                                  handleDurationChange(
                                    index,
                                    "faceBody",
                                    "minDuration",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />{" "}
                              MIN -
                              <input
                                type="number"
                                placeholder="__"
                                className="w-16 input-field"
                                value={service.maxDuration || ""}
                                onChange={(e) =>
                                  handleDurationChange(
                                    index,
                                    "faceBody",
                                    "maxDuration",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />{" "}
                              MIN
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              <span>$</span>
                              <input
                                type="number"
                                placeholder="Price"
                                className="w-16 input-field"
                                value={service.price || ""}
                                onChange={(e) =>
                                  handlePriceChange(
                                    index,
                                    "faceBody",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                disabled={!service.checked}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="border border-pink-500 text-pink-500 px-6 py-2 rounded-full hover:bg-pink-50 transition-colors w-1/2"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors w-1/2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Setting Up..." : "Create Salon"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
