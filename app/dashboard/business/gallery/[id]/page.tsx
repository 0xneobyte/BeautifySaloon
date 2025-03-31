"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { salonAPI } from "@/utils/api";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

interface GalleryImage {
  _id?: string;
  url: string;
}

interface Salon {
  _id: string;
  name: string;
  gallery: GalleryImage[];
}

export default function ManageGallery() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      setUploadError("");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!salon) return;

    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Remove image from array
      const updatedGallery = salon.gallery.filter(
        (image) => image._id !== imageId
      );

      // Update salon with removed image
      await salonAPI.updateSalon(id, {
        gallery: updatedGallery,
      });

      // Refresh salon data
      fetchSalon();

      // Show success message
      alert("Image deleted successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadError("Please select at least one file to upload");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError("");

      // Create a FormData instance
      const formData = new FormData();

      // Append each file to FormData
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("gallery", selectedFiles[i]);
      }

      // Upload images to server
      const response = await salonAPI.uploadGallery(
        id,
        formData,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (response && response.success) {
        // Reset file input
        setSelectedFiles(null);
        const fileInput = document.getElementById(
          "gallery-upload"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }

        // Refresh salon data
        fetchSalon();

        // Show success message
        alert("Images uploaded successfully!");
      } else {
        setUploadError("Failed to upload images");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
              Manage Gallery
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
                    {salon.name} - Gallery
                  </h2>

                  {salon.gallery.length === 0 ? (
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-600">
                        No gallery images added yet.
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Add your first image using the form below.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {salon.gallery.map((image) => (
                        <div
                          key={image._id}
                          className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                        >
                          <Image
                            src={image.url}
                            alt="Gallery Image"
                            className="object-cover"
                            fill
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              onClick={() => handleDeleteImage(image._id!)}
                              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                              title="Delete Image"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Upload New Images
                  </h3>

                  <form onSubmit={handleUpload} className="space-y-4">
                    {uploadError && (
                      <div className="bg-red-50 text-red-600 p-3 rounded">
                        {uploadError}
                      </div>
                    )}

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="gallery-upload"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="gallery-upload"
                        className="cursor-pointer flex flex-col items-center justify-center"
                      >
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-gray-600 font-medium">
                          Click to upload images
                        </span>
                        <span className="text-gray-500 text-sm mt-1">
                          PNG, JPG, JPEG up to 5MB
                        </span>
                      </label>
                    </div>

                    {selectedFiles && selectedFiles.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-700 font-medium">
                          {selectedFiles.length}{" "}
                          {selectedFiles.length === 1 ? "file" : "files"}{" "}
                          selected
                        </p>
                        <ul className="text-sm text-blue-600 mt-1">
                          {Array.from(selectedFiles).map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {isUploading && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 text-center">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors"
                        disabled={isUploading || !selectedFiles}
                      >
                        {isUploading ? "Uploading..." : "Upload Images"}
                      </button>
                    </div>
                  </form>
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
