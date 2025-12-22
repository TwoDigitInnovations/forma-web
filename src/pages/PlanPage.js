import React, { useContext, useState, useEffect } from "react";
import { Check, Mail } from "lucide-react";
import isAuth from "../../components/isAuth";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";

function PricingPage() {
  const [allPlanData, setAllPlanData] = useState([]);
  const router = useRouter();
  const [user] = useContext(userContext);

  useEffect(() => {
    getAllPlan();
  }, []);

  const getAllPlan = async () => {
    Api("get", `price-plan/getAllPlan`, "", router)
      .then((res) => {
        if (res?.status === true) {
          setAllPlanData(res.data?.data || []);
        }
      })
      .catch((err) => {
        toast.error("Failed to load roads");
      });
  };

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

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center">
        <button className="px-4 text-shadow-2xs py-2 mb-3 border border-custom-yellow bg-custom-black text-custom-yellow rounded-full hover:bg-gray-700">
          Welcome {user?.name}
        </button>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Activate Your Account
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Choose a subscription plan to start managing your construction
          projects, or wait for an organization invitation.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-xl font-semibold mb-2">
              Contractor {allPlanData[0]?.name}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              For independent contractors
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold">
                {allPlanData[0]?.currency === "USD" ? "$" : ""}
                {allPlanData[0]?.priceMonthly}
              </span>
              <span className="text-gray-400 ml-2">/mo</span>
            </div>
            <button
              className="w-full py-3 cursor-pointer bg-gray-800 text-white rounded-lg hover:bg-gray-700 mb-6"
              onClick={() =>
                router.push(`/Checkout?role=User&planId=${allPlanData[0]?._id}`)
              }
            >
              Get Started
            </button>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Basic task management
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Up to 2 projects</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Community support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">5 GB storage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  {" "}
                  No team collaboration
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-b from-yellow-500/20 to-gray-900 rounded-2xl p-8 border-2 border-yellow-400 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                style={{ backgroundColor: "#e0f349" }}
                className="px-4 py-1 rounded-full text-black text-sm font-medium"
              >
                POPULAR PLAN
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Construction {allPlanData[1]?.name}
            </h3>
            <p className="text-gray-400 text-sm mb-6">For construction teams</p>
            <div className="mb-6">
              <span className="text-5xl font-bold">
                {allPlanData[1]?.currency === "USD" ? "$" : ""}
                {allPlanData[1]?.priceMonthly}
              </span>
              <span className="text-gray-400 ml-2">/user/per month</span>
            </div>
            <button
              style={{ backgroundColor: "#e0f349" }}
              onClick={() =>
                router.push(
                  `/Checkout?role=Organization&planId=${allPlanData[1]?._id}`
                )
              }
              className="w-full py-3 text-black cursor-pointer font-medium rounded-lg hover:opacity-90 mb-6"
            >
              Start Free Trial
            </button>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Everything in Individual</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Team collaboration on projects</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Shared project access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">10 GB storage per user</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Priority email support</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <p className="text-gray-400 text-sm mb-6">
              For large organizations
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold">Custom</span>
            </div>
            <button className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 mb-6 cursor-pointer">
              Contact Sales
            </button>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  SSO & advanced security
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Dedicated account manager
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Unlimited storage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Custom contracts & invoicing
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-px border-gray-100 mt-8 max-w-2xl mx-auto bg-[#0b0f19] text-white rounded-2xl p-6 space-y-6 shadow-lg">
          {/* Top Section */}
          <div className="flex items-start gap-4">
            <div className="bg-[#111827] p-3 rounded-xl">
              <Mail className="h-6 w-6 text-gray-300" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Waiting for an organization invitation?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                If your organization is already using TaskTruss, ask your team
                administrator to send you an invitation. You'll receive an email
                with a link to join their subscription.
              </p>
            </div>
          </div>

          <div className="bg-[#0f1629] border border-[#1f2937] rounded-xl p-4 flex items-center gap-3">
            <div className="text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm">
                Your account is registered with{" "}
                <span className="text-yellow-400 font-medium">
                  {user?.email}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Make sure your administrator uses this email address when
                sending the invitation.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-gray-500 max-w-2xl mx-auto">
          {" "}
          All plans include secure data storage, mobile access for field teams,
          and 24/7 system availability. Enterprise customers receive dedicated
          support and custom integrations.
        </p>
      </section>
    </div>
  );
}
export default isAuth(PricingPage);
