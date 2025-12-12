"use client";

import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function Signup() {
  const [role, setRole] = useState("User"); // User | Organization
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [billingType, setBillingType] = useState("annually"); // monthly | annually
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitSignup = async () => {
    if (!form.email || !form.password || !form.name || !form.phone) {
      toast.error("All fields are required");
      return;
    }

    // if (role === "Organization" && !form.planId) {
    //   toast.error("Please select a plan");
    //   return;
    // }

    try {
      setLoading(true);
      const data = {
        ...form,
        role,
        billingType,
      };

      const res = await Api("post", "auth/register", data, router);

      toast.success(res.message || "Signup successful");
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
    <div className="min-h-screen bg-black flex justify-center md:p-6 p-4">
      <div className="w-full max-w-7xl  shadow-2xl">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
          <div className="col-span-2 bg-custom-black border border-green-500/20 md:p-6 p-4 rounded-3xl">
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800 p-2 rounded-xl flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    role === "User"
                      ? "bg-custom-yellow text-black"
                      : "text-custom-yellow"
                  }`}
                  onClick={() => setRole("User")}
                >
                  User
                </button>

                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    role === "Organization"
                      ? "bg-custom-yellow text-black"
                      : "text-custom-yellow"
                  }`}
                  onClick={() => setRole("Organization")}
                >
                  Organization
                </button>
              </div>
            </div>

            {role === "Organization" && (
              <div className="mb-8 border border-green-500/20 p-6 rounded-2xl">
                <h2 className="text-custom-yellow text-lg font-bold mb-4">
                  Administrator Account
                </h2>

                {/* Name */}
                <div className="mb-4">
                  <label className="text-sm text-custom-yellow">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-sm text-custom-yellow">Phone No</label>
                  <input
                    type="number"
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="Enter your  phone no"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                {/* Email */}
                <div className="mb-4">
                  <label className="text-sm text-custom-yellow">
                    Work Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="text-sm text-custom-yellow">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1 pr-12"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-4"
                    >
                      {showPass ? (
                        <EyeOff className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-yellow-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {role === "User" && (
              <div className="mb-8">
                <h2 className="text-custom-yellow text-lg font-bold mb-4">
                  Create User Account
                </h2>

                {/* Name */}
                <div className="mb-4">
                  <label className="text-sm text-custom-yellow">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="Enter name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-custom-yellow">Phone No</label>
                  <input
                    type="number"
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="Enter your  phone no"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="text-sm text-custom-yellow">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="text-sm text-custom-yellow">Password</label>
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="border border-green-500/20 p-6 rounded-2xl mb-8">
              <h2 className="text-custom-yellow text-lg font-bold mb-4">
                Secure Payment
              </h2>

              {/* Billing Toggle */}
              <div className="flex gap-2 bg-gray-800 p-2 rounded-xl mb-5 w-fit">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                    billingType === "monthly"
                      ? "bg-custom-yellow text-black"
                      : "text-custom-yellow"
                  }`}
                  onClick={() => setBillingType("monthly")}
                >
                  Monthly
                </button>

                <button
                  className={`px-4 py-2 rounded-lg text-sm cursor-pointer font-medium ${
                    billingType === "annually"
                      ? "bg-custom-yellow text-black"
                      : "text-custom-yellow"
                  }`}
                  onClick={() => setBillingType("annually")}
                >
                  Annually
                </button>
              </div>
            </div>

            <button
              onClick={submitSignup}
              className="w-full bg-custom-yellow text-black py-3 rounded-xl font-semibold hover:scale-105 transition flex justify-center items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-black border-b-2 rounded-full"></div>
              ) : (
                <>
                  {role === "Organization"
                    ? "Create Team & Pay"
                    : "Create Account"}
                  <ArrowRight />
                </>
              )}
            </button>
          </div>

          <div className="w-full col-span-1  mx-auto bg-custom-black text-white shadow-xl border border-green-500/20 p-6 rounded-3xl max-h-[450px] ">
            {/* Order Summary */}
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* Pro Plan */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-300">
                Pro Plan
                <br />
                <span className="text-sm text-gray-500">10 Team Seats</span>
              </p>
              <p className="font-semibold">$150.00</p>
            </div>

            {/* Annual Discount */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-300">Annual Discount (20%)</p>
              <p className="text-green-500 font-semibold">- $30.00</p>
            </div>

            {/* VAT */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-300">VAT (0%)</p>
              <p className="text-gray-300">$0.00</p>
            </div>

            <div className="border-t border-gray-700 my-4"></div>

            {/* Total */}
            <div className="flex justify-between items-center mb-2">
              <p className="text-xl font-bold">Total due today</p>
              <p className="text-3xl font-bold">$120.00</p>
            </div>

            {/* Next Payment */}
            <p className="text-sm text-gray-500 mb-5">
              Next payment: Nov 25, 2024
            </p>

            {/* Guarantee Box */}
            <div className="bg-[#111827] border border-[#1f2937] p-4 rounded-xl">
              <p className="text-sm font-semibold mb-1">Money-back guarantee</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Try TeamSync risk-free for 14 days. If it’s not perfect for your
                team, we’ll refund you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
