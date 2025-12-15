import React, { useState } from "react";
import {
  CreditCard,
  Users,
  Building2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Api } from "@/services/service";

function MultiStepSignup({ role }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    organizationName: "",
    teamSize: "2",
  });

  const teamSizeOptions = [
    { value: "2", label: "2 users - $198/month" },
    { value: "3", label: "3 users - $297/month" },
    { value: "5", label: "5 users - $495/month" },
    { value: "10", label: "10 users - $990/month" },
    { value: "15", label: "15 users - $1,485/month" },
    { value: "20", label: "20 users - $1,980/month" },
    { value: "25", label: "25 users - $2,475/month" },
    { value: "50", label: "50 users - $4,950/month" },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = async () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      if (
        !formData.email ||
        !formData.password ||
        !formData?.lastName ||
        formData?.firstName
      ) {
        toast.error("All fields are required");
        return;
      }

      try {
        setLoading(true);
        const data = {
          ...form,
          name: formData?.firstName + formData?.lastName,
          role,
        };
        setCurrentStep(3);
        return console.log(data);

        const res = await Api("post", "auth/register", data, router);
        toast.success(res.message || "Signup successful");
        router.push("/login");
        setFormData({});
      } catch (err) {
        toast.error(err.message || "Something went wrong");
      }
    }
  };

  const handlePayment = () => {
    console.log("Form submitted for Payment:");
  };

  const stepConfig = {
    1: {
      icon: <Users className="w-8 h-8 text-custom-yellow" strokeWidth={2.5} />,
      title: "Create Admin Account",
      subtitle: "Construction Team Plan - $99/user/month",
    },
    2: {
      icon: (
        <Building2 className="w-8 h-8 text-custom-yellow" strokeWidth={2.5} />
      ),
      title: "Set Up Your Organization",
      subtitle: "Construction Team Plan - $99/user/month",
    },
    3: {
      icon: (
        <CreditCard className="w-8 h-8 text-custom-yellow" strokeWidth={2.5} />
      ),
      title: "Complete Your Purchase",
      subtitle: "Start your 14-day free trial",
    },
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* {currentStep > 1 && (
          <button
            // onClick={""}
            className="flex gap-4 text-white font-semibold text-lg  rounded-xl transition-all duration-300 cursor-pointer mb-2"
          >
            <ArrowLeft /> Back
          </button>
        )} */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? "w-20 bg-custom-yellow"
                  : step < currentStep
                  ? "w-20 bg-custom-yellow"
                  : "w-20 bg-slate-600"
              }`}
            />
          ))}
        </div>

        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="flex justify-center mt-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-xl animate-pulse">
              {stepConfig[currentStep].icon}
            </div>
          </div>
          <div className="text-center px-6 pt-6 pb-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {stepConfig[currentStep].title}
            </h1>
            <p className="text-slate-400 text-md">
              {stepConfig[currentStep].subtitle}
            </p>
          </div>

          <div className="md:px-6 px-4 pb-8">
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleInputChange}
                    placeholder="Acme Construction Co."
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Team Size
                  </label>
                  <div className="relative">
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all cursor-pointer"
                    >
                      {teamSizeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-slate-500 text-sm mt-2">
                    You can add or remove users anytime
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@company.com"
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="At least 8 characters"
                      className="w-full bg-slate-900/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
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
                    <span className="text-yellow-500 text-3xl font-bold">
                      $0.00
                    </span>
                  </div>
                </div>

                <div>
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

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  <p className="text-emerald-300 text-sm leading-relaxed">
                    This is a demo checkout. No real payment will be processed.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 ">
              <div className="flex md:flex-row flex-col gap-4">
                {(currentStep === 1 || currentStep === 2) && (
                  <button
                    onClick={handleContinue}
                    className={`font-semibold cursor-pointer text-lg py-3 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-[1.02] active:scale-[0.98] ${
                      currentStep === 1 ? "w-full" : "flex-1"
                    } bg-custom-yellow text-slate-900`}
                  >
                    {currentStep === 2 ? "Continue to Payment" : "Continue"}
                  </button>
                )}

                {currentStep === 3 && (
                  <button
                    onClick={handlePayment}
                    className="font-semibold cursor-pointer text-lg py-3 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-[1.02] active:scale-[0.98] flex-1 bg-custom-yellow text-slate-900"
                  >
                    Start Free Trial
                  </button>
                )}
              </div>

              <p className="text-white text-md mt-3 text-center">
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
          </div>
        </div>

        {currentStep === 3 && (
          <p className="text-center text-slate-500 text-sm mt-6">
            By starting your trial, you agree to our Terms & Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
}

export default MultiStepSignup;
