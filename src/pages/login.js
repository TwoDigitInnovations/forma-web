"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

import Image from "next/image";
export default function Login(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({ email: "", password: "" });
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

        if (
          user.role === "Admin" ||
          user.role === "Organization" ||
          user.role === "TeamsMember" ||
          user.role === "User"
        ) {
          localStorage.setItem("userDetail", JSON.stringify(user));
          localStorage.setItem("token", res.data?.token);
          setUser(user);

          toast.success(res.data.message);

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
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        props.loader(true);
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
        props.loader(false);
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <div className="min-h-[700px] bg-gradient-to-b from-blue-100 via-white to-blue-100 text-white flex items-center justify-center relative overflow-hidden px-4 py-6">
      <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[160px] opacity-10 pointer-events-none"></div>

      <div className="relative w-full max-w-md z-20">
        <div
          className=" rounded-3xl   p-6 md:p-8 transition-all duration-300 bg-white
backdrop-blur-md
border border-lime-400/20
shadow-[0_0_30px_rgba(163,230,53,0.1)]
"
        >
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-black">
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-xs md:text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-black text-sm font-semibold uppercase tracking-widest ">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={userDetail.email}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, email: e.target.value })
                  }
                  className={`w-full bg-white border border-blue-200 text-black placeholder-gray-400 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    submitted && !userDetail.email
                      ? "border-red-500 bg-red-900/20"
                      : "border-gray-700"
                  }`}
                />
              </div>
              {submitted && !userDetail.email && (
                <p className="text-red-400 text-xs mt-1">Email is required</p>
              )}
            </div>

            <div>
              <label className="block text-black text-sm font-semibold uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={userDetail.password}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, password: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className={`w-full bg-white border border-blue-200 text-black placeholder-gray-400 p-3 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 ${
                    submitted && !userDetail.password
                      ? "border-red-500 bg-red-900/20"
                      : "border-gray-700"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPass ? (
                    <EyeOff className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-blue-500" />
                  )}
                </button>
              </div>
              {submitted && !userDetail.password && (
                <p className="text-red-400 text-xs mt-1">
                  Password is required
                </p>
              )}
            </div>
            <div className="flex justify-end -mt-3 mb-3">
              <span
                className="text-sm  hover:underline
text-blue-500 cursor-pointer "
                onClick={() => router.push("/Forgotpassword")}
              >
                {" "}
                Forgot Password
              </span>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full text-white bg-blue-500 font-semibold py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-b-2 border-black rounded-full"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                  Sign In <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </button>
            <div className="flex justify-center items-center ">
              <div className="flex-1 h-px bg-gray-300 "></div>
              <span className="text-gray-400 px-3 text-xs font-medium text-center uppercase">
                or
              </span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <button
              onClick={() => googleSignup()}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-black py-3 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 cursor-pointer"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
              Continue with Google
            </button>
          </div>

          <p className="text-black text-sm mt-4 text-center">
            {" "}
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => router.push("/ragister")}
            >
              {" "}
              ragister here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
