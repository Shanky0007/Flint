import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import apiClient from "../../lib/api-client";
import Loader from "../../components/ui/Loader";

export default function PreferencesPage() {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();

  const [formData, setFormData] = useState({
    preferredAge: { min: 18, max: 30 },
    preferredDistance: 50,
    preferredGender: "all" as "male" | "female" | "all",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.preferredAge.min > formData.preferredAge.max) {
      setError("Minimum age cannot be greater than maximum age");
      return;
    }

    if (formData.preferredAge.min < 18 || formData.preferredAge.max > 100) {
      setError("Age must be between 18 and 100");
      return;
    }

    setLoading(true);

    try {
      await apiClient.patch("/api/auth/preferences", {
        preferredAgeMin: formData.preferredAge.min,
        preferredAgeMax: formData.preferredAge.max,
        preferredDistance: formData.preferredDistance,
        preferredGender: formData.preferredGender,
      });

      // Update user in context
      if (token && user) {
        login(token, { ...user, isOnboarded: true });
      }

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-primary-200 dark:border-dark-border">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary dark:bg-primary-500 flex items-center justify-center text-white text-xl">
                ⚙️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary dark:text-primary-500">
                  Preferences
                </h2>
                <p className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                  Set your matching preferences
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-primary dark:bg-primary-500 rounded-full"></div>
              <div className="flex-1 h-2 bg-primary dark:bg-primary-500 rounded-full"></div>
              <div className="flex-1 h-2 bg-primary dark:bg-primary-500 rounded-full"></div>
            </div>
            <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mt-2">
              Step 3 of 3
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-4">
                Age Range <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                      Minimum Age
                    </span>
                    <span className="text-sm font-semibold text-primary dark:text-primary-500">
                      {formData.preferredAge.min}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={formData.preferredAge.min}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredAge: {
                          ...formData.preferredAge,
                          min: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full h-2 bg-primary-200 dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                      Maximum Age
                    </span>
                    <span className="text-sm font-semibold text-primary dark:text-primary-500">
                      {formData.preferredAge.max}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={formData.preferredAge.max}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredAge: {
                          ...formData.preferredAge,
                          max: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full h-2 bg-primary-200 dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Distance */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary">
                  Maximum Distance <span className="text-red-500">*</span>
                </label>
                <span className="text-sm font-semibold text-primary dark:text-primary-500">
                  {formData.preferredDistance} km
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={formData.preferredDistance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferredDistance: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-primary-200 dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-500"
              />
              <p className="text-xs text-[#6B8F60] dark:text-primary-600 mt-2">
                Show matches within this distance from your college
              </p>
            </div>

            {/* Gender Preference */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-3">
                Show me <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, preferredGender: "male" })
                  }
                  className={`py-3 px-4 rounded-lg border-2 transition-all ${
                    formData.preferredGender === "male"
                      ? "border-primary dark:border-primary-500 bg-primary/10 dark:bg-primary-500/20 text-primary dark:text-primary-500 font-semibold"
                      : "border-primary-200 dark:border-dark-border text-[#4A4A4A] dark:text-dark-text-secondary hover:border-primary dark:hover:border-primary-500"
                  }`}
                >
                  Men
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, preferredGender: "female" })
                  }
                  className={`py-3 px-4 rounded-lg border-2 transition-all ${
                    formData.preferredGender === "female"
                      ? "border-primary dark:border-primary-500 bg-primary/10 dark:bg-primary-500/20 text-primary dark:text-primary-500 font-semibold"
                      : "border-primary-200 dark:border-dark-border text-[#4A4A4A] dark:text-dark-text-secondary hover:border-primary dark:hover:border-primary-500"
                  }`}
                >
                  Women
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, preferredGender: "all" })
                  }
                  className={`py-3 px-4 rounded-lg border-2 transition-all ${
                    formData.preferredGender === "all"
                      ? "border-primary dark:border-primary-500 bg-primary/10 dark:bg-primary-500/20 text-primary dark:text-primary-500 font-semibold"
                      : "border-primary-200 dark:border-dark-border text-[#4A4A4A] dark:text-dark-text-secondary hover:border-primary dark:hover:border-primary-500"
                  }`}
                >
                  Everyone
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary dark:bg-primary-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size="sm" />}
              {loading ? "Completing..." : "Complete Onboarding ✓"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
