import React from "react";
import { X } from "lucide-react";
import { Button } from "../components/ui/button";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login({ onClose }) {
  const [formData, setFormData] = React.useState({
    identifier: "", // username / email / phone
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData.identifier, formData.password);
      console.log("✅ Login successful:", data);
      onClose();
    } catch (error) {
      console.error("❌ Login failed:", error);
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
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

     
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Email / Username / Phone"
            className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={formData.identifier}
            onChange={(e) =>
              setFormData({ ...formData, identifier: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

     
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-orange-500 text-white w-full py-2 rounded-md"
          >
            Login
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
            className="text-blue-600 font-medium hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
