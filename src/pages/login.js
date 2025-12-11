"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import BeforeLoginNavbar from "../../components/beforLoginNavbar";
import Footer from "../../components/Footer";

export default function Login(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

  const submit = async () => {
    setSubmitted(true);

    if (!userDetail.email || !userDetail.password) {
      toast.error("Missing credentials");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api("post", "auth/login", { ...userDetail }, router);
      if (res?.status) {
        const user = res.data.user;
        if (user.role === "Admin" || user.role === "Provider") {
          localStorage.setItem("userDetail", JSON.stringify(user));
          localStorage.setItem("token", res.data?.token);
          setUser(user);
          setUserDetail({ email: "", password: "" });
          toast.success(res.data.message);
          router.push("/");
          props.loader(false);
          setLoading(false);
        } else {
          toast.error(res.data.message || "You are not authorized");
        }
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      props.loader(false);
      setLoading(false);
      console.error(err);
      toast.error(err?.message || "Something went Wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black ">
      <BeforeLoginNavbar />
      <div className="flex items-center justify-center p-4 mt-8">
        <div className="absolute inset-0 bg-custom-green/20">
          <div
            className="absolute inset-20"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(223, 243, 73, 0.15) 1px, transparent 0)`,
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="relative w-full max-w-md">
          {/* Main Login Card */}
          <div className="bg-gray-900 backdrop-blur-sm shadow-2xl rounded-3xl md:p-8 p-5 transform hover:scale-[1.02] transition-all duration-300 border border-custom-green/30">
            {/* Logo Section */}
            <div className="text-center md:mb-8 mb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2"></div>
              </div>
              <h1 className="md:text-2xl text-xl font-bold text-custom-yellow mb-2">
                Welcome Back!
              </h1>
              <p className="text-custom-yellow md:text-sm text-[12px]">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-custom-yellow">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-custom-green" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 md:text-[16px] text-[14px] border text-white rounded-xl focus:ring-2 focus:ring-custom-green focus:border-transparent outline-none transition-all duration-200 bg-gray-800 ${
                      submitted && !userDetail.email
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700 focus:bg-gray-800"
                    }`}
                    value={userDetail.email}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, email: e.target.value })
                    }
                  />
                </div>
                {submitted && !userDetail.email && (
                  <p className="text-red-400 text-xs font-medium flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    email is required
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-custom-yellow">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-custom-green" />
                  </div>

                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full pl-10 text-white md:text-[16px] text-[14px] pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-custom-green focus:border-transparent outline-none transition-all duration-200 bg-gray-800 ${
                      submitted && !userDetail.password
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700 focus:bg-gray-800"
                    }`}
                    value={userDetail.password}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, password: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        submit(); // login function call
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <EyeOff className="h-5 w-5 text-custom-yellow transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-custom-yellow transition-colors" />
                    )}
                  </button>
                </div>
                {submitted && !userDetail.password && (
                  <p className="text-red-400 text-xs font-medium flex items-center">
                    <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                    Password is required
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="w-full bg-custom-yellow text-black font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-custom-green/30 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:bg-custom-yellow"
              >
                {loading ? (
                  <div className="flex items-center justify-center cursor-pointer">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center cursor-pointer">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-custom-green/70">
                © 2025 Forma All rights reserved.
              </p>
            </div>
          </div>

          <div
            className="absolute -top-14 -left-10 w-32 h-32 rounded-full bg-custom-green blur-md opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute -bottom-8 -right-10 w-32 h-32 bg-custom-green rounded-full blur-md opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
