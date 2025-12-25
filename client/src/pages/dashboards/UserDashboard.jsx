import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../app/slice/profile.slice";
import {
  Loader2,
  User,
  Mail,
  Heart,
  CarFront,
  Sparkles,
  MessageSquare,
  ClipboardList,
  Star,
  Send,
  Building,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { Progress } from "../../components/ui/progress";
import CarCard from "../../components/CarCard";
import { applyForSellerApi } from "../../api/seller";
import BecomeSellerForm from "../../components/dashboard/user/section/BecomeSellerForm";

const WishlistSection = lazy(() =>
  import("../../components/dashboard/user/section/WishlistSection")
);

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("profile");

  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [applying, setApplying] = useState(false);
  const [sellerData, setSellerData] = useState({
    shopName: "",
    gstNumber: "",
    panNumber: "",
    aadhaarNumber: "",
    accountNumber: "",
    ifscCode: "",
    address: "",
  });
  const TOTAL_STEPS = 5;

  useEffect(() => {
    dispatch(fetchProfile("user"));
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <Loader2 className="animate-spin text-blue-600 h-10 w-10" />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10 font-medium">{error}</div>
    );

  if (!data) return null;

  const menuItems = [
    { key: "profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    {
      key: "wishlist",
      label: "Wish List",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      key: "inquiries",
      label: "Inquiries",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      key: "feedback",
      label: "Feedback",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      key: "becomeSeller",
      label: "Seller",
      icon: <Building className="h-5 w-5" />,
    },
  ];

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || rating === 0) {
      alert("Please add both feedback and rating ⭐");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(
        "/api/v1/feedback",
        { message: feedbackText, rating },
        { withCredentials: true }
      );
      alert("✅ Feedback sent successfully!");
      setFeedbackText("");
      setRating(0);
    } catch {
      alert("❌ Failed to send feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplySeller = async (e) => {
    e.preventDefault();
    try {
      setApplying(true);
      await applyForSellerApi(sellerData);
      alert("✅ Seller application submitted");
      setStep(1);
      setProgress(20);
    } catch {
      alert("❌ Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const nextStep = () => {
    if (step === 3 && sellerData.sellerTypes.length === 0) {
      alert("Select at least one seller type");
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      setProgress(progress + 20);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(progress - 20);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm flex items-center justify-between overflow-x-auto p-2 gap-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`flex flex-col items-center flex-shrink-0 px-3 py-1.5 rounded-md text-xs transition-all ${
              activeTab === item.key
                ? "bg-gradient-to-r from-blue-500 to-orange-500 text-white"
                : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            {item.icon}
            <span className="mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <aside className="hidden md:flex w-64 bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-lg flex-col p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-6">
          User Menu
        </h2>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === item.key
                  ? "bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CarMazik
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8">
        {/* 👤 PROFILE */}
        {activeTab === "profile" && (
          <div className="bg-white/90 shadow-xl border border-gray-100 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
                  <User className="h-6 w-6 text-orange-500" />
                  Welcome, {data.name || "User"} 👋
                </h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Here’s your personal dashboard overview.
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-orange-400 rounded-full text-white shadow-md">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-500" /> Contact Details
                </h3>
                <p>
                  <strong>Email:</strong> {data.email}
                </p>
                <p>
                  <strong>Username:</strong> {data.username}
                </p>
                <p>
                  <strong>Phone:</strong> {data.phonenumber}
                </p>
              </div>

              <div className="p-5 bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-100 shadow-sm">
                <h3 className="text-lg font-semibold text-orange-700 mb-3 flex items-center gap-2">
                  <CarFront className="h-5 w-5 text-orange-500" /> Account
                  Overview
                </h3>
                <p>
                  Joined on{" "}
                  <strong>
                    {new Date(data.createdAt).toLocaleDateString()}
                  </strong>
                </p>
                <p>
                  Role: <strong className="capitalize">{data.role}</strong>
                </p>
                <p>
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      data.isBlocked ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {data.isBlocked ? "Blocked" : "Active"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="bg-white shadow-xl border border-gray-100 rounded-2xl p-6 md:p-8">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              <MessageSquare className="h-6 w-6 text-orange-500" /> Send
              Feedback
            </h3>

            <form
              onSubmit={handleFeedbackSubmit}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Rate your experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div
                      key={num}
                      onClick={() => setRating(num)}
                      className={`h-9 w-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${
                        rating >= num
                          ? "bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg scale-110"
                          : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                      }`}
                    >
                      <Star className="h-5 w-5" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Feedback
                </label>
                <textarea
                  rows="5"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Write your feedback here..."
                  className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-orange-400 outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                {submitting ? "Sending..." : "Send Feedback"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "becomeSeller" && (
          <BecomeSellerForm/>
        )}

        {activeTab === "wishlist" && <WishlistSection />}
      </main>
    </div>
  );
};

export default UserDashboard;
