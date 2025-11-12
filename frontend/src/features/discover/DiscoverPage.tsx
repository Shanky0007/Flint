import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { ArrowLeft, Heart, X, Star, Flame } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import apiClient from "../../lib/api-client";
import SwipeCard from "./SwipeCard";
import MatchModal from "./MatchModal";
import Loader from "../../components/ui/Loader";

interface DiscoverUser {
  id: string;
  name: string;
  username: string;
  bio?: string | null;
  photos: string[];
  interests: string[];
  college: {
    name: string;
    location: string;
  };
}

interface Match {
  user1: {
    id: string;
    name: string;
    photos: string[];
  };
  user2: {
    id: string;
    name: string;
    photos: string[];
  };
}

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState<DiscoverUser[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<Match | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const currentUser = users[currentIndex];

  // Spring animation for card
  const [{ x, rotate }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
  }));

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/discover/feed");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle swipe
  const handleSwipe = async (direction: "LEFT" | "RIGHT" | "UP") => {
    if (!currentUser) return;

    try {
      const response = await apiClient.post("/swipes", {
        swipedUserId: currentUser.id,
        type: direction,
      });

      // Check for match
      if (response.data.matched && response.data.match) {
        setMatchData(response.data.match);
        setShowMatchModal(true);
      }

      // Move to next card
      setCurrentIndex((prev) => prev + 1);
      
      // Reset animation
      api.start({ x: 0, rotate: 0 });

      // Fetch more users if running low
      if (currentIndex >= users.length - 3) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Failed to swipe:", error);
    }
  };

  // Drag gesture
  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2; // Trigger swipe on fast gesture
      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        // Swiped
        handleSwipe(dir === 1 ? "RIGHT" : "LEFT");
        api.start({
          x: (200 + window.innerWidth) * dir,
          rotate: dir * 20,
        });
      } else {
        // Dragging or released without trigger
        api.start({
          x: down ? mx : 0,
          rotate: down ? mx / 20 : 0,
        });
      }
    }
  );

  if (loading && users.length === 0) {
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
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-[#1A1A1A] dark:text-dark-text hover:text-primary dark:hover:text-primary-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-dark-text">
                Discover
              </h1>
            </div>

            <button
              onClick={() => navigate("/matches")}
              className="px-4 py-2 bg-primary hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              Matches
            </button>
          </div>
        </div>
      </div>

      {/* Card Stack */}
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="relative h-[600px]">
          {users.length === 0 || currentIndex >= users.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-32 h-32 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6">
                <Heart className="w-16 h-16 text-primary dark:text-primary-400" />
              </div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-dark-text mb-3">
                No More Profiles
              </h2>
              <p className="text-[#4A4A4A] dark:text-dark-text-secondary mb-6">
                Check back later for more people to connect with!
              </p>
              <button
                onClick={() => navigate("/matches")}
                className="px-6 py-3 bg-primary hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors"
              >
                View Your Matches
              </button>
            </div>
          ) : (
            <>
              {/* Next card (behind) */}
              {currentIndex + 1 < users.length && (
                <SwipeCard
                  user={users[currentIndex + 1]}
                  onSwipe={() => {}}
                  className="opacity-50 scale-95"
                />
              )}

              {/* Current card (front) */}
              <animated.div
                {...bind()}
                style={{
                  x,
                  rotate: rotate.to((r) => `${r}deg`),
                  touchAction: "none",
                }}
                className="absolute inset-0"
              >
                <SwipeCard
                  user={currentUser}
                  onSwipe={handleSwipe}
                />
              </animated.div>

              {/* Swipe hints */}
              <animated.div
                style={{
                  opacity: x.to((x) => (x < -50 ? 1 : 0)),
                }}
                className="absolute top-12 right-8 text-red-500 font-bold text-4xl transform rotate-12 pointer-events-none"
              >
                NOPE
              </animated.div>

              <animated.div
                style={{
                  opacity: x.to((x) => (x > 50 ? 1 : 0)),
                }}
                className="absolute top-12 left-8 text-green-500 font-bold text-4xl transform -rotate-12 pointer-events-none"
              >
                LIKE
              </animated.div>
            </>
          )}
        </div>

        {/* Instructions */}
        {currentUser && (
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-[#4A4A4A] dark:text-dark-text-secondary">
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-500" />
                <span>Swipe left to pass</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-500" fill="currentColor" />
                <span>Swipe right to like</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Match Modal */}
      {showMatchModal && matchData && user && (
        <MatchModal
          match={matchData}
          currentUserId={user.id}
          onClose={() => setShowMatchModal(false)}
        />
      )}
    </div>
  );
}
