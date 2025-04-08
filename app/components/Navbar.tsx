"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, isBusinessUser, isCustomerUser, userDetails } =
    useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isActive = (path: string) => {
    return pathname === path
      ? "text-pink-600 font-bold"
      : "text-gray-700 hover:text-pink-600";
  };

  return (
    <nav
      className={`py-3 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-pink-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Beautify Logo"
                width={196}
                height={64}
                className="h-14 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Main Navigation Links */}
            <Link
              href="/hair-styles"
              className={`${isActive(
                "/hair-styles"
              )} transition-colors duration-200 text-sm font-medium`}
            >
              Hair Styles
            </Link>
            <Link
              href="/nails"
              className={`${isActive(
                "/nails"
              )} transition-colors duration-200 text-sm font-medium`}
            >
              Nails
            </Link>
            <Link
              href="/face-and-body"
              className={`${isActive(
                "/face-and-body"
              )} transition-colors duration-200 text-sm font-medium`}
            >
              Face and Body
            </Link>
            <Link
              href="/discounts"
              className={`${isActive(
                "/discounts"
              )} transition-colors duration-200 text-sm font-medium`}
            >
              Discounts
            </Link>

            {/* Authentication Links */}
            {isAuthenticated ? (
              <div className="relative ml-3 flex items-center space-x-3">
                <Link
                  href={
                    isBusinessUser
                      ? "/dashboard/business"
                      : "/dashboard/customer"
                  }
                  className="flex items-center px-4 py-2 rounded-lg bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors font-medium text-sm"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-pink-600 flex items-center text-sm font-medium"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-pink-600 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-pink-500 hover:bg-pink-50 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-lg border-t border-gray-100`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/hair-styles"
            className={`${
              pathname === "/hair-styles"
                ? "bg-pink-50 text-pink-600"
                : "text-gray-700"
            } block px-3 py-2 rounded-md text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Hair Styles
          </Link>
          <Link
            href="/nails"
            className={`${
              pathname === "/nails"
                ? "bg-pink-50 text-pink-600"
                : "text-gray-700"
            } block px-3 py-2 rounded-md text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Nails
          </Link>
          <Link
            href="/face-and-body"
            className={`${
              pathname === "/face-and-body"
                ? "bg-pink-50 text-pink-600"
                : "text-gray-700"
            } block px-3 py-2 rounded-md text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Face and Body
          </Link>
          <Link
            href="/discounts"
            className={`${
              pathname === "/discounts"
                ? "bg-pink-50 text-pink-600"
                : "text-gray-700"
            } block px-3 py-2 rounded-md text-base font-medium`}
            onClick={() => setIsMenuOpen(false)}
          >
            Discounts
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href={
                  isBusinessUser ? "/dashboard/business" : "/dashboard/customer"
                }
                className="bg-pink-50 text-pink-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 w-full text-left block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-gray-600 hover:text-pink-500 transition-colors block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
