import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import apiClient from "../../lib/api-client";
import Loader from "../../components/ui/Loader";
import PhotoUpload from "../../components/ui/PhotoUpload";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();

  const [formData, setFormData] = useState({
    bio: "",
    interests: [""],
    photos: [] as string[],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddInterest = () => {
    if (formData.interests.length < 10) {
      setFormData({ ...formData, interests: [...formData.interests, ""] });
    }
  };

  const handleRemoveInterest = (index: number) => {
    if (formData.interests.length > 1) {
      const newInterests = formData.interests.filter((_, i) => i !== index);
      setFormData({ ...formData, interests: newInterests });
    }
  };

  const handleInterestChange = (index: number, value: string) => {
    const newInterests = [...formData.interests];
    newInterests[index] = value;
    setFormData({ ...formData, interests: newInterests });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validInterests = formData.interests.filter((i) => i.trim() !== "");

    if (!formData.bio.trim()) {
      setError("Bio is required");
      return;
    }

    if (validInterests.length === 0) {
      setError("At least one interest is required");
      return;
    }

    if (formData.photos.length === 0) {
      setError("Profile photo is required");
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.patch("/api/auth/profile-setup", {
        bio: formData.bio,
        interests: validInterests,
        photos: formData.photos,
      });

      // Update user in context
      if (token && user) {
        login(token, { ...user, ...response.data.user });
      }

      navigate("/onboarding/preferences");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
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
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary dark:text-primary-500">
                  Profile Setup
                </h2>
                <p className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                  Tell us about yourself
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-primary dark:bg-primary-500 rounded-full"></div>
              <div className="flex-1 h-2 bg-primary-200 dark:bg-dark-border rounded-full"></div>
              <div className="flex-1 h-2 bg-primary-200 dark:bg-dark-border rounded-full"></div>
            </div>
            <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mt-2">
              Step 2 of 3
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text resize-none"
              />
              <p className="text-xs text-[#6B8F60] dark:text-primary-600 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Interests <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {formData.interests.map((interest, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) =>
                        handleInterestChange(index, e.target.value)
                      }
                      placeholder={`Interest ${index + 1}`}
                      maxLength={50}
                      className="flex-1 px-4 py-2 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                    />
                    {formData.interests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(index)}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {formData.interests.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddInterest}
                  className="mt-2 text-sm text-primary dark:text-primary-500 hover:underline"
                >
                  + Add another interest
                </button>
              )}
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Profile Photo <span className="text-red-500">*</span>
              </label>
              <PhotoUpload
                photos={formData.photos}
                onPhotosChange={(photos) =>
                  setFormData({ ...formData, photos })
                }
                maxPhotos={1}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary dark:bg-primary-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size="sm" />}
              {loading ? "Saving..." : "Continue to Preferences →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
