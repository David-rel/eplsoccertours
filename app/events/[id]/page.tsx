"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Event {
  id: number;
  name: string;
  description: string;
  pricePerPerson: number;
  coverImage: string;
  startDate: string;
  endDate: string;
  minAge: number;
  maxAge: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/events/get?id=${params.id}`);
        const data = await response.json();

        if (response.ok) {
          setEvent(data.event);
        } else {
          setError(data.error || "Error fetching event");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">{error || "Event not found"}</p>
        <Link
          href="/events"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link
        href="/events"
        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Events
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-80 w-full">
          <Image
            src={event.coverImage}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {event.name}
          </h1>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-500">Dates</p>
              <p className="font-medium">
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </p>
            </div>

            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium text-red-600">
                ${event.pricePerPerson.toFixed(2)}
              </p>
            </div>

            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-500">Age Range</p>
              <p className="font-medium">
                {event.minAge} - {event.maxAge} years
              </p>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="border-t pt-6 flex justify-center">
            {/* Replace PaymentButton with a link to the registration form */}
            <Link
              href={`/events/${event.id}/register`}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 text-lg rounded transition-colors duration-200"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
