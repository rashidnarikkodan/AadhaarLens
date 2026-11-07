import { useState, useRef } from "react";

type Props = {
    setImage: (image: File) => void;
    label?: string;
}

export default function Upload({ setImage, label = "Upload an Image" }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      setImage(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div 
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`group relative flex flex-col items-center justify-center w-full h-44 sm:h-52 md:h-56 rounded-xl transition-all duration-200 overflow-hidden text-zinc-200 cursor-pointer select-none focus:outline-none focus:ring-1 focus:ring-zinc-600 ${
        previewUrl 
          ? "border border-zinc-700/70 bg-zinc-950/60" 
          : "border border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-900/60"
      }`}
    >
      {/* Hidden file input */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        className="hidden"
      />

      {previewUrl ? (
        /* Image fits naturally without ugly stretching or cropped zoom */
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-2.5">
          <img 
            src={previewUrl} 
            alt="Uploaded preview" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />

          {/* Hover overlay indicating click-to-change */}
          <div className="absolute inset-0 bg-zinc-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-300">Click to change</span>
          </div>

          {/* Status badge */}
          <span className="absolute top-2.5 right-2.5 text-[10px] font-medium bg-zinc-900/90 backdrop-blur-md text-zinc-300 border border-zinc-700/80 px-2 py-0.5 rounded-md shadow-sm">
            {label} Ready
          </span>
        </div>
      ) : (
        /* Default Upload Prompt */
        <div className="flex flex-col items-center gap-2 p-4 sm:p-6 text-center pointer-events-none">
          <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-800/70 text-zinc-300 group-hover:text-zinc-100 group-hover:scale-105 transition-all duration-200 border border-zinc-700/50 shadow-sm">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-zinc-200">{label}</h3>
          <p className="text-[11px] sm:text-xs text-zinc-400">Click anywhere to select a file</p>
        </div>
      )}
    </div>
  );
}
