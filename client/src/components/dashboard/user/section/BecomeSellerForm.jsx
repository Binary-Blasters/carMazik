import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Progress } from "../../../ui/progress";
import { applyForSellerApi } from "../../../../api/seller";

const TOTAL_STEPS = 5;

const BecomeSellerForm = () => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [applying, setApplying] = useState(false);

  const [sellerData, setSellerData] = useState({
    shopName: "",
    gstNumber: "",
    panNumber: "",
    aadhaarNumber: "",
    accountNumber: "",
    ifscCode: "",
    address: "",
    sellerTypes: [],
  });

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

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow">
      <h3 className="text-2xl font-bold mb-4">Become a Seller</h3>

      <Progress value={progress} className="mb-6" />

      <form onSubmit={handleApplySeller} className="space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {["shopName", "gstNumber", "panNumber", "aadhaarNumber"].map((f) => (
              <input
                key={f}
                placeholder={f.replace(/([A-Z])/g, " $1")}
                value={sellerData[f]}
                onChange={(e) =>
                  setSellerData({ ...sellerData, [f]: e.target.value })
                }
                className="border p-3 rounded"
              />
            ))}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {["accountNumber", "ifscCode"].map((f) => (
              <input
                key={f}
                placeholder={f.replace(/([A-Z])/g, " $1")}
                value={sellerData[f]}
                onChange={(e) =>
                  setSellerData({ ...sellerData, [f]: e.target.value })
                }
                className="border p-3 rounded"
              />
            ))}
          </div>
        )}

        {/* STEP 3 — SELLER TYPE */}
        {step === 3 && (
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { key: "car", title: "Cars" },
              { key: "spare", title: "Spare Parts" },
            ].map((item) => {
              const active = sellerData.sellerTypes.includes(item.key);
              return (
                <div
                  key={item.key}
                  onClick={() =>
                    setSellerData((prev) => ({
                      ...prev,
                      sellerTypes: active
                        ? prev.sellerTypes.filter((t) => t !== item.key)
                        : [...prev.sellerTypes, item.key],
                    }))
                  }
                  className={`border p-4 rounded-xl cursor-pointer ${
                    active
                      ? "bg-orange-50 border-orange-500"
                      : "hover:border-orange-400"
                  }`}
                >
                  <h4 className="font-semibold">{item.title}</h4>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <textarea
            rows="3"
            placeholder="Business Address"
            value={sellerData.address}
            onChange={(e) =>
              setSellerData({ ...sellerData, address: e.target.value })
            }
            className="border p-3 rounded w-full"
          />
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="bg-orange-50 p-4 rounded">
            <p><b>Shop:</b> {sellerData.shopName}</p>
            <p><b>Types:</b> {sellerData.sellerTypes.join(", ")}</p>
            <p><b>GST:</b> {sellerData.gstNumber}</p>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-between">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="px-4 py-2 border rounded bg-gradient-to-r from-blue-500 to-orange-500 text-white">
              <ArrowLeft className="inline h-4 w-4" /> Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button type="button" onClick={nextStep} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded">
              Next <ArrowRight className="inline h-4 w-4" />
            </button>
          ) : (
            <button type="submit" disabled={applying} className="px-6 py-2 bg-green-600 text-white rounded">
              {applying ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              Apply
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BecomeSellerForm;
