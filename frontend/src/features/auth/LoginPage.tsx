import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import PasswordInput from "../../components/ui/PasswordInput";
import CustomDropdown from "../../components/ui/CustomDropdown";
import Loader from "../../components/ui/Loader";
import { SkeletonCard } from "../../components/ui/Skeleton";
import apiClient from "../../lib/api-client";

interface College {
  id: string;
  name: string;
  location: string;
  emailDomain: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [formData, setFormData] = useState({
    emailPrefix: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingColleges, setFetchingColleges] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await apiClient.get("/api/colleges/approved");
      setColleges(response.data);
    } catch (err) {
      console.error("Failed to fetch colleges", err);
    } finally {
      setFetchingColleges(false);
    }
  };

  const selectedCollege = colleges.find((c) => c.id === selectedCollegeId);

  const collegeOptions = colleges.map((college) => ({
    id: college.id,
    label: college.name,
    sublabel: college.location,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedCollege) {
      setError("Please select a college");
      return;
    }

    if (!formData.emailPrefix || !formData.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const email = `${formData.emailPrefix}@${selectedCollege.emailDomain}`;
      const response = await apiClient.post("/api/auth/login", {
        email,
        password: formData.password,
      });

      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingColleges) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <SkeletonCard />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-xl p-8 border border-primary-200 dark:border-dark-border">
            <h2 className="text-3xl font-bold text-primary dark:text-primary-500 mb-2">
              Welcome Back
            </h2>
            <p className="text-[#4A4A4A] dark:text-dark-text-secondary mb-6">
              Sign in to continue to Flint
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                  College
                </label>
                <CustomDropdown
                  options={collegeOptions}
                  value={selectedCollegeId}
                  onChange={(value) => {
                    setSelectedCollegeId(value);
                    setFormData({ ...formData, emailPrefix: "" });
                  }}
                  placeholder="Select your college"
                  searchable
                />
              </div>

              {selectedCollege && (
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                    College Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.emailPrefix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailPrefix: e.target.value,
                        })
                      }
                      placeholder="yourname"
                      className="flex-1 px-4 py-3 bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                    />
                    <div className="flex items-center px-4 py-3 bg-primary-50 dark:bg-dark-border border border-primary-200 dark:border-dark-border rounded-lg text-[#4A4A4A] dark:text-dark-text-secondary whitespace-nowrap">
                      @{selectedCollege.emailDomain}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#4A4A4A] dark:text-dark-text-secondary mb-2">
                  Password
                </label>
                <PasswordInput
                  value={formData.password}
                  onChange={(value) =>
                    setFormData({ ...formData, password: value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary dark:bg-primary-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader size="sm" />}
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-[#4A4A4A] dark:text-dark-text-secondary mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary dark:text-primary-500 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
