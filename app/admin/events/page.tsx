"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Event {
  id: number;
  name: string;
  description: string;
  pricePerPerson: number;
  coverImage: string;
  paymentLink?: string;
  startDate: string;
  endDate: string;
  minAge: number;
  maxAge: number;
}

export default function EventsAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pricePerPerson: 0,
    coverImage: "",
    paymentLink: "",
    startDate: "",
    endDate: "",
    minAge: 0,
    maxAge: 99,
  });
  const [generatingPaymentLink, setGeneratingPaymentLink] = useState(false);
  const router = useRouter();

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

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events/get");
      const data = await response.json();
      if (response.ok) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "pricePerPerson" || name === "minAge" || name === "maxAge"
          ? parseFloat(value)
          : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      pricePerPerson: 0,
      coverImage: "",
      paymentLink: "",
      startDate: "",
      endDate: "",
      minAge: 0,
      maxAge: 99,
    });
    setEditingEventId(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      setMessage("Please select an image to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/events/upload", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setFormData((prev) => ({ ...prev, coverImage: data.path }));
        setMessage("Image uploaded successfully!");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage(data.error || "Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image");
    } finally {
      setUploading(false);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const generateBryteWireLink = async () => {
    console.log("Generate button clicked");
    console.log("Form data:", {
      name: formData.name,
      price: formData.pricePerPerson,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });

    if (!formData.name || formData.pricePerPerson <= 0) {
      const missing = [];
      if (!formData.name) missing.push("event name");
      if (formData.pricePerPerson <= 0) missing.push("price per person");

      setMessage(`Please fill in required fields: ${missing.join(", ")}`);
      return;
    }

    setGeneratingPaymentLink(true);
    setMessage("Generating payment link...");

    try {
      console.log("Sending API request to generate payment link...");
      const response = await fetch("/api/brytewire/generate-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
        body: JSON.stringify({
          eventName: formData.name,
          description: formData.description || formData.name,
          price: formData.pricePerPerson,
          startDate: formData.startDate || new Date().toISOString(),
          endDate: formData.endDate || new Date().toISOString(),
        }),
      });

      console.log("API response status:", response.status);
      const data = await response.json();
      console.log("API response data:", data);

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          paymentLink: data.paymentLink,
        }));

        if (data.testMode) {
          setMessage(
            "Test payment link generated. This will NOT process real payments."
          );
        } else {
          setMessage("Payment link generated successfully!");
        }
      } else {
        setMessage(
          `Error generating payment link: ${data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error generating payment link:", error);
      setMessage("Error connecting to payment API");
    } finally {
      setGeneratingPaymentLink(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Determine if we're editing or creating a new event
      const isEditing = !!editingEventId;
      const url = isEditing ? "/api/events/update" : "/api/events/add";
      const method = isEditing ? "PUT" : "POST";

      // Include the ID if editing
      const requestData = isEditing
        ? { ...formData, id: editingEventId }
        : formData;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        const action = isEditing ? "updated" : "created";
        setMessage(`Event ${action} successfully!`);
        // Reset form
        resetForm();
        // Refresh the events list
        fetchEvents();
      } else {
        setMessage(
          data.error || `Error ${isEditing ? "updating" : "creating"} event`
        );
      }
    } catch (error) {
      console.error(
        `Error ${editingEventId ? "updating" : "creating"} event:`,
        error
      );
      setMessage(`Error ${editingEventId ? "updating" : "creating"} event`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    // Set the editing event ID
    setEditingEventId(event.id);

    // Set form data to the event values for editing
    setFormData({
      name: event.name,
      description: event.description,
      pricePerPerson: event.pricePerPerson,
      coverImage: event.coverImage,
      paymentLink: event.paymentLink || "",
      startDate: new Date(event.startDate).toISOString().split("T")[0],
      endDate: new Date(event.endDate).toISOString().split("T")[0],
      minAge: event.minAge,
      maxAge: event.maxAge,
    });

    // Scroll to the form
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Set a message to indicate editing
    setMessage(`Editing event: ${event.name}`);
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/delete?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Basic " + btoa(`${username}:${password}`),
        },
      });

      if (response.ok) {
        setMessage("Event deleted successfully!");
        // Refresh the events list
        fetchEvents();
      } else {
        const data = await response.json();
        setMessage(data.error || "Error deleting event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage("Error deleting event");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <h1 className="text-3xl font-bold">Event Management</h1>
          <div className="flex space-x-4">
            <Link
              href="/admin"
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Admin Home
            </Link>
            <Link
              href="/admin/gallery"
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Manage Gallery
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
          <h2 className="text-xl font-semibold mb-4">
            {editingEventId ? "Edit Event" : "Create New Event"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price Per Person ($)
                </label>
                <input
                  type="number"
                  name="pricePerPerson"
                  value={formData.pricePerPerson}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Age
                </label>
                <input
                  type="number"
                  name="minAge"
                  value={formData.minAge}
                  onChange={handleInputChange}
                  min="0"
                  max="99"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Age
                </label>
                <input
                  type="number"
                  name="maxAge"
                  value={formData.maxAge}
                  onChange={handleInputChange}
                  min="0"
                  max="99"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>

                {/* New image upload section */}
                <div className="mb-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={uploading || !selectedFile}
                    className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      uploading || !selectedFile
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>

                {uploading && (
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                {formData.coverImage && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <div className="relative w-48 h-36 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={formData.coverImage}
                        alt="Event cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-1">
                  Upload an image or provide a URL below.
                </p>

                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Image URL (if not uploading)
                </label>
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  BryteWire Payment Link
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    URL
                  </span>
                  <input
                    type="text"
                    name="paymentLink"
                    value={formData.paymentLink}
                    onChange={handleInputChange}
                    placeholder="Generated payment link will appear here"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={generateBryteWireLink}
                    disabled={generatingPaymentLink}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      generatingPaymentLink
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                  >
                    {generatingPaymentLink ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      "Generate Payment Link"
                    )}
                  </button>
                  {formData.paymentLink && (
                    <a
                      href={formData.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Test Link
                    </a>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Click "Generate Payment Link" to create a payment link for
                  this event.
                  {message && message.includes("Test payment") && (
                    <span className="mt-1 block font-medium text-yellow-600">
                      Note: Currently generating test links only. These will not
                      process real payments.
                    </span>
                  )}
                </p>

                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">
                    About Payment Integration:
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Payment links are generated using your payment gateway API
                    key. Make sure your API key is properly configured in the
                    environment variables as <code>BRYTEWIRE_API_KEY</code>.
                  </p>
                  <p className="text-sm text-blue-700">
                    When visitors click "Pay Now" on the events page, they'll be
                    directed to the payment form with pre-filled event
                    information.
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading
                  ? editingEventId
                    ? "Updating..."
                    : "Creating..."
                  : editingEventId
                  ? "Update Event"
                  : "Create Event"}
              </button>

              {editingEventId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel Edit
                </button>
              )}
            </div>
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
          <h2 className="text-xl font-semibold mb-4">Manage Events</h2>

          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No events created yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {event.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(event.startDate)} -{" "}
                          {formatDate(event.endDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          ${event.pricePerPerson.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {event.minAge} - {event.maxAge} years
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
