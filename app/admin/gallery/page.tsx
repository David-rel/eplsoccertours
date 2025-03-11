"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Photo {
  filename: string;
  url: string;
}

export default function AdminGalleryPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check localStorage on initial load
  useEffect(() => {
    const storedUsername = localStorage.getItem("admin_username");
    const storedPassword = localStorage.getItem("admin_password");

    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      handleLoginWithCredentials(storedUsername, storedPassword);
    } else {
      // Redirect to admin login if no credentials
      router.push("/admin");
    }
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos/get");
      const data = await response.json();
      if (response.ok) {
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPhotos();
    }
  }, [isAuthenticated]);

  const handleLoginWithCredentials = async (
    usernameValue: string,
    passwordValue: string
  ) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${usernameValue}:${passwordValue}`),
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        // Save to localStorage
        localStorage.setItem("admin_username", usernameValue);
        localStorage.setItem("admin_password", passwordValue);
        setMessage("");
      } else {
        setMessage("Invalid credentials");
        // Redirect to admin login if invalid credentials
        router.push("/admin");
      }
    } catch (error) {
      setMessage("Error during authentication");
      // Redirect to admin login if authentication error
      router.push("/admin");
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_password");
    setUsername("");
    setPassword("");
    setIsAuthenticated(false);
    router.push("/admin");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);

    try {
      const response = await fetch("/api/photos/add", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Photo uploaded successfully!");
        e.target.reset();
        // Refresh the photos list
        fetchPhotos();
      } else {
        setMessage(data.error || "Error uploading photo");
      }
    } catch (error) {
      setMessage("Error uploading photo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    try {
      console.log("Attempting to delete:", filename);
      const response = await fetch("/api/photos/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
        body: JSON.stringify({ filename }),
      });

      const data = await response.json();
      console.log("Delete response:", { status: response.status, data });

      if (response.ok) {
        setMessage("Photo deleted successfully!");
        // Refresh the photos list
        fetchPhotos();
      } else {
        setMessage(data.error || "Error deleting photo");
        console.error("Delete failed:", data.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Error deleting photo");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Verifying credentials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <div className="flex space-x-4">
            <Link
              href="/admin"
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Admin Home
            </Link>
            <Link
              href="/admin/events"
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Manage Events
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Upload New Photo</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                name="file"
                accept="image/*"
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Uploading..." : "Upload Photo"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-sm ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Manage Gallery Photos</h2>
          {photos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No photos uploaded yet
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.filename}
                  className="relative group rounded-lg overflow-hidden bg-gray-100"
                >
                  <div className="aspect-square relative">
                    <img
                      src={photo.url}
                      alt={`Gallery photo ${photo.filename}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDelete(photo.filename)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
