import { useState } from "react";
import { Heart, X, Star, MapPin, Sparkles } from "lucide-react";

interface SwipeCardProps {
  user: {
    id: string;
    name: string;
    bio?: string | null;
    photos: string[];
    interests: string[];
    college: {
      name: string;
    };
  };
  onSwipe: (direction: "LEFT" | "RIGHT" | "UP") => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function SwipeCard({ user, onSwipe, style, className }: SwipeCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoClick = (e: React.MouseEvent) => {
    const cardWidth = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    
    if (clickX > cardWidth / 2) {
      // Clicked right side - next photo
      setCurrentPhotoIndex((prev) => 
        prev < user.photos.length - 1 ? prev + 1 : prev
      );
    } else {
      // Clicked left side - previous photo
      setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={style}
    >
      <div className="w-full h-full bg-white dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden">
        {/* Photo Section */}
        <div 
          className="relative h-[60%] cursor-pointer"
          onClick={handlePhotoClick}
        >
          <img
            src={user.photos[currentPhotoIndex]}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          
          {/* Photo indicators */}
          <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
            {user.photos.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-all ${
                  index === currentPhotoIndex
                    ? "bg-white"
                    : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="h-[40%] p-6 pb-24 overflow-y-auto">
          <h2 className="text-3xl font-bold text-[#1A1A1A] dark:text-dark-text mb-2">
            {user.name}
          </h2>

          <div className="flex items-center gap-2 text-[#4A4A4A] dark:text-dark-text-secondary mb-3">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{user.college.name}</span>
          </div>

          {user.bio && (
            <p className="text-[#1A1A1A] dark:text-dark-text mb-4 text-sm leading-relaxed">
              {user.bio}
            </p>
          )}

          {user.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary dark:text-primary-400 rounded-full text-xs font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 px-6 pointer-events-none">
          <button
            onClick={() => onSwipe("LEFT")}
            className="w-16 h-16 rounded-full bg-white dark:bg-dark-bg shadow-xl border-2 border-gray-100 dark:border-dark-border flex items-center justify-center hover:scale-110 transition-transform pointer-events-auto"
            aria-label="Pass"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>

          <button
            onClick={() => onSwipe("UP")}
            className="w-14 h-14 rounded-full bg-white dark:bg-dark-bg shadow-xl border-2 border-gray-100 dark:border-dark-border flex items-center justify-center hover:scale-110 transition-transform pointer-events-auto"
            aria-label="Super Like"
          >
            <Star className="w-6 h-6 text-blue-500" fill="currentColor" />
          </button>

          <button
            onClick={() => onSwipe("RIGHT")}
            className="w-16 h-16 rounded-full bg-white dark:bg-dark-bg shadow-xl border-2 border-gray-100 dark:border-dark-border flex items-center justify-center hover:scale-110 transition-transform pointer-events-auto"
            aria-label="Like"
          >
            <Heart className="w-8 h-8 text-green-500" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
