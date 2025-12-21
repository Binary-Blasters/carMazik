import React, { lazy, useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../app/slice/profile.slice";
import {
  User,
  Building2,
  FileText,
  CreditCard,
  Briefcase,
  UploadCloud,
} from "lucide-react";
import SellerDashboardLayout from "../../components/dashboard/SellerDashboardLayout";
import UploadCarForm from "../seller/UploadCarForm";
import LoadingScreen from "../../components/ui/LoadingScreen";
import CarmazikAlert from "../../components/ui/CarmazikAlert";

/* ---------------- LAZY TABS ---------------- */
const ApprovedCars = lazy(() =>
  import("../../components/dashboard/AprrovedCars")
);
const PendingCars = lazy(() =>
  import("../../components/dashboard/PendingCars")
);
const RejectedCars = lazy(() =>
  import("../../components/dashboard/RejectedCars")
);
const DraftCars = lazy(() =>
  import("../../components/dashboard/DraftCars")
);
const SoldCars = lazy(() =>
  import("../../components/dashboard/SoldCars")
);

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("profile");
  const [alert, setAlert] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchProfile("seller")).unwrap();

        
        if (res?.isBlocked) {
          setIsBlocked(true);
        }
      } catch (err) {
        
        if (
          err?.status === 403 ||
          err?.message?.toLowerCase()?.includes("blocked")
        ) {
          setIsBlocked(true);
          setAlert({
            type: "error",
            title: "Account Blocked",
            message:
              "Your seller account has been blocked by admin. Please contact support.",
          });
        } else {
          setAlert({
            type: "error",
            title: "Failed to Load Profile",
            message:
              "An unexpected error occurred while fetching your profile.",
          });
        }
      }
    };

    fetchData();
  }, [dispatch]);

  
  const handleEditDraft = (car) => {
    try {
      localStorage.setItem("carUploadDraft", JSON.stringify(car));
      setActiveTab("upload");
      setAlert({
        type: "info",
        title: "Draft Loaded",
        message: `Editing draft: "${car?.title || "Untitled Car"}"`,
      });
    } catch {
      setAlert({
        type: "error",
        title: "Error Loading Draft",
        message: "Unable to load draft. Please try again.",
      });
    }
  };

 
  if (loading) {
    return <LoadingScreen message="Loading seller profile..." />;
  }

  
  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-red-100">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Account Blocked 🚫
          </h2>
          <p className="text-gray-600 mb-6">
            Your seller account has been blocked by the admin.  
            You cannot upload or manage cars at the moment.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => (window.location.href = "/support")}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Contact Support
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const seller = data;
  const user = data.userid;

  
  return (
    <SellerDashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {alert && (
        <CarmazikAlert {...alert} onClose={() => setAlert(null)} />
      )}

      
      {activeTab === "profile" && (
        <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2">
            <User className="h-6 w-6 text-orange-500" />
            Welcome, <span className="font-semibold">{user?.name}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            <InfoBox title="Personal Info" icon={<User />} bg="from-blue-50">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phonenumber}</p>
            </InfoBox>

            <InfoBox title="Business Info" icon={<Building2 />} bg="from-orange-50">
              <p><strong>Shop:</strong> {seller.shopName}</p>
              <p><strong>GST:</strong> {seller.gstNumber}</p>
              <p><strong>Address:</strong> {seller.address}</p>
            </InfoBox>

            <InfoBox title="Documents" icon={<FileText />} bg="from-blue-50">
              <p><strong>PAN:</strong> {seller.panNumber}</p>
              <p><strong>Aadhaar:</strong> {seller.aadhaarNumber}</p>
            </InfoBox>

            <InfoBox title="Bank Details" icon={<CreditCard />} bg="from-orange-50">
              <p><strong>Account:</strong> {seller.bankDetails?.accountNumber}</p>
              <p><strong>IFSC:</strong> {seller.bankDetails?.ifscCode}</p>
            </InfoBox>

            <InfoBox title="Subscription" icon={<Briefcase />} bg="from-blue-50" full>
              <p>
                <strong>Plan:</strong> {seller.subscription?.plan || "Free"}{" "}
                {seller.subscription?.isActive ? "✅" : "❌"}
              </p>
            </InfoBox>
          </div>
        </div>
      )}

      
      {activeTab === "upload" && (
        <div className="bg-white shadow-lg rounded-2xl p-6 border">
          <div className="flex items-center gap-3 mb-6">
            <UploadCloud className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Upload New Car
            </h2>
          </div>
          <UploadCarForm />
        </div>
      )}

      {/* ---------------- CARS TABS ---------------- */}
      {activeTab === "approved" && (
        <Suspense fallback={<LoadingScreen message="Loading approved cars..." />}>
          <ApprovedCars />
        </Suspense>
      )}

      {activeTab === "pending" && (
        <Suspense fallback={<LoadingScreen message="Loading pending cars..." />}>
          <PendingCars />
        </Suspense>
      )}

      {activeTab === "rejected" && (
        <Suspense fallback={<LoadingScreen message="Loading rejected cars..." />}>
          <RejectedCars />
        </Suspense>
      )}

      {activeTab === "draft" && (
        <Suspense fallback={<LoadingScreen message="Loading draft cars..." />}>
          <DraftCars onEditDraft={handleEditDraft} />
        </Suspense>
      )}

      {activeTab === "sold" && (
        <Suspense fallback={<LoadingScreen message="Loading sold cars..." />}>
          <SoldCars />
        </Suspense>
      )}
    </SellerDashboardLayout>
  );
};

const InfoBox = ({ title, icon, bg, full, children }) => (
  <div
    className={`p-4 bg-gradient-to-r ${bg} to-white rounded-xl border ${
      full ? "sm:col-span-2" : ""
    }`}
  >
    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
      {icon} {title}
    </h3>
    {children}
  </div>
);

export default SellerDashboard;
