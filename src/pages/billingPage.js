import React, { useContext, useEffect, useState } from "react";
import {
  ArrowLeft,
  Receipt,
  ExternalLink,
  Users,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/router";
import isAuth from "../../components/isAuth";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../components/AllComponents";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const calculateDaysLeft = (endDate) => {
  const diff = new Date(endDate).getTime() - new Date().getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
};

function Card({ title, children, icon: Icon }) {
  return (
    <div className="rounded-xl bg-gray-100 border border-gray-300 p-5 hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-4 h-4 text-blue-500" />}
        <p className="text-sm font-medium text-gray-800">{title}</p>
      </div>
      {children}
    </div>
  );
}

function BillingSubscription(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [billingDetails, setBillingDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [autoRenew, setAutoRenew] = useState(user?.subscription?.autoRenew);

  const [nextStatus, setNextStatus] = useState(null); // true | false
  const [isRenewOpen, setIsRenewOpen] = useState(false);

  const handleToggleClick = () => {
    setNextStatus(!autoRenew);
    setIsRenewOpen(true);
  };

  const getProfile = async () => {
    try {
      const res = await Api("get", "auth/profile", "", router);

      if (res?.data) {
        localStorage.setItem("userDetail", JSON.stringify(res.data));
        setUser(res.data);
      }
    } catch (error) {
      console.error("Get profile failed:", error);
    }
  };

  const subscription = user?.subscription;
  console.log(autoRenew);
  console.log("user", user?.subscription?.autoRenew);

  const isSubscriptionInactive =
    !subscription ||
    !["active", "cancelled"].includes(subscription.status) ||
    new Date(subscription.planEndDate) <= new Date();

  const latestBilling = billingDetails[0];
  const billingType =
    subscription?.billingType || latestBilling?.billingType || "monthly";
  const teamSize = subscription?.teamSize || 1;

  const perUserPrice = latestBilling
    ? Math.round(latestBilling.amount / (subscription?.teamSize || 1))
    : billingType === "annually"
      ? 299
      : 99;

  const totalAmount = latestBilling?.amount || perUserPrice * teamSize;
  const nextBillingDate = subscription?.planEndDate;
  const daysLeft = calculateDaysLeft(nextBillingDate);

  const fetchPaymentHistory = async () => {
    try {
      const res = await Api(
        "get",
        `auth/paymenthistory?userId=${user._id}`,
        {},
        router,
      );
      setBillingDetails(res?.data.payments || []);
    } catch (err) {
      toast.error(err.message || "Failed to load billing history");
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      const res = await Api("post", "auth/cancelSubscription", {}, router);
      toast.success(res.message || "Subscription cancelled successfully");
      setIsOpen(false);
      getProfile();
    } catch (err) {
      toast.error(err.message || "Failed to cancel subscription");
    } finally {
      setLoading(false);
    }
  };
  const resumeSubscription = async () => {
    try {
      setLoading(true);
      const res = await Api("post", "auth/resumeSubscription", {}, router);
      toast.success(res.message || "Subscription Resume successfully");
      setIsOpen(false);
      getProfile();
    } catch (err) {
      toast.error(err.message || "Failed to Resume subscription");
    } finally {
      setLoading(false);
    }
  };

  const updateAutoRenew = async () => {
    try {
      props?.loader(true);

      const res = await Api(
        "post",
        "auth/toggleAutoRenew",
        {
          autoRenew: nextStatus,
        },
        router,
      );

      toast.success(res.data?.message || "Subscription updated");
      setAutoRenew(nextStatus);
      setIsRenewOpen(false);
      getProfile();
    } catch (err) {
      toast.error(err.message || "Failed to update subscription");
    } finally {
      props?.loader(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const subscriptionStatus = user?.subscription?.status;

  const statusStyles = {
    active: "bg-blue-500 text-white border-custom-green",
    cancelled: "bg-custom-green text-yellow-200 border-yellow-400",
    expired: "bg-red-100 text-red-700 border-red-500",
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-white md:p-6 p-3">
      <div className="max-w-7xl mx-auto">
        <button
          className="flex items-center gap-2 text-gray-700 hover:text-black mb-6 transition-colors cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2 text-black ">
            Billing & Subscription
          </h1>
          <p className="text-gray-600">
            Manage your subscription and billing information
          </p>
        </div>

        {!isSubscriptionInactive && (
          <div className="mb-6 rounded-2xl bg-white border border-gray-200 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-black">
                  {user?.name}'s Organization
                </h2>
                <p className="text-sm text-gray-600 capitalize mt-1">
                  {subscription.planName} plan • owner
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-4 py-2 rounded-full border font-medium capitalize ${
                    statusStyles[subscriptionStatus] ||
                    "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {subscriptionStatus || "No Subscription"}
                </span>

                <div
                  onClick={handleToggleClick}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                    autoRenew ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                      autoRenew ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>

                <span className="text-sm font-medium text-black">
                  Auto Renew {autoRenew ? "On" : "Off"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card title="Team Size" icon={Users}>
                <div className="flex items-center gap-2 text-2xl font-bold text-black">
                  {teamSize} {teamSize === 1 ? "Member" : "Members"}
                </div>
              </Card>

              <Card title="Billing Cycle" icon={Calendar}>
                <p className="text-xl font-bold text-black capitalize mb-1">
                  {billingType}
                </p>
                <p className="text-sm text-gray-600">
                  ${perUserPrice} per user
                </p>
              </Card>

              <Card title="Total Amount" icon={CreditCard}>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ${totalAmount}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  per {billingType === "monthly" ? "month" : "year"}
                </p>
              </Card>

              <Card title="Next Billing" icon={Calendar}>
                <p className="text-lg font-semibold text-black mb-2">
                  {formatDate(nextBillingDate)}
                </p>
                <span className="inline-block px-3 py-1 text-xs rounded-full bg- text-blue-500 border border-blue-500/30 font-medium">
                  {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                </span>
              </Card>
            </div>

            <div className="flex md:flex-row flex-col justify-end mt-6 gap-4 flex-wrap">
              {user?.role === "Organization" && (
                <button
                  className="px-8 py-2 rounded-xl bg-blue-500 text-white cursor-pointer border border-gray-600 hover:border-gray-500 transition-all duration-300 font-medium"
                  onClick={() => router.push("/teams")}
                >
                  Manage Team
                </button>
              )}
              {user?.subscription?.status === "cancelled" ? (
                <button
                  disabled={loading}
                  onClick={() => setIsOpen(true)}
                  className="px-8 py-2 rounded-xl bg-blue-500 text-white cursor-pointer border border-red-500/50 hover:border-red-500 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resumeing..." : "Resume Subscription"}
                </button>
              ) : (
                <button
                  disabled={loading}
                  onClick={() => setIsConfirmOpen(true)}
                  className="px-8 py-2 rounded-xl bg-blue-500 text-white cursor-pointer border border-red-500/50 hover:border-red-500 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Cancelling..." : "Cancel Subscription"}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
              <Receipt className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-black">
              Billing History
            </h3>
          </div>

          {billingDetails.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No billing history found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {billingDetails.map((item, index) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border border-gray-400/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-300 bg-gray-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 mt-1">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-black capitalize">
                          {item.billingType} Subscription
                        </p>
                        {index === 0 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white border border-blue-500">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Paid on {formatDate(item.paidAt)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 font-mono">
                        Txn: {item.transactionId}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-black mb-2">
                      ${item.amount}{" "}
                      <span className="text-sm text-gray-600">
                        {item.currency}
                      </span>
                    </p>
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-green-200 text-black  capitalize font-medium">
                      {item.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center items-center bg-white border border-gray-200 rounded-2xl p-6 shadow-xl">
          <h3 className="text-2xl font-semibold mb-3 text-black">Need Help?</h3>
          <p className="text-gray-600 mb-6 max-w-[400px] mx-auto">
            Have questions about billing or need to make changes to your
            subscription? Our support team is here to help.
          </p>
          <button className="border bg-blue-500 text-white border-gray-200 hover:border-gray-300 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium  cursor-pointer">
            Contact Support <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        setIsOpen={setIsConfirmOpen}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? You will lose access to all premium features at the end of your billing period."
        onConfirm={cancelSubscription}
        yesText="Yes, Cancel"
        noText="Keep Subscription"
      />

      <ConfirmModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Resume Subscription"
        message="Are you sure you want to resume your subscription? Your access to all premium features will continue without interruption."
        onConfirm={resumeSubscription}
        yesText="Yes, Resume"
        noText="Cancel"
      />

      <ConfirmModal
        isOpen={isRenewOpen}
        setIsOpen={setIsRenewOpen}
        title={nextStatus ? "Enable auto-renew" : "Disable auto-renew"}
        message={
          nextStatus
            ? "Are you sure you want to enable auto-renew? Your subscription will continue automatically."
            : "Are you sure you want to disable auto-renew? Your subscription will not renew automatically."
        }
        onConfirm={updateAutoRenew}
        yesText={nextStatus ? "Yes, Enable" : "Yes, Disable"}
        noText="Cancel"
      />
    </div>
  );
}

export default isAuth(BillingSubscription, ["Organization", "User"]);
