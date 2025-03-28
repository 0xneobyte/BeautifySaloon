export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-pink-500 mb-4">
          Tailwind Test Page
        </h1>
        <p className="text-gray-600 mb-6">
          If you can see this styled text, Tailwind CSS is working.
        </p>
        <div className="flex gap-4">
          <button className="bg-pink-500 text-white px-4 py-2 rounded-lg">
            Pink Button
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Blue Button
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Green Button
          </button>
        </div>
      </div>
    </div>
  );
}
