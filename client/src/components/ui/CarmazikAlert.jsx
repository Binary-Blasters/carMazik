import React, { useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

const icons = {
  success: <CheckCircle2 className="text-green-500 h-6 w-6" />,
  error: <XCircle className="text-red-500 h-6 w-6" />,
  warning: <AlertTriangle className="text-yellow-500 h-6 w-6" />,
  info: <Info className="text-blue-500 h-6 w-6" />,
};

const CarmazikAlert = ({
  type = "info",
  title = "Alert",
  message = "Something happened!",
  onClose,
  autoClose = true,
  duration = 3000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-fadeIn">
      <div className="relative flex items-start gap-3 bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-2xl p-4 min-w-[260px] max-w-[350px] hover:scale-[1.02] transition-all duration-300">
        <div className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-orange-100 flex items-center justify-center">
          {icons[type]}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
          <p className="text-xs text-gray-500 mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CarmazikAlert;
