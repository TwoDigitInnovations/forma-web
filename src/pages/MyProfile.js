"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  User,
  Mail,
  Phone,
  Lock,
  Edit2,
  Save,
  X,
  Calendar,
  CreditCard,
  Users,
  Shield,
} from "lucide-react";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";

function MyProfile(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [originalDetail, setOriginalDetail] = useState({});

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, []);

  const getProfile = async () => {
    try {
      const res = await Api("get", "auth/profile", "", router);
      if (res?.status) {
        const userData = res?.data;
        console.log(userData);

        setUserDetail({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
        setOriginalDetail({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      return null;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserDetail(originalDetail);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userDetail.name || !userDetail.email || !userDetail.phone) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetail.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!/^\d{10}$/.test(userDetail.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api(
        "post",
        "auth/updateProfile",
        { ...userDetail },
        router
      );

      if (res?.status) {
        const updatedUser = { ...user, ...userDetail };
        localStorage.setItem("userDetail", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setOriginalDetail(userDetail);
        setIsEditing(false);
        toast.success(res.data.message || "Profile updated successfully");
        getProfile();
      } else {
        toast.error(res?.data?.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSubscription = () => {
    if (user?.role === "TeamsMember" && user?.OrganizationId) {
      return user.OrganizationId.subscription;
    }
    return user?.subscription;
  };

  const subscription = getSubscription();
  const hasActiveSubscription =
    subscription &&
    subscription.status === "active" &&
    subscription.planEndDate &&
    new Date(subscription.planEndDate) > new Date();

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(223,243,73,0.15) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Profile
          </h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 border border-green-500/20 rounded-3xl p-4 md:p-8">
            <div className="flex md:flex-row flex-col md:items-center gap-4 justify-between mb-6">
              <h2 className="text-xl font-bold text-custom-yellow flex items-center gap-2">
                <User className="h-6 w-6" />
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-xl font-semibold hover:scale-105 w-fit cursor-pointer transition-transform"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl font-semibold cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-b-2 border-black rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  <input
                    type="text"
                    value={userDetail.name}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none transition-all ${
                      isEditing
                        ? "focus:ring-2 focus:ring-custom-green"
                        : " cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  <input
                    type="email"
                    value={userDetail.email}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none transition-all ${
                      isEditing
                        ? "focus:ring-2 focus:ring-custom-green"
                        : " cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  <input
                    type="tel"
                    value={userDetail.phone}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none transition-all ${
                      isEditing
                        ? "focus:ring-2 focus:ring-custom-green"
                        : " cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Account Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
                  <input
                    type="text"
                    value={user?.role || "N/A"}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-green-500/20 rounded-3xl p-4 md:p-8">
            <h2 className="text-xl font-bold text-custom-yellow flex items-center gap-2 mb-6">
              <CreditCard className="h-6 w-6" />
              Subscription Details
            </h2>

            {hasActiveSubscription ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plan Name */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Plan Name</p>
                    <p className="text-white font-semibold text-lg">
                      {subscription.planName || "N/A"}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-custom-green rounded-full animate-pulse"></div>
                      <p className="text-custom-yellow font-semibold text-lg capitalize">
                        {subscription.status}
                      </p>
                    </div>
                  </div>

                  {/* Billing Type */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Billing Type</p>
                    <p className="text-white font-semibold text-lg capitalize">
                      {subscription.billingType || "N/A"}
                    </p>
                  </div>

                  {/* Team Size */}
                  {subscription.teamSize && (
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-1">Team Size</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-custom-yellow" />
                        <p className="text-white font-semibold text-lg">
                          {subscription.teamSize} Members
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Start Date */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">Start Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-custom-yellow" />
                      <p className="text-white font-semibold">
                        {formatDate(subscription.planStartDate)}
                      </p>
                    </div>
                  </div>

                  {/* End Date */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">End Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-custom-yellow" />
                      <p className="text-white font-semibold">
                        {formatDate(subscription.planEndDate)}
                      </p>
                    </div>
                  </div>

                  {/* Auto Renew */}
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 md:col-span-2">
                    <p className="text-gray-400 text-sm mb-1">Auto Renewal</p>
                    <p className="text-white font-semibold text-lg">
                      {subscription.autoRenew ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/billingPage")}
                  className="w-full mt-4 bg-custom-yellow text-black font-semibold py-3 rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Manage Subscription
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                  <CreditCard className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Active Subscription
                </h3>
                <p className="text-gray-400 mb-6">
                  Subscribe to a plan to unlock all features
                </p>
                <button
                  onClick={() => router.push("/PlanPage")}
                  className="px-8 py-3 bg-custom-yellow text-black font-semibold rounded-xl hover:scale-105 transition-transform inline-block"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed -top-14 -left-10 w-32 h-32 rounded-full bg-custom-green blur-3xl opacity-20 pointer-events-none"></div>
      <div className="fixed -bottom-10 -right-10 w-32 h-32 rounded-full bg-custom-yellow blur-3xl opacity-20 pointer-events-none"></div>
    </div>
  );
}

export default MyProfile;
