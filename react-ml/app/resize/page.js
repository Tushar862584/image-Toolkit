// LandingPage without framer-motion or react-hot-toast
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSize, setSelectedSize] = useState("original");
  const [resizedImageUrl, setResizedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResize = async () => {
    if (!selectedFile || selectedSize === "original") return;

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("size", selectedSize);

    try {
      const res = await fetch("http://localhost:5000/resize", {
        method: "POST",
        body: formData,
      });

      setLoading(false);

      if (!res.ok) {
        setMessage("❌ Resize failed. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const name = selectedFile.name ? `resized_${selectedFile.name}` : "compressed_image.jpg";
      setResizedImageUrl({ url, name });
      setMessage("✅ Image resized successfully!");
    } catch (error) {
      setLoading(false);
      setMessage("❌ Something went wrong.");
    }
  };

  const sizeOptions = [
    "original", "600x600", "827x1063", "2480x3508", "1200x1600", "150x150",
    "413x531", "240x320", "480x640", "720x960", "1080x1350", "1280x1024",
    "1024x1365", "1536x2048", "2048x3072", "2400x3000", "300x360", "150x180",
    "300x300", "640x853", "1080x1440", "1600x2560", "720x1280"
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1f1c2c] to-[#928dab] flex items-center justify-center text-white px-4">
      <div className="max-w-3xl w-full text-center space-y-10">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
          Smart Image Resizer
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto">
          Upload and resize images instantly with pixel-perfect precision. Fast, secure, and free.
        </p>

        <div className="bg-black/30 rounded-3xl p-8 shadow-lg backdrop-blur-md">
          <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-medium px-6 py-3 rounded-full transition-all duration-300">
            <span className="text-xl">📤</span>
            {selectedFile ? "Change Image" : "Upload Image"}
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />

          {selectedFile && (
            <div className="mt-6 text-sm text-gray-300">
              Selected: <span className="font-medium">{selectedFile.name}</span>
            </div>
          )}

          <div className="mt-6">
            <label htmlFor="resize-options" className="block mb-2 text-sm text-gray-300">Choose size:</label>
            <select
              id="resize-options"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {sizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleResize}
            disabled={loading}
            className={`mt-8 bg-white text-black font-semibold px-8 py-3 rounded-full transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
          >
            {loading ? "Resizing..." : "Resize Now"}
          </button>

          {message && (
            <div className="mt-4 text-sm font-medium text-center text-yellow-300">
              {message}
            </div>
          )}

          {resizedImageUrl && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-gray-300">Resized image preview:</p>
              <img
                src={resizedImageUrl.url}
                alt="Resized Preview"
                className="mx-auto rounded-lg max-w-full h-auto border border-white/10"
              />
              <a
                href={resizedImageUrl.url}
                download={resizedImageUrl.name}
                className="inline-block mt-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-medium px-6 py-2 rounded-full transition-all duration-200"
              >
                Download {resizedImageUrl.name}
              </a>
            </div>
          )}

          <div className="mt-10">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-600 hover:to-slate-800 text-white transition duration-200 shadow-md"
            >
              <span className="text-lg">←</span> Back to Home
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
