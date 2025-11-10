import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import {
  Edit,
  LogOut,
  Heart,
  Users,
  Sparkles,
  Mail,
  MapPin,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Check if profile is incomplete
  const isProfileIncomplete =
    !user.bio ||
    !user.gender ||
    !user.interests ||
    user.interests.length === 0 ||
    !user.photos ||
    user.photos.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
      {/* Header */}
      <div className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-primary-200 dark:border-dark-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                🔥
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 bg-clip-text text-transparent">
                Flint
              </h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary via-primary-600 to-primary-700 dark:from-primary-500 dark:via-primary-600 dark:to-primary-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-white/90 text-sm">
                  Welcome back, {user.name}! 👋
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Incomplete Profile Warning */}
        {isProfileIncomplete && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
                  Complete Your Profile
                </h3>
                <p className="text-amber-800 dark:text-amber-300 mb-4">
                  Your profile is incomplete. Please add your gender, bio,
                  interests, and profile photo to get the best experience on
                  Flint.
                </p>
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Complete Profile Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-lg border border-primary-200 dark:border-dark-border hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A] dark:text-dark-text">
                  0
                </p>
                <p className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                  Matches
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-lg border border-primary-200 dark:border-dark-border hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A] dark:text-dark-text">
                  0
                </p>
                <p className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                  Connections
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-lg border border-primary-200 dark:border-dark-border hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A1A] dark:text-dark-text">
                  100%
                </p>
                <p className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
                  Profile Complete
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden border border-primary-200 dark:border-dark-border">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary via-primary-600 to-primary-700 dark:from-primary-500 dark:via-primary-600 dark:to-primary-700 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          </div>

          <div className="px-8 pb-8">
            {/* Profile Photo */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-20 relative">
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl border-4 border-white dark:border-dark-surface shadow-2xl overflow-hidden bg-primary-100 dark:bg-dark-border">
                  {user.photos && user.photos.length > 0 ? (
                    <img
                      src={user.photos[0]}
                      alt={user.name}
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
                      {user.name}
                    </h2>
                    <p className="text-lg text-primary dark:text-primary-500 font-medium">
                      @{user.username}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                  >
                    <Edit className="w-5 h-5" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-8 space-y-6">
              {/* College, Email & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-dark-bg rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-500 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary">
                      College
                    </p>
                    <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text">
                      {user.college.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-dark-bg rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-500 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                {user.gender && (
                  <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-dark-bg rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary dark:bg-primary-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary">
                        Gender
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text capitalize">
                        {user.gender}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="p-6 bg-gradient-to-br from-primary-50 to-white dark:from-dark-bg dark:to-dark-surface rounded-2xl border border-primary-200 dark:border-dark-border">
                  <h3 className="text-sm font-semibold text-primary dark:text-primary-500 mb-2 uppercase tracking-wide">
                    About Me
                  </h3>
                  <p className="text-[#1A1A1A] dark:text-dark-text leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <div className="p-6 bg-gradient-to-br from-primary-50 to-white dark:from-dark-bg dark:to-dark-surface rounded-2xl border border-primary-200 dark:border-dark-border">
                  <h3 className="text-sm font-semibold text-primary dark:text-primary-500 mb-3 uppercase tracking-wide">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
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

              {/* Preferences */}
              {user.preferences && (
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
                        {user.preferences.lookingFor}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mb-1">
                        Age Range
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text">
                        {user.preferences.ageRange.min} -{" "}
                        {user.preferences.ageRange.max} years
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mb-1">
                        Distance
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text">
                        Within {user.preferences.distance} km
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary mb-1">
                        Gender Preference
                      </p>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text capitalize">
                        {user.preferences.genderPreference}
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
