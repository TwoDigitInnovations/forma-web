"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, Eye, EyeOff, User2 } from "lucide-react";
import { Api } from "@/services/service";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import isAuth from "../../components/isAuth";

function AcceptInvite() {
  const [showPass, setShowPass] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
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

  useEffect(() => {
    if (router.query?.token) {
      Api("get", `auth/acceptInvite?token=${router.query?.token}`, "", router)
        .then((res) => {
          const data = res?.data;
          setEmail(data.email);
          setOrganizationId(data.organizationId);
          setInviteId(data?.inviteId);
        })
        .catch(() => {
          toast.error("Invite expired");
        });
    }
  }, [router].query);

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
        ...form,
        name: form?.firstName + form?.lastName,
        role: "User",
        inviteId: inviteId,
      };

      const res = await Api("post", "auth/signupWithInvite", data, router);

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
                  <div className="bg-gray-200 rounded-full p-2">
                    <User2 className="w-12 h-12 text-custom-yellow" />
                  </div>
                  <h2 className="text-white text-2xl font-bold ">
                    You've been invited
                  </h2>
                  <p> Join the organization to get started </p>
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
                    value={email}
                    readOnly
                    // onChange={(e) => handleChange("email", e.target.value)}
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

export default isAuth(AcceptInvite);
