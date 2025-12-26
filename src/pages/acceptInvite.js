"use client";
import { useContext, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  User2,
  Mail,
  Phone,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import isAuth from "../../components/isAuth";
import { userContext } from "./_app";

function AcceptInvite() {
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [inviteId, setInviteId] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState("loading");
  const [inviteEmail, setInviteEmail] = useState("");

  const loggedUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userDetail"))
      : null;

  useEffect(() => {
    if (!router.query?.token) return;

    Api("get", `auth/acceptInvite?token=${router.query.token}`, "", router)
      .then((res) => {
        if (res?.status === true) {
          const data = res?.data;
          setEmail(data.email);
          setInviteEmail(data.email);
          setInviteId(data.inviteId);
          setOrganizationId(data.organizationId);

          const loggedUser =
            JSON.parse(localStorage.getItem("userDetail")) || null;

          if (loggedUser && loggedUser.email !== data.email) {
            setInviteStatus("wrong-account");
          } else {
            setInviteStatus("form");
          }
        } else {
          setInviteStatus("invalid");
          toast.error(res?.message || "Invalid invite link");
        }
      })
      .catch((err) => {
        setInviteStatus("invalid");
        toast.error(err?.message || "Invalid invite link");
      });
  }, [router.query?.token]);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const submitSignup = async () => {
    if (!form.password || !form?.lastName || !form?.firstName || !form.phone) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const data = {
        phone: form.phone,
        name: form?.firstName + " " + form?.lastName,
        role: "TeamsMember",
        inviteId: inviteId,
        password: form.password,
      };
      console.log(data);

      const res = await Api("post", "auth/signupWithInvite", data, router);
      toast.success(res.message || "Signup successful");
      router.push("/login");
      setForm({});
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {inviteStatus === "loading" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-custom-yellow animate-spin" />
              <p className="text-gray-300 text-lg">Verifying invitation...</p>
            </div>
          </div>
        )}

        {inviteStatus === "form" && (
          <>
            {" "}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-400 hover:text-custom-yellow font-medium text-sm transition-all duration-300 cursor-pointer mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            <div className="bg-custom-black backdrop-blur-sm rounded-2xl md:px-6 px-3 py-4 border border-gray-700 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-custom-yellow rounded-full mb-4">
                  <Mail className="w-8 h-8 text-custom-black" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  You've been invited
                </h1>
                <p className="text-gray-400">
                  Join the organization to a member account
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                          handleChange("firstName", e.target.value)
                        }
                        placeholder="John"
                        required
                        className="w-full bg-gray-900/50 text-white p-3 pl-11 rounded-xl border border-gray-700 focus:border-custom-yellow focus:outline-none focus:ring-2 focus:ring-custom-yellow/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) =>
                          handleChange("lastName", e.target.value)
                        }
                        placeholder="Doe"
                        required
                        className="w-full bg-gray-900/50 text-white p-3 pl-11 rounded-xl border border-gray-700 focus:border-custom-yellow focus:outline-none focus:ring-2 focus:ring-custom-yellow/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-gray-900/30 text-gray-200 p-3 pl-11 rounded-xl border border-gray-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="w-full bg-gray-900/50 text-white p-3 pl-11 rounded-xl border border-gray-700 focus:border-custom-yellow focus:outline-none focus:ring-2 focus:ring-custom-yellow/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="Create a strong password"
                      required
                      className="w-full bg-gray-900/50 text-white p-3 pl-11 pr-11 rounded-xl border border-gray-700 focus:border-custom-yellow focus:outline-none focus:ring-2 focus:ring-custom-yellow/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-custom-yellow transition-colors"
                    >
                      {showPass ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={submitSignup}
                  disabled={loading}
                  className="w-full bg-custom-yellow hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-custom-yellow/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Ragister & Join Team
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-center text-gray-400 text-sm">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("login")}
                    className="text-custom-yellow hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </>
        )}

        {inviteStatus === "wrong-account" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Wrong Account
              </h1>
              <p className="text-gray-400">
                This invitation was sent to a different email address
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Invitation for:</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-custom-yellow" />
                  {inviteEmail}
                </p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                <p className="text-sm text-gray-400 mb-1">
                  Currently signed in as:
                </p>
                <p className="text-white font-medium flex items-center gap-2">
                  <User2 className="w-4 h-4 text-gray-400" />
                  {JSON.parse(localStorage.getItem("userDetail"))?.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setUser({});
                toast.info("Signed out successfully");
                localStorage.removeItem("userDetail");
                localStorage.removeItem("token");
                setInviteStatus("form");
              }}
              className="w-full bg-custom-yellow hover:bg-yellow-500 cursor-pointer text-black font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-custom-yellow/20"
            >
              Sign Out to Continue
            </button>
          </div>
        )}

        {inviteStatus === "invalid" && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Invalid Invitation
              </h1>
              <p className="text-gray-400 mb-6">
                This invite link is invalid or has expired.
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 bg-custom-yellow hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-custom-yellow/20 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default isAuth(AcceptInvite);
