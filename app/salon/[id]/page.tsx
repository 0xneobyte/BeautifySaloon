"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { salonAPI } from "@/utils/api";
import { useParams } from "next/navigation";

// Types for salon data
interface Service {
  name: string;
  category: string;
  minDuration: number;
  maxDuration: number;
  price: number;
  description?: string;
}

interface Review {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Salon {
  _id: string;
  name: string;
  slogan?: string;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
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
  reviews?: Review[];
}

export default function SalonProfile() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        setLoading(true);
        const response = await salonAPI.getSalon(id);
        if (response.salon) {
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

    if (id) {
      fetchSalon();
    }
  }, [id]);

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
          <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-md">
            <svg
              className="w-20 h-20 text-red-500 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Salon Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error?.includes("ObjectId failed")
                ? "The salon ID you're looking for appears to be invalid."
                : error ||
                  "We couldn't find the salon you're looking for. It may have been removed or the link is incorrect."}
            </p>
            <Link
              href="/"
              className="bg-pink-500 text-white px-6 py-3 rounded-full font-medium hover:bg-pink-600 transition-colors shadow-md inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Calculate overall rating
  const overallRating = salon.rating || 0;

  // Generate stars based on rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  return (
    <main>
      <Navbar />

      {/* Hero Section with Cover Image */}
      <div className="relative h-80 overflow-hidden bg-gradient-to-r from-pink-200 to-pink-400">
        {salon.logo ? (
          <Image
            src={salon.logo}
            alt={salon.name}
            className="object-cover w-full h-full"
            width={1920}
            height={480}
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-pink-300 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{salon.name}</h1>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Salon Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    <span className="text-black">{salon.name},</span>
                  </h1>
                  {salon.slogan && (
                    <p className="text-gray-600 mb-4">
                      <span className="text-pink-500">Elevating</span>{" "}
                      <span className="font-semibold">Style</span>, Defining{" "}
                      <span className="font-semibold">You</span>
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <a href="#" className="text-gray-600 hover:text-gray-800">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 5.46l-2 2V5c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-7.76l2-2V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v.46zm-2 .54l-8 8-1.24-1.24L15.46 8l-2-2L19 1.54l2 2-2 2.46z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-800">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 5.5 4.46 9.96 9.96 9.96 5.5 0 9.96-4.46 9.96-9.96 0-5.5-4.46-9.96-9.96-9.96zm3.55 13.48h-7.1c-.33 0-.6-.27-.6-.6v-3.8c0-.33.27-.6.6-.6h1.1v-1.5c0-1.37 1.12-2.5 2.5-2.5s2.5 1.13 2.5 2.5v1.5h1.1c.33 0 .6.27.6.6v3.8c0 .33-.27.6-.6.6z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-800">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span>{salon.gender}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                    {salon.address}, {salon.city}, {salon.district}{" "}
                    {salon.postalCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{salon.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{salon.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V5zm0 8a.75.75 0 00-1.5 0v.01a.75.75 0 001.5 0V13z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="flex items-center">
                    <span className="font-semibold mr-2">
                      {overallRating.toFixed(1)}
                    </span>
                    <span className="flex">
                      {renderStars(Math.round(overallRating))}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {salon.reviews?.length || 0} reviews
                    </span>
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Link
                  href={`/appointment?salon=${salon._id}`}
                  className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
                >
                  Make an Appointment
                </Link>
                <button className="border border-pink-500 text-pink-500 px-6 py-2 rounded-full hover:bg-pink-50 transition-colors">
                  View Salon Gallery
                </button>
              </div>
            </div>

            <div className="md:w-1/3">
              {salon.logo ? (
                <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
                  <Image
                    src={salon.logo}
                    alt={salon.name}
                    width={300}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-2 border-b border-gray-200 pb-2">
            <span className="border-b-2 border-pink-500 pb-2">Salon</span>{" "}
            <span className="text-pink-500">Gallery</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {salon.gallery && salon.gallery.length > 0
              ? salon.gallery.map((image, i) => (
                  <div
                    key={i}
                    className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={image}
                      alt={`Salon gallery image ${i + 1}`}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))
              : // Show at least 6 placeholder images
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100"
                    >
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
          </div>
          <div className="text-center mt-6">
            <button className="bg-pink-500 bg-opacity-10 hover:bg-opacity-20 text-pink-500 px-6 py-2 rounded-full transition-colors">
              View All+
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-8">
            <span className="text-black">Customer</span>{" "}
            <span className="text-pink-500">Reviews</span> And{" "}
            <span className="text-pink-500">FeedBacks</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {salon.reviews && salon.reviews.length > 0
              ? salon.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {review.customer.firstName.charAt(0)}
                        {review.customer.lastName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {review.customer.firstName} {review.customer.lastName}
                        </h3>
                        <div className="flex text-yellow-400">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">"{review.comment}"</p>
                  </div>
                ))
              : // Show placeholder reviews if none exist
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                        <div>
                          <h3 className="font-semibold">Customer Name</h3>
                          <div className="flex text-yellow-400">
                            {renderStars(5)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400">
                        No reviews yet. Be the first to review this salon!
                      </p>
                    </div>
                  ))}
          </div>
        </div>
      </section>
    </main>
  );
}
