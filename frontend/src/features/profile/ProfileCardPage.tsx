import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Users,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import apiClient from "../../lib/api-client";
import Loader from "../../components/ui/Loader";

interface ProfileUser {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  gender?: string;
  interests?: string[];
  photos?: string[];
  college: {
    id: string;
    name: string;
  };
  preferences?: {
    lookingFor: string;
    ageRange: {
      min: number;
      max: number;
    };
    distance: number;
    genderPreference: string;
  };
}

export default function ProfileCardPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/api/users/profile/${username}`);
      setProfileUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Profile not found"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-primary dark:bg-primary-500 text-white rounded-lg hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
      {/* Header */}
      <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-primary-200 dark:border-dark-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-primary-100 dark:hover:bg-dark-border rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#1A1A1A] dark:text-dark-text" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-dark-text">
                {isOwnProfile
                  ? "Your Profile"
                  : `${profileUser.name}'s Profile`}
              </h1>
              <p className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                @{profileUser.username}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden border border-primary-200 dark:border-dark-border">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary via-primary-600 to-primary-700 dark:from-primary-500 dark:via-primary-600 dark:to-primary-700 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          </div>

          <div className="px-8 pb-8">
            {/* Profile Photo & Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 relative">
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl border-4 border-white dark:border-dark-surface shadow-2xl overflow-hidden bg-primary-100 dark:bg-dark-border">
                  {profileUser.photos && profileUser.photos.length > 0 ? (
                    <img
                      src={profileUser.photos[0]}
                      alt={profileUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      👤
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-4 border-white dark:border-dark-surface shadow-lg flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
              </div>

              <div className="flex-1 sm:mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-[#1A1A1A] dark:text-dark-text">
                      {profileUser.name}
                    </h2>
                    <p className="text-lg text-primary dark:text-primary-500 font-medium">
                      @{profileUser.username}
                    </p>
                  </div>
                  {!isOwnProfile && (
                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg">
                        <Heart className="w-5 h-5" />
                        Like
                      </button>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-dark-bg border-2 border-primary dark:border-primary-500 text-primary dark:text-primary-500 rounded-xl font-semibold hover:scale-105 transition-transform">
                        <MessageCircle className="w-5 h-5" />
                        Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-8 space-y-6">
              {/* College & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-dark-bg rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-500 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary">
                      College
                    </p>
                    <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text">
                      {profileUser.college.name}
                    </p>
                  </div>
                </div>

                {profileUser.gender && (
                  <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-dark-bg rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary">
                        Gender
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text capitalize">
                        {profileUser.gender}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profileUser.bio && (
                <div className="p-6 bg-gradient-to-br from-primary-50 to-white dark:from-dark-bg dark:to-dark-surface rounded-2xl border border-primary-200 dark:border-dark-border">
                  <h3 className="text-sm font-semibold text-primary dark:text-primary-500 mb-2 uppercase tracking-wide">
                    About {isOwnProfile ? "Me" : profileUser.name.split(" ")[0]}
                  </h3>
                  <p className="text-[#1A1A1A] dark:text-dark-text leading-relaxed">
                    {profileUser.bio}
                  </p>
                </div>
              )}

              {/* Interests */}
              {profileUser.interests && profileUser.interests.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-primary-50 to-white dark:from-dark-bg dark:to-dark-surface rounded-2xl border border-primary-200 dark:border-dark-border">
                  <h3 className="text-sm font-semibold text-primary dark:text-primary-500 mb-3 uppercase tracking-wide">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-full text-sm font-medium text-[#1A1A1A] dark:text-dark-text shadow-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences - Only show on own profile */}
              {isOwnProfile && profileUser.preferences && (
                <div className="p-6 bg-gradient-to-br from-primary-50 to-white dark:from-dark-bg dark:to-dark-surface rounded-2xl border border-primary-200 dark:border-dark-border">
                  <h3 className="text-sm font-semibold text-primary dark:text-primary-500 mb-3 uppercase tracking-wide">
                    Preferences
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mb-1">
                        Looking For
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text capitalize">
                        {profileUser.preferences.lookingFor}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mb-1">
                        Age Range
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text">
                        {profileUser.preferences.ageRange.min} -{" "}
                        {profileUser.preferences.ageRange.max} years
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mb-1">
                        Distance
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text">
                        Within {profileUser.preferences.distance} km
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mb-1">
                        Gender Preference
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text capitalize">
                        {profileUser.preferences.genderPreference}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
