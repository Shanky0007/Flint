import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./lib/ThemeContext";
import ThemeToggle from "./components/ui/ThemeToggle";
import LandingPage from "./features/landing/LandingPage";
import SignupPage from "./features/auth/SignupPage";
import LoginPage from "./features/auth/LoginPage";
import RequestCollegePage from "./features/college/RequestCollegePage";
import DashboardPage from "./features/dashboard/DashboardPage";
import EditProfilePage from "./features/dashboard/EditProfilePage";
import ProfileCardPage from "./features/profile/ProfileCardPage";
import ProfileSetupPage from "./features/onboarding/ProfileSetupPage";
import PreferencesPage from "./features/onboarding/PreferencesPage";
import DiscoverPage from "./features/discover/DiscoverPage";
import MatchesPage from "./features/matches/MatchesPage";
import { AuthProvider } from "./lib/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import OnboardingRoute from "./components/layout/OnboardingRoute";
import GuestRoute from "./components/layout/GuestRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-dark-bg text-[#1A1A1A] dark:text-dark-text transition-colors duration-300">
            <Routes>
              <Route
                path="/"
                element={
                  <GuestRoute>
                    <LandingPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <GuestRoute>
                    <SignupPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route path="/request-college" element={<RequestCollegePage />} />
              <Route
                path="/onboarding/profile-setup"
                element={
                  <OnboardingRoute>
                    <ProfileSetupPage />
                  </OnboardingRoute>
                }
              />
              <Route
                path="/onboarding/preferences"
                element={
                  <OnboardingRoute>
                    <PreferencesPage />
                  </OnboardingRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/discover"
                element={
                  <ProtectedRoute>
                    <DiscoverPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/matches"
                element={
                  <ProtectedRoute>
                    <MatchesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:username"
                element={
                  <ProtectedRoute>
                    <ProfileCardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ThemeToggle />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
