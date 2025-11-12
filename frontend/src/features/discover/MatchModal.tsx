import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

interface MatchModalProps {
  match: {
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
  };
  currentUserId: string;
  onClose: () => void;
}

export default function MatchModal({ match, currentUserId, onClose }: MatchModalProps) {
  const navigate = useNavigate();
  const matchedUser = match.user1.id === currentUserId ? match.user2 : match.user1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg rounded-3xl shadow-2xl p-8 animate-scaleIn">
        {/* Celebration Hearts */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <Heart className="w-16 h-16 text-primary animate-bounce" fill="currentColor" />
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold text-center text-primary dark:text-primary-400 mt-20 mb-8">
          It's a Match!
        </h2>

        {/* Photos */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
            <img
              src={matchedUser.photos[0]}
              alt={matchedUser.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-[#1A1A1A] dark:text-dark-text mb-8 text-lg">
          You and <span className="font-bold text-primary">{matchedUser.name}</span> liked each other!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => {
              onClose();
              navigate("/matches");
            }}
            className="w-full py-4 bg-primary hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            View Matches
          </button>

          <button
            onClick={onClose}
            className="w-full py-4 bg-white hover:bg-gray-50 dark:bg-dark-surface dark:hover:bg-dark-bg text-[#1A1A1A] dark:text-dark-text rounded-xl font-semibold text-lg transition-colors border-2 border-primary/20"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}
