import React from "react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../app/slice/auth.slice";

export default function Login({ onClose }) {
  const [formData, setFormData] = React.useState({
    identifier: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ type: "", text: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = await login(formData.identifier, formData.password);
      const user = data.data.user;
      const token = data.data.accessToken;
      dispatch(setUser({ user, token }));

      setMessage({
        type: "success",
        text: "🎉 Login successful! Redirecting...",
      });

      if (user.role === "admin") {
        navigate("/admin");
      }

      setTimeout(() => {
        window.location.reload();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("❌ Login failed:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid credentials. Please try again.";

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    onClose();
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    alert("Forgot password flow coming soon!");
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Email / Username / Phone"
            className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={formData.identifier}
            onChange={(e) =>
              setFormData({ ...formData, identifier: e.target.value })
            }
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={loading}
          />

          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-blue-600 to-orange-500 text-white w-full py-2 rounded-md transition-all cursor-pointer ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-200"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-200"></div>
        </div>

        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <button
            onClick={handleSignupRedirect}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
            disabled={loading}
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
