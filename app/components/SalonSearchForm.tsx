"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SalonSearchFormProps {
  category?: string;
  className?: string;
  buttonText?: string;
}

export default function SalonSearchForm({
  category,
  className = "",
  buttonText = "Search",
}: SalonSearchFormProps) {
  const [searchParams, setSearchParams] = useState({
    name: "",
    city: "",
    postalCode: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build query string for search
    const params = new URLSearchParams();

    if (searchParams.name) {
      params.append("name", searchParams.name);
    }

    if (searchParams.city) {
      params.append("city", searchParams.city);
    }

    if (searchParams.postalCode) {
      params.append("postalCode", searchParams.postalCode);
    }

    // Add category filter if specified
    if (category) {
      params.append("category", category);
    }

    // Redirect to search results
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <h2 className="text-lg font-semibold text-pink-500 mb-4">
        Search and Find The Best Solution For Your Need
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          value={searchParams.name}
          onChange={handleChange}
          placeholder="Search by Salon Name"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
        />
        <input
          type="text"
          name="city"
          value={searchParams.city}
          onChange={handleChange}
          placeholder="Search by City"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
        />
        <input
          type="text"
          name="postalCode"
          value={searchParams.postalCode}
          onChange={handleChange}
          placeholder="Search by Postal Code"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
        />
      </div>
      <button
        type="submit"
        className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors w-full mt-4"
      >
        {buttonText}
      </button>
    </form>
  );
}
