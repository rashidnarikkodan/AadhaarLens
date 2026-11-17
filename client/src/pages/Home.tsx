import { useState } from "react";
import Upload from "../components/Upload";
import { uploadAadhaar } from "../services/api";
import type { Details } from "../types";

export default function Home() {
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);

  const [details, setDetails] = useState<Details | Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!front || !back) return;

    if (front.name === back.name && front.size === back.size && front.lastModified === back.lastModified) {
      setDetails({
        success: false,
        message: "Front and back uploads cannot be the same file",
        errors: ["Please select distinct front and back Aadhaar images."],
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("front", front);
    formData.append("back", back);
    try {
      const response = await uploadAadhaar(formData);
      if (response.success && response.data) {
        setDetails(response.data);
      } else {
        setDetails(response);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setDetails({
        success: false,
        message: "Failed to connect to verification server",
      });
    } finally {
      setLoading(false);
    }
  };

  const isError = Boolean(
    details &&
      typeof details === "object" &&
      "success" in details &&
      !(details as { success?: boolean }).success
  );

  return (
    <main className="relative bg-zinc-950 w-full min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row text-zinc-100 select-none">
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
                <span className="text-[10px] sm:text-[11px] text-zinc-500">
                  Photo &amp; UID
                </span>
              </div>
              <Upload
                label="Front Side"
                setImage={(image) => setFront(image)}
              />
            </div>

            {/* Back Card with Label */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-0.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  Back Side
                </label>
                <span className="text-[10px] sm:text-[11px] text-zinc-500">
                  Address &amp; QR Code
                </span>
              </div>
              <Upload label="Back Side" setImage={(image) => setBack(image)} />
            </div>
          </div>

          {/* Upload Button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || !front || !back}
            className={`w-full py-2.5 sm:py-3 px-5 rounded-xl font-medium text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
              front && back && !loading
                ? "bg-zinc-100 hover:bg-white text-zinc-950 cursor-pointer active:scale-[0.99]"
                : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                <span>Upload</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Responsive Divider: Horizontal on Mobile, Vertical on Desktop */}
      <div className="border-b md:border-b-0 md:border-r border-zinc-800 w-full md:w-px md:h-full" />

      {/* Section 2: JSON Response */}
      <section className="w-full md:flex-1 py-8 min-h-[160px] flex flex-col bg-zinc-950 border border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
          <span className="text-sm font-semibold text-zinc-300">
            JSON Response
          </span>
          <button
            onClick={() =>
              details && navigator.clipboard.writeText(JSON.stringify(details, null, 2))
            }
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Copy
          </button>
        </div>

        <pre
          className={`p-5 text-sm leading-7 ${
            isError ? "text-red-400" : "text-emerald-400"
          } overflow-auto whitespace-pre-wrap break-words`}
        >
          <code>{details ? JSON.stringify(details, null, 2) : "// Awaiting document upload"}</code>
        </pre>
      </section>
    </main>
  );
}
