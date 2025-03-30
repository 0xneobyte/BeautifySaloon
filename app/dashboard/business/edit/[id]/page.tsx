"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { salonAPI } from "@/utils/api";
import { uploadAPI } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

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

export default function EditSalon() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // basic, services, gallery
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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
        // Set logo preview if exists
        if (response.salon.logo) {
          setLogoPreview(response.salon.logo);
        }
        // Set gallery previews if exist
        if (response.salon.gallery && response.salon.gallery.length > 0) {
          setGalleryPreviews(response.salon.gallery);
        }
      } else {
        setError("Salon not found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load salon");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryPreview = (index: number) => {
    // Remove from previews
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));

    // If it's a new file (not yet uploaded), remove from files array
    if (index < galleryFiles.length) {
      setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon) return;

    try {
      setIsSubmitting(true);
      setError("");

      // Upload logo if changed
      let logoUrl = salon.logo;
      if (logoFile) {
        const logoResponse = await uploadAPI.uploadImage(logoFile, "logo");
        if (logoResponse && logoResponse.url) {
          logoUrl = logoResponse.url;
        }
      }

      // Prepare salon data
      const updatedData = {
        ...salon,
        logo: logoUrl,
      };

      // Update salon
      await salonAPI.updateSalon(id, updatedData);

      // Refresh salon data
      fetchSalon();

      // Show success message
      alert("Salon information updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update salon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon) return;

    try {
      setIsSubmitting(true);
      setError("");
      setUploadProgress(0);

      // Upload new gallery images
      const newGalleryUrls: string[] = [];

      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        const galleryResponse = await uploadAPI.uploadImage(file, "gallery");
        if (galleryResponse && galleryResponse.url) {
          newGalleryUrls.push(galleryResponse.url);
        }
        // Update progress
        setUploadProgress(Math.round(((i + 1) / galleryFiles.length) * 100));
      }

      // Combine existing gallery with new uploads
      const existingGallery = salon.gallery || [];
      const filteredGallery = existingGallery.filter((url) =>
        galleryPreviews.includes(url)
      );
      const updatedGallery = [...filteredGallery, ...newGalleryUrls];

      // Update salon
      await salonAPI.updateSalon(id, {
        gallery: updatedGallery,
      });

      // Reset gallery files after upload
      setGalleryFiles([]);

      // Refresh salon data
      fetchSalon();

      // Show success message
      alert("Gallery updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update gallery");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleSalonChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (salon) {
      setSalon({
        ...salon,
        [name]: value,
      });
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

  if (error || !salon) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p>{error || "Salon not found"}</p>
            <Link
              href="/dashboard/business"
              className="text-pink-500 hover:underline mt-4 inline-block"
            >
              Return to dashboard
            </Link>
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Salon</h1>
            <Link
              href="/dashboard/business"
              className="text-pink-500 hover:text-pink-700"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`px-4 py-4 font-medium text-sm ${
                    activeTab === "basic"
                      ? "border-b-2 border-pink-500 text-pink-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Basic Information
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`px-4 py-4 font-medium text-sm ${
                    activeTab === "services"
                      ? "border-b-2 border-pink-500 text-pink-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`px-4 py-4 font-medium text-sm ${
                    activeTab === "gallery"
                      ? "border-b-2 border-pink-500 text-pink-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Photos & Gallery
                </button>
              </nav>
            </div>

            {/* Basic Information Form */}
            {activeTab === "basic" && (
              <div className="p-6">
                <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="name"
                      >
                        Salon Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salon.name}
                        onChange={handleSalonChange}
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
                        value={salon.slogan || ""}
                        onChange={handleSalonChange}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="gender"
                      >
                        Gender Type
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salon.gender}
                        onChange={handleSalonChange}
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
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salon.email}
                        onChange={handleSalonChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="phone"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salon.phone}
                        onChange={handleSalonChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="address"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salon.address}
                        onChange={handleSalonChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="district"
                      >
                        District
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salon.district}
                        onChange={handleSalonChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="city"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salon.city}
                        onChange={handleSalonChange}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block text-gray-700 mb-2"
                        htmlFor="postalCode"
                      >
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={salon.postalCode}
                        onChange={handleSalonChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Salon Logo</h3>
                    <div className="flex items-start gap-6">
                      <div className="w-32 h-32 relative overflow-hidden rounded-lg border border-gray-300">
                        {logoPreview ? (
                          <Image
                            src={logoPreview}
                            alt="Salon Logo"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">No logo</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={logoInputRef}
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
                        >
                          {logoPreview ? "Change Logo" : "Add Logo"}
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                          Recommended size: 500x500 pixels, max 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Services Form */}
            {activeTab === "services" && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">Manage Services</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Service management coming soon. Please check back later.
                </p>
              </div>
            )}

            {/* Gallery Management */}
            {activeTab === "gallery" && (
              <div className="p-6">
                <form onSubmit={handleGallerySubmit} className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Salon Gallery
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Add photos of your salon, services, and results to
                      showcase your work. Images should be high quality and
                      represent your salon's style and atmosphere.
                    </p>

                    {/* Gallery Upload */}
                    <div className="mb-6">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <div className="mx-auto w-16 h-16 text-gray-400 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-700 mb-2">
                          Drag and drop file here or{" "}
                          <span className="text-pink-500">Browse</span>
                        </p>
                        <p className="text-gray-500 text-sm">
                          Maximum File size: 50MB
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          ref={galleryInputRef}
                          onChange={handleGalleryChange}
                          multiple
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="mt-4 bg-pink-500 bg-opacity-10 hover:bg-opacity-20 text-pink-500 px-6 py-2 rounded-full"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Gallery Preview */}
                    {galleryPreviews.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-4">
                          Gallery Images
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {galleryPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                                <Image
                                  src={preview}
                                  alt={`Gallery image ${index + 1}`}
                                  width={200}
                                  height={200}
                                  className="object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeGalleryPreview(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {isSubmitting && uploadProgress > 0 && (
                      <div className="mt-4">
                        <div className="bg-gray-200 rounded-full h-2.5 mb-2">
                          <div
                            className="bg-pink-500 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 text-right">
                          {uploadProgress}% uploaded
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
                      disabled={isSubmitting || galleryFiles.length === 0}
                    >
                      {isSubmitting ? "Uploading..." : "Save Gallery"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
