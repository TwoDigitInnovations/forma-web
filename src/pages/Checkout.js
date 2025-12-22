import React, { useState, useEffect, useContext } from "react";
import { CreditCard, ArrowLeft, Check, Users, User } from "lucide-react";
import { useRouter } from "next/router";
import isAuth from "../../components/isAuth";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { PlanSuccessPopup } from "../../components/AllComponents";

function RoleBasedCheckout(props) {
  const [role, setRole] = useState("user");
  const [seats, setSeats] = useState(2);
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  const [planId, setPlanId] = useState(null);
  const [planData, setPlanData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [billingType, setBillingType] = useState("monthly");

  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userDetail"));

    if (!user || !user._id) {
      router.replace("/");
      return;
    }

    let hasActiveSubscription = false;

    if (user.role === "TeamsMember" && user.OrganizationId) {
      const org = user.OrganizationId;

      hasActiveSubscription =
        org.status === "active" &&
        org.subscription &&
        org.subscription.status === "active" &&
        org.subscription.planEndDate &&
        new Date(org.subscription.planEndDate) > new Date();
    } else {
      hasActiveSubscription =
        user.subscription &&
        user.subscription.status === "active" &&
        user.subscription.planEndDate &&
        new Date(user.subscription.planEndDate) > new Date();
    }

    if (hasActiveSubscription) {
      router.replace("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    if (router.query.role) {
      setRole(router.query.role);
      setPlanId(router.query.planId);
      getPlanDetails(router.query.planId);
    }
  }, [router.isReady, router.query.role]);

  const getPlanDetails = (planId) => {
    Api("get", `price-plan/getPlanById/${planId}`, "", router)
      .then((res) => {
        if (res?.status === true) {
          setPlanData(res.data || []);
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to load roads");
      });
  };

  const calculateTotal = () => {
    if (!planData || !role) return 0;

    switch (role) {
      case "User":
        return planData.priceMonthly;

      case "Organization":
        return planData.priceMonthly * seats;

      default:
        return 0;
    }
  };

  const handleSeatsChange = (change) => {
    const newSeats = seats + change;
    if (newSeats >= 2) {
      setSeats(newSeats);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    try {
      if (
        !formData.cardholderName ||
        !formData.cardNumber ||
        !formData.expiry ||
        !formData.cvc
      ) {
        toast.error("Please fill in all payment details");
        return;
      }
      props.loader(true);

      const payload = {
        planId: planId,
        total: calculateTotal(),
        billingType: billingType || "monthly",
        teamSize: role === "Organization" ? seats : 1,
        paymentMethod: "upi",
        transactionId: `demo_txn_${Date.now()}`,
        role: role,
      };

      console.log(payload, "paylod");

      const res = await Api("post", "price-plan/buyPlan", payload, router);

      if (res?.status) {
        toast.success("Plan purchased successfully");
        const userDetail = res?.data?.user;
        console.log(res.data);

        localStorage.setItem("userDetail", JSON.stringify(userDetail));
        setShowSuccess(true);
        props.loader(false);
      }
    } catch (err) {
      props.loader(false);
      toast.error(err?.message || "Something went wrong");
    }
  };

  const userFeatures = [
    "Unlimited Projects",
    "Basic Gantt Charts",
    "5GB Storage",
    "Email Support",
  ];

  const orgFeatures = [
    "Everything in Solo",
    "Team Resource Management",
    "Advanced Analytics",
    "Admin Dashboard",
  ];

  return (
    <>
      <div className="min-h-screen bg-black text-white p-4 md:p-8">
        <div className="max-w-5xl mx-auto mb-8">
          <button
            className="flex items-start gap-2 cursor-pointer text-gray-400 hover:text-white transition-colors mb-8 max-w-6xl"
            onClick={() => router.push("/PlanPage")}
          >
            <ArrowLeft size={20} />
            <span>Back to plans</span>
          </button>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-800">
            <h2 className="text-3xl font-bold mb-6">Order Summary</h2>

            <div
              className={`flex justify-between items-center mb-6 pb-6 ${
                role === "Organization" ? "border-b border-gray-700" : ""
              }`}
            >
              <span className="text-gray-400">Plan</span>
              <span className="font-semibold text-xl">
                {role === "User" ? "Contractor Solo" : "Construction Team"}
              </span>
            </div>

            {role === "Organization" && (
              <div className="mb-6">
                <p className="text-gray-300 mb-3">Number of seats</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSeatsChange(-1)}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
                    disabled={seats <= 2}
                  >
                    −
                  </button>
                  <div className="w-24 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-xl font-semibold">
                    {seats}
                  </div>
                  <button
                    onClick={() => handleSeatsChange(1)}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Minimum 2 users required
                </p>

                <div className="flex justify-between items-center mt-4 text-gray-400">
                  <span>
                    ${planData?.priceMonthly}/user × {seats} users
                  </span>
                  <span>${planData?.priceMonthly * seats}/mo</span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-8 py-6 border-y border-gray-700">
              <span className="text-xl">Total</span>
              <span className="text-4xl font-bold text-custom-yellow">
                ${calculateTotal()}
                <span className="text-lg text-gray-400">/month</span>
              </span>
            </div>

            <div>
              <p className="text-gray-400 mb-4">Includes:</p>
              <div className="space-y-3">
                {(role === "User" ? userFeatures : orgFeatures).map(
                  (feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check
                        className="text-custom-yellow flex-shrink-0"
                        size={20}
                      />
                      <span className="text-gray-200">{feature}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-custom-yellow" size={28} />
              <h2 className="text-3xl font-bold">Payment Details</h2>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 mb-6 flex items-center gap-2">
              <span className="text-gray-400 text-sm">
                🔒 Demo mode - enter any values to subscribe
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow transition-all"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow transition-all"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">CVC</label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow transition-all"
                    placeholder="123"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-custom-yellow text-black font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg cursor-pointer"
              >
                Pay ${calculateTotal()}/month
              </button>

              <p className="text-sm text-gray-500 text-center">
                By subscribing, you agree to our Terms of Service and Privacy
                Policy. You can cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PlanSuccessPopup
        open={showSuccess}
        onDashboard={() => router.push("/dashboard")}
      />
    </>
  );
}

export default isAuth(RoleBasedCheckout);
