import React, { useState } from "react";
import { Check, ChevronDown, Flame } from "lucide-react";
import isAuth from "../../components/isAuth";
import { useRouter } from "next/router";

function PricingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const router = useRouter();
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Choose the perfect plan
          <br />
          for your team
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Start for free, then grow with us. Change plans anytime. No hidden
          fees.
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <button className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            Monthly $29/m
          </button>
          <button className="px-6 py-3 text-gray-400 hover:text-white">
            Yearly Unlock <span className="text-orange-500">50% OFF</span>
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Individual Plan */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-xl font-semibold mb-2">Individual</h3>
            <p className="text-gray-400 text-sm mb-6">
              For freelancers and solo contractors
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold">$29</span>
              <span className="text-gray-400 ml-2">/mo</span>
            </div>
            <button
              className="w-full py-3 cursor-pointer bg-gray-800 text-white rounded-lg hover:bg-gray-700 mb-6"
              onClick={() => router.push("/Ragister?role=User")}
            >
              Get Started
            </button>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Basic task management
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Up to 2 projects</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Community support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">5 GB storage</span>
              </li>
               <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300"> No team collaboration</span>
              </li>
             
            </ul>
          </div>

      
          <div className="bg-gradient-to-b from-yellow-500/20 to-gray-900 rounded-2xl p-8 border-2 border-yellow-400 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                style={{ backgroundColor: "#e0f349" }}
                className="px-4 py-1 rounded-full text-black text-sm font-medium"
              >
                POPULAR PLAN
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Team</h3>
            <p className="text-gray-400 text-sm mb-6">
              For small teams & startups
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold">$99</span>
              <span className="text-gray-400 ml-2">/user/per month</span>
            </div>
            <button
              style={{ backgroundColor: "#e0f349" }}
              onClick={() => router.push("/Ragister?role=Organization")}
              className="w-full py-3 text-black cursor-pointer font-medium rounded-lg hover:opacity-90 mb-6"
            >
              Start Free Trial
            </button>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Everything in Individual</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Team collaboration on projects</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Shared project access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">10 GB storage per user</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Priority email support</span>
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <p className="text-gray-400 text-sm mb-6">
              For large organizations
            </p>
            <div className="mb-6">
              <span className="text-5xl font-bold">Custom</span>
            </div>
            <button className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 mb-6">
              Contact Sales
            </button>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  SSO & advanced security
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Dedicated account manager
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Unlimited storage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">
                  Custom contracts & invoicing
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm mb-8">
            TRUSTED BY TEAMS AT FORWARD-THINKING COMPANIES
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
            <span className="text-2xl font-bold">Acme Corp</span>
            <span className="text-2xl font-bold">GlobalTech</span>
            <span className="text-2xl font-bold">Circler</span>
            <span className="text-2xl font-bold">Triangle</span>
            <span className="text-2xl font-bold">ResearchSpace</span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">
          Compare features
        </h2>
        <p className="text-gray-400 text-center mb-12">
          A detailed look at what is included in each plan.
        </p>

        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-6 text-gray-400 font-normal">
                  Feature
                </th>
                <th className="text-center p-6 text-gray-400 font-normal">
                  Individual
                </th>
                <th
                  className="text-center p-6 font-medium"
                  style={{ color: "#e0f349" }}
                >
                  Team
                </th>
                <th className="text-center p-6 text-gray-400 font-normal">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">Core Functions</td>
                <td className="p-6"></td>
                <td className="p-6"></td>
                <td className="p-6"></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">Task Management</td>
                <td className="p-6 text-center text-gray-400">Basic</td>
                <td className="p-6 text-center text-gray-300">Advanced</td>
                <td className="p-6 text-center text-gray-300">Advanced</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">Projects</td>
                <td className="p-6 text-center text-gray-400">2</td>
                <td className="p-6 text-center text-gray-300">Unlimited</td>
                <td className="p-6 text-center text-gray-300">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">Teams</td>
                <td className="p-6 text-center text-gray-400">1</td>
                <td className="p-6 text-center text-gray-300">Unlimited</td>
                <td className="p-6 text-center text-gray-300">Unlimited</td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">Automations</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center">
                  <Check className="w-5 h-5 text-blue-500 mx-auto" />
                </td>
                <td className="p-6 text-center">
                  <Check className="w-5 h-5 text-blue-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">Reporting</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center">
                  <Check className="w-5 h-5 text-blue-500 mx-auto" />
                </td>
                <td className="p-6 text-center">
                  <Check className="w-5 h-5 text-blue-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">White Label</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center">—</td>
                <td className="p-6 text-center">
                  <Check className="w-5 h-5 text-blue-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">Secure & Compliant</td>
                <td className="p-6"></td>
                <td className="p-6"></td>
                <td className="p-6"></td>
              </tr>
              <tr className="border-b border-gray-800">
                <td className="p-6 text-gray-300">Support</td>
                <td className="p-6 text-center text-gray-400">Community</td>
                <td className="p-6 text-center text-gray-300">
                  Priority Email
                </td>
                <td className="p-6 text-center text-gray-300">
                  Dedicated Manager
                </td>
              </tr>
              <tr>
                <td className="p-6 text-gray-300">SLA (Uptime)</td>
                <td className="p-6 text-center text-gray-400">—</td>
                <td className="p-6 text-center text-gray-300">99.9%</td>
                <td className="p-6 text-center text-gray-300">99.99%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "Can I switch plans later?",
              a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, PayPal, and wire transfers for Enterprise customers.",
            },
            {
              q: "Is there a free trial for the Team plan?",
              a: "Yes, we offer a 14-day free trial for the Team plan with no credit card required.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg border border-gray-800"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 text-gray-400">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default isAuth(PricingPage);
