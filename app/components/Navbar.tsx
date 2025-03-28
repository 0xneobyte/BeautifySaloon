import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-pink-500">Beautify</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/hair-styles"
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              Hair Styles
            </Link>
            <Link
              href="/nails"
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              Nails
            </Link>
            <Link
              href="/face-and-body"
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              Face and Body
            </Link>
            <Link
              href="/discounts"
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              Discounts
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-pink-500 transition-colors"
            >
              login
            </Link>
            <Link
              href="/signup"
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
