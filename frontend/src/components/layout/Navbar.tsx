import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, Edit, IdCard, ChevronDown } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-primary-200 dark:border-dark-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white text-xl font-bold">🔥</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 bg-clip-text text-transparent">
              Flint
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            {user ? (
              /* Logged In - Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-4 py-2  rounded-xl border-2 border-dark-border hover:bg-primary-50 dark:hover:bg-dark-border transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
                    {user.photos && user.photos.length > 0 ? (
                      <img
                        src={user.photos[0]}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text">
                      {user.name}
                    </p>
                    
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#4A4A4A] dark:text-dark-text-secondary transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-primary-200 dark:border-dark-border bg-primary-50 dark:bg-dark-bg">
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-dark-text">
                        {user.username}
                      </p>
                      <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/edit-profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-dark-border transition-colors"
                      >
                        <Edit className="w-4 h-4 text-primary dark:text-primary-500" />
                        <span className="text-sm text-[#1A1A1A] dark:text-dark-text font-medium">
                          Edit Profile
                        </span>
                      </Link>

                      <Link
                        to={`/profile/${user.username}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-dark-border transition-colors"
                      >
                        <IdCard className="w-4 h-4 text-primary dark:text-primary-500" />
                        <span className="text-sm text-[#1A1A1A] dark:text-dark-text font-medium">
                          Profile Card
                        </span>
                      </Link>
                    </div>

                    <div className="border-t border-primary-200 dark:border-dark-border py-2">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In - Nav Links */
              <>
                <Link
                  to="/request-college"
                  className="px-4 py-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-dark-border rounded-lg transition-all"
                >
                  Add College
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-dark-border rounded-lg transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-700 dark:from-primary-500 dark:to-primary-700 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
