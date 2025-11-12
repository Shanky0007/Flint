import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Sparkles } from "lucide-react";
import apiClient from "../../lib/api-client";
import Loader from "../../components/ui/Loader";

interface Match {
  id: string;
  matchedAt: Date;
  user: {
    id: string;
    name: string;
    username: string;
    bio?: string | null;
    photos: string[];
    interests: string[];
    college: {
      name: string;
    };
  };
}

export default function MatchesPage() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/swipes/matches");
      setMatches(response.data.matches);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-primary-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/discover")}
              className="flex items-center gap-2 text-[#1A1A1A] dark:text-dark-text hover:text-primary dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Discover</span>
            </button>

            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-dark-text">
                Your Matches
              </h1>
            </div>

            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6">
              <Heart className="w-16 h-16 text-primary dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-dark-text mb-3">
              No Matches Yet
            </h2>
            <p className="text-[#4A4A4A] dark:text-dark-text-secondary mb-6 max-w-md">
              Start swiping to find people who like you back!
            </p>
            <button
              onClick={() => navigate("/discover")}
              className="px-6 py-3 bg-primary hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                onClick={() => navigate(`/profile/${match.user.username}`)}
                className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                {/* Photo */}
                <div className="relative h-64">
                  <img
                    src={match.user.photos[0]}
                    alt={match.user.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Heart className="w-3 h-3" fill="currentColor" />
                    Match
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-dark-text mb-1">
                    {match.user.name}
                  </h3>
                  
                  <p className="text-sm text-[#4A4A4A] dark:text-dark-text-secondary mb-3">
                    {match.user.college.name}
                  </p>

                  {match.user.bio && (
                    <p className="text-sm text-[#1A1A1A] dark:text-dark-text mb-3 line-clamp-2">
                      {match.user.bio}
                    </p>
                  )}

                  {match.user.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {match.user.interests.slice(0, 3).map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-400 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          {interest}
                        </span>
                      ))}
                      {match.user.interests.length > 3 && (
                        <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-400 rounded-full text-xs font-medium">
                          +{match.user.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Chat functionality in Phase 2
                      alert("Chat coming soon!");
                    }}
                    className="w-full py-2.5 bg-primary hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
