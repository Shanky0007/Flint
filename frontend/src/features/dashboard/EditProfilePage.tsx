import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import apiClient from "../../lib/api-client";
import Loader from "../../components/ui/Loader";
import PhotoUpload from "../../components/ui/PhotoUpload";
import CustomDropdown from "../../components/ui/CustomDropdown";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    gender: user?.gender || "male",
    interests:
      user?.interests && user.interests.length > 0 ? user.interests : [""],
    photos: user?.photos && user.photos.length > 0 ? user.photos : [],
    preferences: {
      lookingFor: user?.preferences?.lookingFor || "friendship",
      ageRange: {
        min: user?.preferences?.ageRange?.min || 18,
        max: user?.preferences?.ageRange?.max || 30,
      },
      distance: user?.preferences?.distance || 50,
      genderPreference: user?.preferences?.genderPreference || "everyone",
    },
  });

  const lookingForOptions = [
    { id: "friendship", label: "Friendship" },
    { id: "dating", label: "Dating" },
    { id: "relationship", label: "Relationship" },
    { id: "networking", label: "Networking" },
  ];

  const genderOptions = [
    { id: "everyone", label: "Everyone" },
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
    { id: "non-binary", label: "Non-binary" },
  ];

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
    setSuccess(false);

    const validInterests = formData.interests.filter((i) => i.trim() !== "");

    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!formData.bio.trim()) {
      setError("Bio is required");
      return;
    }

    if (!formData.gender) {
      setError("Gender is required");
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
      const response = await apiClient.patch("/api/auth/update-profile", {
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        gender: formData.gender,
        interests: validInterests,
        photos: formData.photos,
        preferences: formData.preferences,
      });

      if (token) {
        login(token, response.data.user);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-dark-surface/95 backdrop-blur-lg border-b border-primary-200 dark:border-dark-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-primary-100 dark:hover:bg-dark-border rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A] dark:text-dark-text" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-dark-text">
                  Edit Profile
                </h1>
                <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                  Update your information
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading || success}
              className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 text-white rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
            >
              {loading ? (
                <Loader size="sm" />
              ) : success ? (
                "Saved! ✓"
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm">
            Profile updated successfully! Redirecting...
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-4 sm:p-6 border border-primary-200 dark:border-dark-border">
          <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-dark-text mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Email (Cannot be changed)
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 bg-primary-50 dark:bg-dark-bg border border-primary-200 dark:border-dark-border rounded-lg text-[#4A4A4A] dark:text-dark-text-secondary cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-3">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {["male", "female", "transgender"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg border-2 transition-all capitalize text-sm sm:text-base ${
                      formData.gender === g
                        ? "border-primary dark:border-primary-500 bg-primary/10 dark:bg-primary-500/20 text-primary dark:text-primary-500 font-semibold"
                        : "border-primary-200 dark:border-dark-border text-[#4A4A4A] dark:text-dark-text-secondary hover:border-primary dark:hover:border-primary-500"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About You */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-4 sm:p-6 border border-primary-200 dark:border-dark-border">
          <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-dark-text mb-4">
            About You
          </h2>
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
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text resize-none"
            />
            <p className="text-xs text-[#6B8F60] dark:text-primary-600 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-4 sm:p-6 border border-primary-200 dark:border-dark-border">
          <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-dark-text mb-4">
            Profile Photo
          </h2>
          <PhotoUpload
            photos={formData.photos}
            onPhotosChange={(photos) => setFormData({ ...formData, photos })}
            maxPhotos={1}
          />
        </div>

        {/* Interests */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-4 sm:p-6 border border-primary-200 dark:border-dark-border">
          <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-dark-text mb-4">
            Interests
          </h2>
          <div className="space-y-3">
            {formData.interests.map((interest, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => handleInterestChange(index, e.target.value)}
                  placeholder={`Interest ${index + 1}`}
                  maxLength={50}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text text-sm sm:text-base"
                />
                {formData.interests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(index)}
                    className="px-3 sm:px-4 py-2.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors font-medium text-sm"
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
              className="mt-3 text-sm text-primary dark:text-primary-500 hover:underline font-medium"
            >
              + Add another interest
            </button>
          )}
        </div>

        {/* Dating Preferences */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-4 sm:p-6 border border-primary-200 dark:border-dark-border">
          <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-dark-text mb-4">
            Dating Preferences
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Looking For
              </label>
              <CustomDropdown
                options={lookingForOptions}
                value={formData.preferences.lookingFor}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      lookingFor: value,
                    },
                  })
                }
                placeholder="Select what you're looking for"
                searchable={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                  Min Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.preferences.ageRange.min}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        ageRange: {
                          ...formData.preferences.ageRange,
                          min: parseInt(e.target.value) || 18,
                        },
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                  Max Age
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.preferences.ageRange.max}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        ageRange: {
                          ...formData.preferences.ageRange,
                          max: parseInt(e.target.value) || 30,
                        },
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Distance: {formData.preferences.distance} km
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={formData.preferences.distance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      distance: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full h-2 bg-primary-200 dark:bg-dark-border rounded-lg appearance-none cursor-pointer accent-primary dark:accent-primary-500"
              />
              <div className="flex justify-between text-xs text-[#4A4A4A] dark:text-dark-text-secondary mt-1">
                <span>1 km</span>
                <span>100 km</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                Gender Preference
              </label>
              <CustomDropdown
                options={genderOptions}
                value={formData.preferences.genderPreference}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    preferences: {
                      ...formData.preferences,
                      genderPreference: value,
                    },
                  })
                }
                placeholder="Select gender preference"
                searchable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
