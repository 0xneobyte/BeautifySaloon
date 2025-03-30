import Link from "next/link";
import Image from "next/image";
import { ISalon } from "@/models/Salon";
import { FaStar, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

interface SalonCardProps {
  salon: ISalon;
}

export default function SalonCard({ salon }: SalonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        {salon.logo ? (
          <Image
            src={salon.logo}
            alt={salon.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-pink-100">
            <span className="text-xl font-semibold text-pink-500">
              {salon.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{salon.name}</h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-gray-700">{salon.rating || "New"}</span>
          </div>
        </div>

        {salon.slogan && (
          <p className="text-gray-600 text-sm mb-4 italic">{salon.slogan}</p>
        )}

        <div className="flex items-start mb-2">
          <FaMapMarkerAlt className="text-pink-500 mt-1 mr-2 flex-shrink-0" />
          <p className="text-gray-600 text-sm">
            {salon.address}, {salon.city}, {salon.district} {salon.postalCode}
          </p>
        </div>

        <div className="flex items-center mb-4">
          <FaPhone className="text-pink-500 mr-2 flex-shrink-0" />
          <p className="text-gray-600 text-sm">{salon.phone}</p>
        </div>

        {salon.services && salon.services.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Services:
            </h4>
            <div className="flex flex-wrap gap-2">
              {salon.services.slice(0, 3).map((service, idx) => (
                <span
                  key={idx}
                  className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full"
                >
                  {service.name}
                </span>
              ))}
              {salon.services.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{salon.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <Link
          href={`/salon/${salon._id}`}
          className="block text-center bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors w-full mt-2"
        >
          View Salon
        </Link>
      </div>
    </div>
  );
}
