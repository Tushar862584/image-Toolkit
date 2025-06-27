"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState("");

  const handleNavigate = (path) => {
    setLoading(path);
    setTimeout(() => router.push(path), 600); // Delay to show animation
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1f1c2c] to-[#928dab] flex items-center justify-center px-6 text-white">
      <div className="max-w-5xl w-full text-center space-y-10">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300 animate-fade-in">
          Welcome to Smart Image Toolkit
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in delay-150">
          Resize or Compress your images with precision and ease. Choose your service below.
        </p>

        <div className="grid md:grid-cols-2 gap-8 pt-6 animate-fade-in delay-300">
          <div
            onClick={() => handleNavigate("/resize")}
            className={`cursor-pointer bg-gradient-to-br from-purple-700 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 rounded-3xl shadow-lg p-8 border border-white/10 backdrop-blur-md ${loading === "/resize" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <h2 className="text-2xl font-bold mb-2">🖼️ Resize Image</h2>
            <p className="text-sm text-gray-300">Upload an image and resize it to predefined or custom dimensions.</p>
            {loading === "/resize" && <div className="mt-4 animate-pulse text-pink-300 text-xs">Loading Resize...</div>}
          </div>

          <div
            onClick={() => handleNavigate("/compress")}
            className={`cursor-pointer bg-gradient-to-br from-pink-600 to-yellow-500 hover:from-yellow-500 hover:to-pink-600 transition-all duration-300 rounded-3xl shadow-lg p-8 border border-white/10 backdrop-blur-md ${loading === "/compress" ? "opacity-50 pointer-events-none" : ""}`}
          >
            <h2 className="text-2xl font-bold mb-2">📦 Compress Image</h2>
            <p className="text-sm text-gray-300">Reduce image file size with quality control and fast compression.</p>
            {loading === "/compress" && <div className="mt-4 animate-pulse text-yellow-200 text-xs">Loading Compress...</div>}
          </div>
        </div>

        <div className="pt-10">
          <p className="text-xs text-gray-400">Your images are processed securely and never stored. 100% client privacy guaranteed.</p>
        </div>
      </div>
    </main>
  );
}