"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";

function Forgotpassword(props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [token, setToken] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const sendOTP = async () => {
    setSubmitted(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api("post", "auth/sendOTP", { email }, router);

      if (res?.status) {
        toast.success(res.data.message || "OTP sent to your email");
        setToken(res?.data?.token);
        setStep(2);
        setSubmitted(false);
      } else {
        toast.error(res?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api(
        "post",
        "auth/verifyOTP",
        { token, otp: otpString },
        router
      );

      if (res?.status) {
        toast.success(res.data.message || "OTP verified successfully");
        setStep(3);
      } else {
        toast.error(res?.data?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setSubmitted(true);

    const { newPassword, confirmPassword } = passwords;

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api(
        "post",
        "auth/changePassword",
        { newPassword, token },
        router
      );

      if (res?.status) {
        toast.success(res.data.message || "Password changed successfully");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(res?.data?.message || "Failed to change password");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < 4) newOtp.push("");
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 3);
    otpRefs[lastIndex].current?.focus();
  };

  return (
    <div className="relative min-h-[750px] md:min-h-[620px] bg-black flex items-center justify-center px-4 py-10">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(223,243,73,0.15) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="relative w-full max-w-md z-20">
        <div className="bg-gray-900 border rounded-3xl border-green-500/20 backdrop-blur-sm p-6 md:p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Create New Password"}
            </h1>
            <p className="text-white text-xs md:text-sm mt-1">
              {step === 1 && "Enter your email to receive OTP"}
              {step === 2 && "Enter the 4-digit code sent to your email"}
              {step === 3 && "Choose a strong password"}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-custom-yellow">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border focus:ring-2 focus:ring-custom-green outline-none transition-all ${
                      submitted && !email
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700"
                    }`}
                  />
                </div>
                {submitted && !email && (
                  <p className="text-red-400 text-xs mt-1">Email is required</p>
                )}
              </div>

              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full bg-custom-yellow cursor-pointer text-black font-semibold py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-b-2 border-black rounded-full"></div>
                    Sending OTP...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Send OTP <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </button>

              <button
                onClick={() => router.push("/login")}
                className="w-full text-custom-yellow font-medium py-2 flex items-center justify-center gap-2 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-4 text-center">
                  Enter OTP
                </label>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={otpRefs[index]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-14 h-14 text-center text-2xl font-bold bg-gray-800 text-custom-yellow rounded-xl border-2 border-gray-700 focus:border-custom-green focus:ring-2 focus:ring-custom-green outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={verifyOTP}
                disabled={loading}
                className="w-full bg-custom-yellow text-black font-semibold py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-b-2 border-black rounded-full"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 cursor-pointer">
                    Verify OTP <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </button>

              <div className="text-center flex justify-between">
                <button
                  onClick={sendOTP}
                  disabled={loading}
                  className="text-custom-yellow text-sm hover:text-white transition-colors disabled:opacity-50 px-2 py-2 hover:bg-gray-600 w-full rounded-2xl cursor-pointer"
                >
                  Resend OTP
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="px-2 text-custom-yellow font-medium py-2 flex items-center justify-center gap-2 hover:text-white hover:bg-gray-600 transition-colors w-full rounded-2xl cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change Email
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-custom-yellow">
                  New Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-xl border focus:ring-2 focus:ring-custom-green outline-none transition-all ${
                      submitted && !passwords.newPassword
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPass ? (
                      <EyeOff className="h-5 w-5 text-custom-yellow" />
                    ) : (
                      <Eye className="h-5 w-5 text-custom-yellow" />
                    )}
                  </button>
                </div>
                {submitted && !passwords.newPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    Password is required
                  </p>
                )}
                {submitted &&
                  passwords.newPassword &&
                  passwords.newPassword.length < 8 && (
                    <p className="text-red-400 text-xs mt-1">
                      Password must be at least 8 characters
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-custom-yellow">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    onKeyDown={(e) => e.key === "Enter" && changePassword()}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-xl border focus:ring-2 focus:ring-custom-green outline-none transition-all ${
                      submitted && !passwords.confirmPassword
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPass ? (
                      <EyeOff className="h-5 w-5 text-custom-yellow" />
                    ) : (
                      <Eye className="h-5 w-5 text-custom-yellow" />
                    )}
                  </button>
                </div>
                {submitted && !passwords.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    Confirm password is required
                  </p>
                )}
                {submitted &&
                  passwords.confirmPassword &&
                  passwords.newPassword !== passwords.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>

              <button
                onClick={changePassword}
                disabled={loading}
                className="w-full bg-custom-yellow text-black font-semibold py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-b-2 border-black rounded-full"></div>
                    Changing Password...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    Change Password <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block absolute -top-14 -left-10 w-32 h-32 rounded-full bg-custom-green blur-md opacity-20"></div>
      <div className="hidden md:block absolute -bottom-10 w-32 h-32 rounded-full bg-custom-green blur-md opacity-20"></div>
    </div>
  );
}

export default Forgotpassword;
