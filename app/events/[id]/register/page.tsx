"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",
    specialRequirements: "",
    participants: 1,
    travelers: Array(1).fill({
      email: "",
      phone: "",
      isAdult: false,
    }),
    isAdult: false,
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  });

  const [paymentError, setPaymentError] = useState("");
  const [processing, setProcessing] = useState(false);

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (name === "participants") {
      const numParticipants = parseInt(value) || 1;
      setFormData((prev) => ({
        ...prev,
        participants: numParticipants,
        travelers: Array(numParticipants).fill({
          email: "",
          phone: "",
          isAdult: false,
        }),
      }));
    } else if (name === "isAdult") {
      setFormData((prev) => ({
        ...prev,
        isAdult: (e.target as HTMLInputElement).checked,
      }));
    } else if (name.startsWith("traveler_")) {
      const [_, index, field] = name.split("_");
      const numIndex = parseInt(index);
      setFormData((prev) => ({
        ...prev,
        travelers: prev.travelers.map((t, i) =>
          i === numIndex
            ? {
                ...t,
                [field]:
                  field === "isAdult"
                    ? (e.target as HTMLInputElement).checked
                    : value,
              }
            : t
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateTotalPrice = () => {
    if (!event) return 0;
    return event.pricePerPerson * formData.participants;
  };

  const handleCardInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    // Check if at least one traveler is over 18
    const hasAdult = formData.travelers.some((traveler) => traveler.isAdult);
    if (!hasAdult) {
      setError("At least one traveler must be 18 or older to register");
      return;
    }

    setProcessing(true);
    setError("");
    setPaymentError("");

    try {
      // Get primary adult traveler's info (first adult in the list)
      const primaryAdult = formData.travelers.find((t) => t.isAdult);
      if (!primaryAdult) {
        setError("Could not find an adult traveler");
        return;
      }

      // First verify the card
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cardData,
          billingAddress: formData.address,
          billingZip: formData.zipCode,
        }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.status !== "Approved") {
        setPaymentError(
          verifyResult.error_message || "Card verification failed"
        );
        return;
      }

      // If verification passed, process the charge
      const totalPrice = calculateTotalPrice();
      const chargeResponse = await fetch("/api/payment/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cardData,
          amount: totalPrice,
          eventName: event.name,
          fullName: formData.fullName,
          email: primaryAdult.email,
          phone: primaryAdult.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        }),
      });

      const chargeResult = await chargeResponse.json();

      if (chargeResult.status !== "Approved") {
        setPaymentError(chargeResult.error_message || "Payment failed");
        return;
      }

      // Create travelers summary
      const travelersSummary = formData.travelers
        .map(
          (t, i) =>
            `Traveler ${i + 1}: ${t.isAdult ? "Adult" : "Minor"}${
              t.isAdult ? ` (${t.email}, ${t.phone})` : ""
            }`
        )
        .join("; ");

      // Store registration data
      const registrationData = {
        ...formData,
        eventId: event.id,
        eventName: event.name,
        price: event.pricePerPerson,
        totalPrice,
        registrationDate: new Date().toISOString(),
        primaryContact: {
          email: primaryAdult.email,
          phone: primaryAdult.phone,
        },
        travelersSummary,
        transactionId: chargeResult.reference_number,
      };

      localStorage.setItem(
        "registration_data",
        JSON.stringify(registrationData)
      );

      // Redirect to success page
      router.push("/payment/success");
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentError(
        "An error occurred while processing your payment. Please try again."
      );
    } finally {
      setProcessing(false);
    }
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
        href={`/events/${params.id}`}
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
        Back to Event Details
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register for {event.name}
          </h1>
          <p className="text-gray-600 mb-8">
            Please fill out the form below to register for this event. You will
            be directed to our secure payment page after submitting this form.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <style jsx global>{`
              input[type="text"],
              input[type="email"],
              input[type="tel"],
              input[type="date"],
              select,
              textarea {
                border: 2px solid #e5e7eb !important;
                padding: 0.75rem !important;
                font-size: 1rem !important;
                border-radius: 0.5rem !important;
                background-color: #f9fafb !important;
                width: 100% !important;
              }

              input[type="text"]:focus,
              input[type="email"]:focus,
              input[type="tel"]:focus,
              input[type="date"]:focus,
              select:focus,
              textarea:focus {
                border-color: #ef4444 !important;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
                outline: none !important;
              }

              .traveler-card {
                border: 2px solid #e5e7eb !important;
                border-radius: 0.75rem !important;
                padding: 1.5rem !important;
                background-color: #f9fafb !important;
              }

              .traveler-card:hover {
                border-color: #ef4444 !important;
              }
            `}</style>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="participants"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Participants *
                </label>
                <select
                  id="participants"
                  name="participants"
                  required
                  value={formData.participants}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="md:col-span-2">
                <div className="space-y-6">
                  {formData.travelers.map((traveler, index) => (
                    <div key={index} className="traveler-card">
                      <h4 className="font-medium mb-4 text-lg text-gray-900">
                        {formData.participants === 1
                          ? "Primary Traveler"
                          : `Traveler ${index + 1}`}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200">
                          <input
                            type="checkbox"
                            id={`traveler_${index}_isAdult`}
                            name={`traveler_${index}_isAdult`}
                            checked={traveler.isAdult}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`traveler_${index}_isAdult`}
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Is 18 or older
                          </label>
                        </div>

                        {traveler.isAdult && (
                          <>
                            <div>
                              <label
                                htmlFor={`traveler_${index}_email`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Email Address *
                              </label>
                              <input
                                type="email"
                                id={`traveler_${index}_email`}
                                name={`traveler_${index}_email`}
                                required
                                value={traveler.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                className="mt-1 block w-full"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`traveler_${index}_phone`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Phone Number *
                              </label>
                              <input
                                type="tel"
                                id={`traveler_${index}_phone`}
                                name={`traveler_${index}_phone`}
                                required
                                value={traveler.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                className="mt-1 block w-full"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State/Province *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Zip/Postal Code *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="emergencyContact"
                  className="block text-sm font-medium text-gray-700"
                >
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  required
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="emergencyPhone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  required
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="specialRequirements"
                  className="block text-sm font-medium text-gray-700"
                >
                  Special Requirements or Notes
                </label>
                <textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  rows={3}
                  value={formData.specialRequirements}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="cardholderName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    required
                    value={cardData.cardholderName}
                    onChange={handleCardInputChange}
                    className="mt-1 block w-full"
                    placeholder="Name as it appears on card"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cardNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    required
                    value={cardData.cardNumber}
                    onChange={handleCardInputChange}
                    className="mt-1 block w-full"
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="expiryMonth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiry Month *
                    </label>
                    <select
                      id="expiryMonth"
                      name="expiryMonth"
                      required
                      value={cardData.expiryMonth}
                      onChange={handleCardInputChange}
                      className="mt-1 block w-full"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => (
                          <option
                            key={month}
                            value={month.toString().padStart(2, "0")}
                          >
                            {month.toString().padStart(2, "0")}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="expiryYear"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiry Year *
                    </label>
                    <select
                      id="expiryYear"
                      name="expiryYear"
                      required
                      value={cardData.expiryYear}
                      onChange={handleCardInputChange}
                      className="mt-1 block w-full"
                    >
                      <option value="">YYYY</option>
                      {Array.from(
                        { length: 10 },
                        (_, i) => new Date().getFullYear() + i
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    required
                    value={cardData.cvv}
                    onChange={handleCardInputChange}
                    className="mt-1 block w-full"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              {paymentError && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                  {paymentError}
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                disabled={processing}
                className={`bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200 text-lg ${
                  processing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {processing
                  ? "Processing Payment..."
                  : `Pay $${calculateTotalPrice().toFixed(2)}`}
              </button>

              <p className="text-sm text-gray-500 text-center">
                By clicking "Pay", you agree to our Terms & Conditions and
                Privacy Policy.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
