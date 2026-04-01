import { motion } from "framer-motion";
import {
  Users,
  ShieldCheck,
  BarChart3,
  Bell,
} from "lucide-react";

const features = [
  {
    title: "Tenant Management",
    desc: "Manage tenant data and access efficiently.",
    icon: Users,
  },
  {
    title: "Secure Authentication",
    desc: "JWT-based login system with role control.",
    icon: ShieldCheck,
  },
  {
    title: "Analytics Dashboard",
    desc: "Visual insights with charts and stats.",
    icon: BarChart3,
  },
  {
    title: "Real-time Updates",
    desc: "Track maintenance requests instantly.",
    icon: Bell,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {features.map((f, i) => {
            const Icon = f.icon;

            return (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260 }}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-xl"
              >
                <div className="bg-indigo-600 p-3 rounded-xl w-fit">
                  <Icon className="text-white" size={22} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-800">
                  {f.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
}