import React, { useContext, useState } from "react";
import { ArrowLeft, Receipt, Building2, ExternalLink } from "lucide-react";
import isAuth from "../../components/isAuth";
import { useRouter } from "next/router";
import { userContext } from "./_app";

function BillingSubscription() {
  const router = useRouter();
  const [user] = useContext(userContext);
  const [billingDetails, setBillingDetails] = useState([]);
  const isSubscriptionInactive =
    !user?.subscription ||
    user.subscription.status !== "active" ||
    new Date(user.subscription.planEndDate) <= new Date();

  return (
    <div className="min-h-screen bg-black text-white md:p-6 p-3">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-gray-400 text-lg">
            Manage your subscription and billing information
          </p>
        </div>

        <div className="bg-custom-black rounded-lg md:p-6 px-3 py-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-custom-yellow rounded-lg p-3">
              <Building2 className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Organization</h2>
              <p className="text-gray-400">Construction Team Plan • owner</p>
            </div>
          </div>
        </div>

        <div className="bg-custom-black rounded-lg md:p-6 px-3 py-6 mb-6">
          <div className="flex items-start gap-4">
            <Receipt className="w-6 h-6 text-white mt-1" />
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-2">Billing History</h3>
              <p className="text-gray-400">
                View and download your past invoices
              </p>
            </div>
          </div>
        </div>

        {isSubscriptionInactive && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full rounded-2xl bg-custom-black p-10 text-center shadow-xl border border-[#1E293B]">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#111827]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              <h2 className="text-2xl font-semibold text-white">
                No Active Subscription
              </h2>

              <p className="mt-3 text-gray-400 text-sm md:text-base">
                Choose a plan to get started with{" "}
                <span className="text-white font-medium">TaskTruss</span>
              </p>

              <button className="mt-8 inline-flex items-center justify-center rounded-xl bg-yellow-400 px-8 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300 active:scale-95">
                View Plans
              </button>
            </div>
          </div>
        )}

        <div className="bg-custom-black rounded-lg md:p-6 px-3 py-6">
          <h3 className="text-2xl font-semibold mb-4">Need Help?</h3>
          <p className="text-gray-400 mb-6">
            Have questions about billing or need to make changes to your
            subscription?
          </p>
          <button className="bg-transparent border border-gray-600 hover:border-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
            <span>Contact Support</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default isAuth(BillingSubscription, ["Organization"]);
