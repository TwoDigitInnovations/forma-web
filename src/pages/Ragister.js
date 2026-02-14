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
            <div className="md:min-w-lg min-w-[350px]">
              <div className="mb-6 py-6 bg-custom-black border rounded-3xl border-green-500/20  md:p-5 p-3">
               

                <div className="flex flex-col justify-center items-center mb-4 gap-2">
                  <h2 className="text-white text-2xl font-bold ">
                    Create User Account
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
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
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      placeholder="Doe"
                      required
                      className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="text-sm text-white">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="text-sm text-white">Phone No</label>
                  <input
                    type="number"
                    className="w-full bg-gray-800 text-white p-3 rounded-xl mt-1"
                    placeholder="Enter your phone no"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <div className="mb-2 relative">
                  <label className="text-sm text-white">Password</label>

                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full bg-gray-800 text-white p-3 pr-12 rounded-xl mt-1"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-[38px] text-gray-400"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  onClick={submitSignup}
                  className="w-full bg-custom-yellow text-lg cursor-pointer text-black py-2.5 rounded-xl font-semibold hover:scale-102 transition flex justify-center items-center gap-2 mt-4"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 cursor-pointer border-black border-b-2 rounded-full"></div>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight />
                    </>
                  )}
                </button>
                 <div className="flex items-center my-4">
                  <div className="flex-1 h-[1px] bg-gray-700"></div>
                  <span className="text-gray-400 px-3 text-sm">OR</span>
                  <div className="flex-1 h-[1px] bg-gray-700"></div>
                </div>
                 <button
                  onClick={() => googleSignup()}
                  className="w-full flex items-center justify-center gap-3 bg-custom-yellow cursor-pointer text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
                >
                  <Image
                    src="/google.png"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Continue with Google
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
