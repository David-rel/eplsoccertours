"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Photo {
  filename: string;
  url: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check localStorage on initial load
  useEffect(() => {
    const storedUsername = localStorage.getItem("admin_username");
    const storedPassword = localStorage.getItem("admin_password");

    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      handleLoginWithCredentials(storedUsername, storedPassword);
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
      }
    } catch (error) {
      setMessage("Error during authentication");
    }
  };

  const handleLogin = () => {
    handleLoginWithCredentials(username, password);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("admin_username");
    localStorage.removeItem("admin_password");
    setUsername("");
    setPassword("");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {message && <p className="text-red-500 text-sm">{message}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Back to Site
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Link
            href="/admin/gallery"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Photo Gallery Management
              </h2>
              <p className="text-gray-600 mb-6">
                Upload, manage and delete photos for the gallery section.
              </p>
              <div className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Manage Gallery
              </div>
            </div>
          </Link>

          <Link
            href="/admin/events"
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Events Management</h2>
              <p className="text-gray-600 mb-6">
                Create, manage and delete events for the events section.
              </p>
              <div className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors">
                Manage Events
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
