"use client";

import { useEffect, useState } from "react";

interface Photo {
  filename: string;
  url: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch("/api/photos/get");
        const data = await response.json();

        if (response.ok) {
          setPhotos(data.photos);
        } else {
          setError("Error loading photos");
        }
      } catch (error) {
        setError("Error loading photos");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Close modal when clicking escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const getImageTitle = (filename: string) => {
    // Remove timestamp and file extension
    const cleanName = filename
      .replace(/^\d+-/, "") // Remove timestamp prefix
      .replace(/\.[^/.]+$/, ""); // Remove file extension
    return cleanName;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold m-12 pb-20 text-center">EPL INTERNATIONAL PRO PLAYER EXPERIENCE</h1>

        {photos.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No photos available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {photos.map((photo) => (
              <div
                key={photo.filename}
                className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={photo.url}
                    alt={getImageTitle(photo.filename)}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity" />
                 
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-7xl max-h-[90vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={getImageTitle(selectedPhoto.filename)}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
