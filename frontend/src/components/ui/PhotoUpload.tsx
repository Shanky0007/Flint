import { useState, useRef } from "react";
import type { DragEvent } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({
  photos,
  onPhotosChange,
  maxPhotos = 6,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files: File[]) => {
    // Validate file types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length === 0) {
      alert("Please select valid image files (JPEG, PNG, or WebP)");
      return;
    }

    // Check if adding these files would exceed max photos
    if (photos.length + validFiles.length > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos`);
      return;
    }

    // Check file sizes (5MB max)
    const oversizedFiles = validFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      alert("Some files are too large. Maximum size is 5MB per file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3001/api/upload/photos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onPhotosChange([...photos, ...data.urls]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photos. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      {photos.length < maxPhotos && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-primary dark:border-primary-500 bg-primary/5 dark:bg-primary-500/10"
              : "border-primary-200 dark:border-dark-border hover:border-primary dark:hover:border-primary-500"
          } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <div className="w-12 h-12 border-4 border-primary dark:border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary-500/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary dark:text-primary-500" />
                </div>
                <div>
                  <p className="text-base font-medium text-[#1A1A1A] dark:text-dark-text">
                    Drop photos here or click to browse
                  </p>
                  <p className="text-sm text-[#6B8F60] dark:text-primary-600 mt-1">
                    JPEG, PNG, or WebP • Max 5MB per file • Up to {maxPhotos}{" "}
                    photos
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#4A4A4A] dark:text-dark-text-secondary">
                  <ImageIcon className="w-4 h-4" />
                  {photos.length}/{maxPhotos} photos uploaded
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-primary-200 dark:border-dark-border"
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/150?text=Error";
                }}
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                Photo {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
