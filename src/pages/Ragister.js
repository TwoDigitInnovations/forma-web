"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  CreditCard,
  Check,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import MultiStepSignup from "../../components/SingupOrg";

function Signup() {
  const [role, setRole] = useState("User"); // User | Organization
  const [showPass, setShowPass] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    if (!router.isReady) return;
    setRole(router.query.role || "User");
  }, [router.isReady, router.query.role]);

  const [billingType, setBillingType] = useState("annually"); // monthly | annually
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitSignup = async () => {
    if (
      !form.email ||
      !form.password ||
      !form?.lastName ||
      form?.firstName ||
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
        role,
        billingType,
      };

      const res = await Api("post", "auth/register", data, router);

      toast.success(res.message || "Signup successful");
      setOpen(true);
      router.push("/login");
      setForm({});
      setBillingType("annually");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center md:px-6 px-4 py-14">
      <div className="">
        <button
          onClick={() => router.push("/")}
          className="flex gap-4 text-white font-semibold text-lg  rounded-xl transition-all duration-300 cursor-pointer mb-2"
        >
          <ArrowLeft /> Back
        </button>

        {isOpen && (
          <div className="w-full mx-auto shadow-2xl flex justify-center items-center">
            <div className="md:min-w-xl min-w-[410px]">
              {role === "Organization" && <MultiStepSignup role={role} />}

              {role === "User" && (
                <div className="mb-8 py-8 bg-custom-black border rounded-3xl border-green-500/20  md:p-6 p-4">
                  <div className="flex flex-col justify-center items-center mb-4 gap-2">
                    <h2 className="text-white text-2xl font-bold ">
                      Create User Account
                    </h2>
                    <h2 className="text-gray-400 text-[15px]">
                      Contractor Solo Plan - $29/month
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                        placeholder="John"
                        required
                        className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                        placeholder="Doe"
                        required
                        className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-white">Phone No</label>
                    <input
                      type="number"
                      className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                      placeholder="Enter your phone no"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-white">Email</label>
                    <input
                      type="email"
                      className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-white">Password</label>
                    <input
                      type={showPass ? "text" : "password"}
                      className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                  </div>

                  <button
                    onClick={submitSignup}
                    className="w-full bg-custom-yellow text-lg cursor-pointer text-black py-3 rounded-xl font-semibold hover:scale-102 transition flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin h-5 w-5 cursor-pointer border-black border-b-2 rounded-full"></div>
                    ) : (
                      <>
                        {role === "Organization"
                          ? "Create Team & Pay"
                          : "Create Account"}
                        <ArrowRight />
                      </>
                    )}
                  </button>

                  <p className="text-white text-md mt-6 text-center">
                    {" "}
                    Already have an account?{" "}
                    <span
                      className="text-custom-yellow cursor-pointer"
                      onClick={() => router.push("login")}
                    >
                      {" "}
                      Sign in
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {open && (
          <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
              <div className="bg-custom-black backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                <div className="flex justify-center mt-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-xl">
                    <CreditCard
                      className="w-8 h-8 text-custom-yellow"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div className="text-center px-8 pt-4 pb-6">
                  <h1 className="text-3xl font-bold text-white mb-3">
                    Complete Your Purchase
                  </h1>
                  <p className="text-slate-400 text-lg">
                    Start your 14-day free trial
                  </p>
                </div>

                <div className="px-8 pb-6">
                  <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-700/50">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700/50">
                      <span className="text-slate-300 text-lg">
                        Contractor Solo Plan
                      </span>
                      <span className="text-white text-xl font-bold">
                        $29.00
                        <span className="text-slate-400 text-base font-normal">
                          /mo
                        </span>
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-slate-300 text-lg block">
                          Due today
                        </span>
                        <span className="text-slate-500 text-sm">
                          14-day free trial, then $29/month. Cancel anytime.
                        </span>
                      </div>
                      <span className="text-custom-yellow text-3xl font-bold">
                        $0.00
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-6">
                  <h3 className="text-white font-semibold text-lg mb-4">
                    What's included:
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Unlimited Projects",
                      "Basic Gantt Charts",
                      "5GB Storage",
                      "Email Support",
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 group hover:translate-x-1 transition-transform duration-200"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                          <Check
                            className="w-3.5 h-3.5 text-green-500"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-slate-300 group-hover:text-white transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-8 pb-6">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-emerald-300 text-sm leading-relaxed">
                      This is a demo checkout. No real payment will be
                      processed.
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-8 pb-8">
                  <button
                    // onClick={handleStartTrial}
                    className="w-full bg-custom-yellow text-slate-900 font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>

              {/* Footer Text */}
              <p className="text-center text-slate-500 text-sm mt-6">
                By starting your trial, you agree to our Terms & Privacy Policy
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
