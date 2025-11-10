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

const ApprovedCars = lazy(() =>
  import("../../components/dashboard/AprrovedCars")
);
const PendingCars = lazy(() =>
  import("../../components/dashboard/PendingCars")
);
const RejectedCars = lazy(() =>
  import("../../components/dashboard/RejectedCars")
);
const DraftCars = lazy(() => import("../../components/dashboard/DraftCars"));
const SoldCars = lazy(() => import("../../components/dashboard/SoldCars"));

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("profile");
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProfile("seller"));
      } catch (err) {
        setAlert({
          type: "error",
          title: "Failed to Load Profile",
          message: "An unexpected error occurred while fetching your profile.",
        });
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
        message: `Editing draft: "${car.title || "Untitled Car"}"`,
      });
    } catch (err) {
      console.error("Failed to load draft:", err);
      setAlert({
        type: "error",
        title: "Error Loading Draft",
        message: "Unable to load the selected draft. Please try again.",
      });
    }
  };

  if (loading) return <LoadingScreen message="Loading seller profile..." />;

  if (error)
    return (
      <div className="text-center text-red-500 mt-10 font-medium">
        {error || "Failed to load seller data."}
      </div>
    );

  if (!data) return null;

  const seller = data;
  const user = data.userid;

  return (
    <SellerDashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {alert && <CarmazikAlert {...alert} onClose={() => setAlert(null)} />}

      {activeTab === "profile" && (
        <div className="bg-white/90 backdrop-blur-xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 rounded-2xl transition-all duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent flex items-center gap-2 flex-wrap">
            <User className="h-6 w-6 text-orange-500" /> Welcome,{" "}
            <span className="font-semibold">{user?.name}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            <InfoBox
              title="Personal Info"
              icon={<User className="h-5 w-5 text-blue-600" />}
              bg="from-blue-50"
            >
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phonenumber}
              </p>
            </InfoBox>

            <InfoBox
              title="Business Info"
              icon={<Building2 className="h-5 w-5 text-orange-600" />}
              bg="from-orange-50"
            >
              <p>
                <strong>Shop:</strong> {seller.shopName || "N/A"}
              </p>
              <p>
                <strong>GST:</strong> {seller.gstNumber}
              </p>
              <p>
                <strong>Address:</strong> {seller.address}
              </p>
            </InfoBox>

            <InfoBox
              title="Documents"
              icon={<FileText className="h-5 w-5 text-blue-600" />}
              bg="from-blue-50"
            >
              <p>
                <strong>PAN:</strong> {seller.panNumber}
              </p>
              <p>
                <strong>Aadhaar:</strong> {seller.aadhaarNumber}
              </p>
            </InfoBox>

            <InfoBox
              title="Bank Details"
              icon={<CreditCard className="h-5 w-5 text-orange-600" />}
              bg="from-orange-50"
            >
              <p>
                <strong>Account No:</strong>{" "}
                {seller.bankDetails?.accountNumber || "N/A"}
              </p>
              <p>
                <strong>IFSC:</strong> {seller.bankDetails?.ifscCode || "N/A"}
              </p>
            </InfoBox>

            <InfoBox
              title="Subscription"
              icon={<Briefcase className="h-5 w-5 text-blue-600" />}
              bg="from-blue-50"
              full
            >
              <p>
                <strong>Plan:</strong> {seller.subscription?.plan || "Free"}{" "}
                {seller.subscription?.isActive ? (
                  <span className="text-green-600 font-medium">Active ✅</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactive ❌</span>
                )}
              </p>
            </InfoBox>
          </div>
        </div>
      )}

      {activeTab === "upload" && (
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <UploadCloud className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              Upload New Car
            </h2>
          </div>
          <UploadCarForm />
        </div>
      )}

      {activeTab === "approved" && (
        <Suspense
          fallback={<LoadingScreen message="Loading approved cars..." />}
        >
          <ApprovedCars />
        </Suspense>
      )}

      {activeTab === "pending" && (
        <Suspense
          fallback={<LoadingScreen message="Loading pending cars..." />}
        >
          <PendingCars />
        </Suspense>
      )}

      {activeTab === "rejected" && (
        <Suspense
          fallback={<LoadingScreen message="Loading rejected cars..." />}
        >
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
    className={`p-4 sm:p-5 bg-gradient-to-r ${bg} to-white rounded-xl border ${
      bg.includes("blue") ? "border-blue-100" : "border-orange-100"
    } ${full ? "sm:col-span-2" : ""}`}
  >
    <h3
      className={`text-lg font-semibold ${
        bg.includes("blue") ? "text-blue-700" : "text-orange-700"
      } flex items-center gap-2 mb-2`}
    >
      {icon} {title}
    </h3>
    {children}
  </div>
);

export default SellerDashboard;
