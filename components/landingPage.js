import React, { useState } from "react";
import {
  BarChart3,
  FileText,
  Calendar,
  Users,
  Shield,
  Briefcase,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/router";

function TaskTrussLanding() {
  const [openFaq, setOpenFaq] = useState(0);
  const router = useRouter();

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Financial Dashboard",
      description:
        "Track project budgets, payment certificates, and financial progress with real-time analytics and visual reports.",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Bill of Quantities",
      description:
        "Manage BOQ items, track quantities, calculate weighted progress, and generate interim payment certificates.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Work Plan Scheduling",
      description:
        "Create detailed work plans with activities, milestones, and Gantt-style visualization for project timelines.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description:
        "Invite team members, assign roles, and collaborate on projects with real-time updates and notifications.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance & Reporting",
      description:
        "World Bank ESF-compliant incident reporting, grievance tracking, and pre-commencement checklists.",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Multi-Project Support",
      description:
        "Manage roads, buildings, bridges, and infrastructure projects all in one unified platform.",
    },
  ];

  const benefits = [
    "Track project progress from planning to completion",
    "Generate professional payment certificates",
    "Monitor road construction layers and progress",
    "Record daily site activities and action points",
    "Manage project documents and file storage",
    "Role-based access control for team members",
  ];

  const stats = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      value: "98%",
      label: "Projects delivered on time",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      value: "50%",
      label: "Faster payment processing",
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "1000+",
      label: "Teams using TaskTruss",
    },
  ];

  const faqs = [
    {
      question: "What types of construction projects can I manage?",
      answer:
        "TaskTruss supports Roads, Buildings, Infrastructure, and Bridge projects. Each project type has specialized tracking features tailored to its specific requirements.",
    },
    {
      question: "How does the progress tracking work?",
      answer:
        "Progress tracking is based on BOQ items and activities. You can track quantities, calculate weighted progress, and generate real-time reports showing project completion status.",
    },
    {
      question: "Can I invite my team to collaborate?",
      answer:
        "Yes! You can invite unlimited team members, assign specific roles (Admin, Engineer, Supervisor, etc.), and collaborate with real-time updates and notifications.",
    },
    {
      question: "Is TaskTruss compliant with World Bank requirements?",
      answer:
        "Absolutely. TaskTruss includes World Bank ESF-compliant features including incident reporting, grievance tracking, and pre-commencement checklists.",
    },
  ];

  const companies = [
    "Acme Corp",
    "GlobalTech",
    "Circle",
    "Triangle",
    "SquareSpace",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="relative px-6 py-6 min-h-[680px] flex flex-col items-center justify-center  bg-gradient-to-b from-blue-100 via-white to-blue-100 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 ">
          <div className="inline-block px-6 py-2 mb-8 border border-blue-500 rounded-full">
            <span className="text-blue-500 text-sm font-medium">
              Construction Project Management
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Build Smarter with
            <br />
            <span className="text-blue-500">Forma</span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            The complete project management platform for road construction,
            infrastructure, and building projects. Track progress, manage
            payments, and collaborate with your team - all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-blue-500 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
              onClick={() => router.push("/Ragister")}
            >
              Start Free
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              className="border border-gray-300 px-8 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all cursor-pointer text-gray-700"
              onClick={() => router.push("/login")}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600 text-sm uppercase tracking-wider mb-8">
            Trusted by teams at forward-thinking companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {companies.map((company, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-lg">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            Everything you need to manage construction projects
          </h2>
          <p className="text-gray-500 text-center mb-16 max-w-3xl mx-auto">
            From financial tracking to team collaboration, TaskTruss provides
            all the tools you need for successful project delivery.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl p-8 hover:border-blue-500/30 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg flex items-center justify-center mb-6 text-blue-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-8 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Streamline your project lifecycle
              </h2>
              <p className="text-gray-500 mb-8 text-lg">
                TaskTruss helps construction teams stay organized, track
                progress accurately, and deliver projects on time and within
                budget.
              </p>

              <div className="space-y-4 mb-10">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <span className="text-gray-600">{benefit}</span>
                  </div>
                ))}
              </div>

              <button
                className="bg-blue-500 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-2 cursor-pointer"
                onClick={() => router.push("/Ragister")}
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-8 flex items-center gap-6"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg flex items-center justify-center text-blue-500 flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-1 text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-7 py-5 flex items-center justify-between text-left hover:bg-gray-100/50 transition-all"
                >
                  <span className="font-semibold text-lg pr-4 text-gray-900">
                    {faq.question}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0 cursor-pointer" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 cursor-pointer" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-7 pb-6 text-gray-500 leading-relaxed mt-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to transform your project management?
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            Join thousands of construction teams already using TaskTruss to
            deliver projects more efficiently.
          </p>

          <button
            className="bg-blue-500 text-white px-10 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 mx-auto text-lg shadow-xl shadow-blue-500/20 cursor-pointer"
            onClick={() => router.push("/Ragister")}
          >
            Start Free Today <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default TaskTrussLanding;
