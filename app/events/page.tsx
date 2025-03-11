"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events/get");
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events);
        } else {
          setError("Error loading events");
        }
      } catch (error) {
        setError("Error loading events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Close modal when clicking escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEvent(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const PayButton = ({ event }: { event: Event }) => {
    // Check if this is a test payment link
    const isTestPayment =
      event.paymentLink && event.paymentLink.includes("test-");

    if (event.paymentLink) {
      return (
        <a
          href={event.paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 ${
            isTestPayment
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          onClick={(e) => e.stopPropagation()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          {isTestPayment ? "Test Payment" : "Pay Now"}
        </a>
      );
    }

    return (
      <Link
        href="/register"
        className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
      >
        Register Now
      </Link>
    );
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
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-bold mb-12 text-center">
          Upcoming Events
        </h1>

        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No events available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                  {event.paymentLink && (
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          event.paymentLink.includes("test-")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {event.paymentLink.includes("test-")
                          ? "Test Payment"
                          : "Online Payment"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
                  <p className="text-gray-600 mb-4">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">
                      ${event.pricePerPerson.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                      Ages {event.minAge} - {event.maxAge}
                    </span>

                    {event.paymentLink && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(event.paymentLink, "_blank");
                        }}
                        className={`${
                          event.paymentLink.includes("test-")
                            ? "text-yellow-600 hover:text-yellow-800"
                            : "text-blue-600 hover:text-blue-800"
                        } text-sm font-medium flex items-center`}
                      >
                        {event.paymentLink.includes("test-")
                          ? "Test Payment"
                          : "Pay Now"}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 z-10"
              >
                ×
              </button>
              <div className="relative aspect-video w-full">
                <img
                  src={selectedEvent.coverImage}
                  alt={selectedEvent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-2">
                  {selectedEvent.name}
                </h2>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600">
                    {formatDate(selectedEvent.startDate)} -{" "}
                    {formatDate(selectedEvent.endDate)}
                  </p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold mr-2">
                      ${selectedEvent.pricePerPerson.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  {selectedEvent.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                    Ages {selectedEvent.minAge} - {selectedEvent.maxAge}
                  </span>
                  <PayButton event={selectedEvent} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
