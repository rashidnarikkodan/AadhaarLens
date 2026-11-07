import { useState } from "react";
import Upload from "../components/Upload";

export default function Home() {
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);

  const handleUpload = () => {
    if (!front && !back) return;
    console.log("Uploaded documents:", { front, back });
  };

  return (
    <div className="relative bg-zinc-950 w-full min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row text-zinc-100 select-none">
      {/* Top Left Brand */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-6 md:top-6 md:left-12 z-10">
        <span className="text-lg sm:text-xl font-bold tracking-tight text-zinc-100">
          AadhaarLens
        </span>
      </div>

      {/* Section 1: Uploads Panel (Responsive Stack on Mobile, Half-Screen on Desktop) */}
      <section className="w-full md:w-1/2 min-h-screen md:min-h-0 md:h-full flex flex-col items-center justify-center pt-16 pb-8 px-4 sm:px-6 md:py-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-3.5 sm:gap-4">
          {/* Section Header */}
          <div className="space-y-0.5 sm:space-y-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <span>Document Upload</span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                Aadhaar
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-zinc-400">
              Upload clear front and back images for verification
            </p>
          </div>

          {/* Upload Cards with Labels */}
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {/* Front Card with Label */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  Front Side
                </label>
                <span className="text-[10px] sm:text-[11px] text-zinc-500">Photo &amp; UID</span>
              </div>
              <Upload label="Front Side" setImage={(image) => setFront(image)} />
            </div>

            {/* Back Card with Label */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  Back Side
                </label>
                <span className="text-[10px] sm:text-[11px] text-zinc-500">Address &amp; QR Code</span>
              </div>
              <Upload label="Back Side" setImage={(image) => setBack(image)} />
            </div>
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!front && !back}
            className={`w-full py-2.5 sm:py-3 px-5 rounded-xl font-medium text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
              front || back
                ? "bg-zinc-100 hover:bg-white text-zinc-950 cursor-pointer active:scale-[0.99]"
                : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload</span>
          </button>
        </div>
      </section>

      {/* Responsive Divider: Horizontal on Mobile, Vertical on Desktop */}
      <div className="border-b md:border-b-0 md:border-r border-zinc-800 w-full md:w-px md:h-full" />

      {/* Section 2: Minimal Placeholder */}
      <section className="w-full md:flex-1 py-12 md:py-0 min-h-[160px] md:min-h-0 flex items-center justify-center text-zinc-700 text-3xl sm:text-4xl font-bold">
        2
      </section>
    </div>
  );
}
