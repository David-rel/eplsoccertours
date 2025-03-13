"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
                onClick={() => router.push(`/events/${event.id}`)}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
