import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/ui/Loader";
import apiClient from "../../lib/api-client";

export default function RequestCollegePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    emailDomain: "",
    requestedBy: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.location ||
      !formData.emailDomain ||
      !formData.requestedBy
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await apiClient.post("/api/colleges/request", formData);
      setSuccess(true);
      setTimeout(() => navigate("/signup"), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary dark:text-primary-500 mb-2">
              Request Submitted!
            </h2>
            <p className="text-[#4A4A4A] dark:text-dark-text-secondary">
              Your college request has been sent to admin for approval.
              <br />
              Redirecting to signup...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-primary-200 dark:border-dark-border">
            <h2 className="text-3xl font-bold text-primary dark:text-primary-500 mb-2">
              Request College
            </h2>
            <p className="text-[#4A4A4A] dark:text-dark-text-secondary mb-6">
              Can't find your college? Submit a request and we'll add it!
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                  College Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., BMS Institute of Technology"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Bangalore, Karnataka"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                  Student Email Domain
                </label>
                <input
                  type="text"
                  value={formData.emailDomain}
                  onChange={(e) =>
                    setFormData({ ...formData, emailDomain: e.target.value })
                  }
                  placeholder="e.g., bmsit.in"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                />
                <p className="text-xs text-[#6B8F60] dark:text-primary-600 mt-1">
                  Enter only the domain (without @)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.requestedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, requestedBy: e.target.value })
                  }
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary dark:bg-primary-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader size="sm" />}
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
