"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import SalonCard from "../components/SalonCard";
import SalonSearchForm from "../components/SalonSearchForm";
import { ISalon } from "@/models/Salon";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Extract search parameters
  const name = searchParams.get("name") || "";
  const city = searchParams.get("city") || "";
  const postalCode = searchParams.get("postalCode") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const fetchSalons = async () => {
      setLoading(true);
      try {
        // Build query string
        const queryParams = new URLSearchParams();
        if (name) queryParams.append("name", name);
        if (city) queryParams.append("city", city);
        if (postalCode) queryParams.append("postalCode", postalCode);
        if (category) queryParams.append("category", category);

        const response = await fetch(`/api/salons?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch salons");
        }

        const data = await response.json();
        // Extract the salons array from the response data
        setSalons(data.salons || []);
      } catch (err) {
        console.error("Error fetching salons:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalons();
  }, [name, city, postalCode, category]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <SalonSearchForm
            category={category}
            buttonText="Update Search"
            className="mb-4"
          />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            {salons.length === 0 && !loading
              ? "No salons found matching your search criteria."
              : `Found ${salons.length} salon${
                  salons.length !== 1 ? "s" : ""
                } matching your search criteria.`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <SalonCard key={salon._id} salon={salon} />
            ))}
          </div>
        )}

        {salons.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              No salons found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or explore other categories.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/hair-styles"
                className="bg-pink-100 text-pink-600 px-6 py-2 rounded-full hover:bg-pink-200 transition-colors"
              >
                Hair Styles
              </a>
              <a
                href="/nails"
                className="bg-pink-100 text-pink-600 px-6 py-2 rounded-full hover:bg-pink-200 transition-colors"
              >
                Nails
              </a>
              <a
                href="/face-and-body"
                className="bg-pink-100 text-pink-600 px-6 py-2 rounded-full hover:bg-pink-200 transition-colors"
              >
                Face & Body
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
