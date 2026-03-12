"use client";

import { useContext, useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { userContext } from "./_app";

function Signup() {
  const [role, setRole] = useState("User");
  const [showPass, setShowPass] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useContext(userContext);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitSignup = async () => {
    if (
      !form.email ||
      !form.password ||
      !form?.lastName ||
      !form?.firstName ||
      !form.phone
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const data = {
        ...form,
        name: form?.firstName + form?.lastName,
        role: "User",
      };

      const res = await Api("post", "auth/register", data, router);

      toast.success(res.message || "Signup successful");
      setOpen(true);
      router.push("/login");
      setForm({});
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);

        const res = await Api(
          "post",
          "auth/googleAuth",
          {
            token: tokenResponse.access_token,
          },
          router,
        );
        if (res?.token) {
          const user = res.user;
          if (
            user.role === "Admin" ||
            user.role === "Organization" ||
            user.role === "TeamsMember" ||
            user.role === "User"
          ) {
            localStorage.setItem("userDetail", JSON.stringify(user));
            localStorage.setItem("token", res?.token);
            setUser(user);

            toast.success(res.message);

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
              router.push("/dashboard");
            } else {
              router.push("/PlanPage");
            }
          } else {
            toast.error(res.data.message || "You are not authorized");
          }
        } else {
          toast.error("Login failed");
        }
      } catch (err) {
        toast.error(err.message || "Google signup failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-100 text-white flex items-center justify-center relative overflow-hidden px-4 py-10">
      <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[160px] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-xl">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-black hover:text-gray-500 font-medium text-sm mb-6 transition-colors duration-200 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          Back to Home
        </button>

        {isOpen && (
          <div className="bg-white border border-blue-100 rounded-3xl shadow-xl p-8">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500 border border-blue-400 rounded-2xl mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-black tracking-tight">
                Create Account
              </h2>
              {/* <p className="text-blue-300/70 text-sm mt-1">
                Join us and get started today
              </p> */}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-black text-sm font-semibold uppercase tracking-widest mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="John"
                  required
                  className="w-full bg-white border border-blue-200 text-black placeholder-gray-400 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-black text-sm font-semibold uppercase tracking-widest mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full bg-white border border-blue-200 text-black placeholder-gray-400 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-black text-sm font-semibold uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-white border border-blue-200 text-black placeholder-gray-400 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-black text-xs font-semibold uppercase tracking-widest mb-2">
                Phone No
              </label>
              <input
                type="number"
                className="w-full bg-white border border-blue-200 text-black placeholder-gray-400 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter your phone No."
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <label className="block text-black text-sm font-semibold uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                className="w-full bg-white border border-blue-200 text-black placeholder-gray-400 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-[38px] text-blue-400/60 hover:text-blue-300 transition-colors duration-200"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              onClick={submitSignup}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-400 hover:to-cyan-400 text-white py-3 rounded-xl font-semibold text-sm tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-white/30 border-b-2 rounded-full"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex  justify-center items-center py-3">
              <div className="flex-1 h-px bg-gray-300 "></div>
              <span className="text-gray-400 px-3 text-xs font-medium text-center uppercase">
                or
              </span>
              <div className="flex-1  h-px bg-gray-300"></div>
            </div>

            <button
              onClick={() => googleSignup()}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-black py-3 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 cursor-pointer"
            >
              <Image src="/google.png" alt="Google" width={18} height={18} />
              Continue with Google
            </button>

            {/* Sign in link */}
            <p className="text-black text-sm mt-6 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-500 hover:text-blue-600 font-semibold cursor-pointer transition-colors duration-200"
                onClick={() => router.push("login")}
              >
                Sign in
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
