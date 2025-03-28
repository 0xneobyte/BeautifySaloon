import Navbar from "../../../components/Navbar";
import Link from "next/link";

export default function BusinessSetup() {
  return (
    <main>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-pink-50 flex items-center justify-center py-12">
        <div className="max-w-2xl w-full mx-4">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-2">
              Enter Approximate Time
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Enter Approximate time for the selected Service
            </p>

            <form className="space-y-8">
              {/* Hair Styling Services */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Hair Styling</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>Men's Haircut</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>full color</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>keratin Treatment</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>
                </div>
              </div>

              {/* Nails Services */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Nails</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>Basic Manicure</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>Basic pedicure</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>Hand painted nail art</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>
                </div>
              </div>

              {/* Face and Body Services */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Face and Body</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>Basic Facial</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>Eyebrow waxing</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox text-pink-500"
                      />
                      <span>Eyebrow Threading</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN -
                      <input
                        type="number"
                        placeholder="__"
                        className="w-16 input-field"
                      />{" "}
                      MIN
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full">
                SetUp Page
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
