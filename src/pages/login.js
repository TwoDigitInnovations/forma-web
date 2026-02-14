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
        <div className=" rounded-3xl   p-6 md:p-8 transition-all duration-300 bg-[#0f1b2d]/80
backdrop-blur-md
border border-lime-400/20
shadow-[0_0_30px_rgba(163,230,53,0.1)]
">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Welcome Back!
            </h1>
            <p className="text-white text-xs md:text-sm mt-1">
              Sign in to access your dashboard
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-custom-yellow">
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
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border   
focus:ring-2 
focus:ring-lime-400
outline-none transition-all ${
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
              <label className="block text-sm font-semibold text-custom-yellow">
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
                  className={`w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-xl border focus:ring-2 
focus:ring-lime-400 outline-none transition-all ${
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
                    <EyeOff className="h-5 w-5 text-custom-yellow" />
                  ) : (
                    <Eye className="h-5 w-5 text-custom-yellow" />
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
text-custom-yellow cursor-pointer "
                onClick={() => router.push("/Forgotpassword")}
              >
                {" "}
                Forgot Password
              </span>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-custom-yellow text-black font-semibold py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70"
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
            <div className="flex items-center ">
              <div className="flex-1 h-[1px] bg-gray-700"></div>
              <span className="text-gray-400 px-3 text-sm">OR</span>
              <div className="flex-1 h-[1px] bg-gray-700"></div>
            </div>
            <button
              onClick={() => googleSignup()}
              className="w-full flex items-center justify-center gap-3 bg-custom-yellow cursor-pointer text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
              Continue with Google
            </button>
          </div>

          <p className="text-white text-sm mt-4 text-center">
            {" "}
            Don't have an account?{" "}
            <span
              className="text-custom-yellow cursor-pointer"
              onClick={() => router.push("/Ragister")}
            >
              {" "}
              Ragister here
            </span>
          </p>
        </div>
      </div>

      {/* Glow Circles */}
      <div className="hidden md:block absolute -top-14 -left-10 w-32 h-32 rounded-full bg-custom-green blur-md opacity-20"></div>
      <div className="hidden md:block absolute -bottom-10  w-32 h-32 rounded-full bg-custom-green blur-md opacity-20"></div>
    </div>
  );
}
