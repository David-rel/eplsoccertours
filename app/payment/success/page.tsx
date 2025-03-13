import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saveRegistration = async () => {
      try {
        const registrationData = localStorage.getItem("registration_data");
        if (!registrationData) {
          setError("Registration data not found");
          return;
        }

        const data = JSON.parse(registrationData);

        // Save registration to database
        const response = await fetch("/api/registrations/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to save registration");
        }

        // Clear the registration data from localStorage
        localStorage.removeItem("registration_data");
        setLoading(false);
      } catch (error) {
        console.error("Error saving registration:", error);
        setError("Error saving your registration. Please contact support.");
        setLoading(false);
      }
    };

    saveRegistration();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">{error}</p>
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
          >
            <circle
              className="opacity-25"
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M14 24l8 8 16-16"
            />
          </svg>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your registration. You will receive a confirmation
            email shortly with your registration details.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/events"
            className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200"
          >
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
