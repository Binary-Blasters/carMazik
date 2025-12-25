import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Construction } from "lucide-react";
import { Button } from "./components/ui/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="bg-orange-100 p-4 rounded-full">
            <Construction className="h-10 w-10 text-orange-500" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Coming Soon 🚧
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          This page is currently under development.  
          We’re working hard to bring this feature to you very soon.
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        
        <p className="text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} CarMazik • Under Development
        </p>
      </div>
    </div>
  );
};

export default NotFound;
