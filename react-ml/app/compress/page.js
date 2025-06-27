"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompressorPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedImageUrl, setCompressedImageUrl] = useState(null);
  const [compressedImageName, setCompressedImageName] = useState("");
  const [quality, setQuality] = useState(75);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCompress = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("quality", quality);

    const res = await fetch("http://localhost:5000/compress", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    if (!res.ok) {
      setMessage("❌ Compression failed. Please try again.");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setCompressedImageUrl(url);
    setCompressedImageName(`compressed_${selectedFile.name}`);
    setMessage("✅ Image compressed successfully!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1f1c2c] to-[#928dab] flex items-center justify-center text-white px-4">
      <div className="max-w-3xl w-full text-center space-y-10">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
          Smart Image Compressor
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto">
          Reduce file size while preserving image quality. Fast, efficient, and secure.
        </p>

        <div className="bg-black/30 rounded-3xl p-8 shadow-lg backdrop-blur-md">
          <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-yellow-500 hover:from-yellow-500 hover:to-pink-600 text-white font-medium px-6 py-3 rounded-full transition-all duration-300">
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

          <div className="mt-8">
            <label htmlFor="quality" className="block mb-2 text-sm text-gray-300">Compression Quality ({quality}%)</label>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="w-full"
            />
            <button
              onClick={handleCompress}
              disabled={loading}
              className={`mt-4 bg-white text-black font-semibold px-8 py-3 rounded-full transition-all duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            >
              {loading ? "Compressing..." : "Compress Image"}
            </button>
          </div>

          {message && (
            <div className="mt-4 text-sm font-medium text-center text-yellow-300">
              {message}
            </div>
          )}

          {compressedImageUrl && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-gray-300">Compressed image preview:</p>
              <img
                src={compressedImageUrl}
                alt="Compressed Preview"
                className="mx-auto rounded-lg max-w-full h-auto border border-white/10"
              />
              <a
                href={compressedImageUrl}
                download={compressedImageName}
                className="inline-block mt-2 bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-pink-500 hover:to-yellow-400 text-white font-medium px-6 py-2 rounded-full transition-all duration-200"
              >
                Download {compressedImageName}
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