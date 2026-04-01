import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  const MotionLink = motion(Link);

  return (
    <section className="min-h-screen flex items-center pt-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">

      {/* BACKGROUND BLOBS (FIXED CLICK ISSUE) */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-200 rounded-full blur-3xl opacity-30 top-[-100px] right-[-100px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bg-purple-200 rounded-full blur-3xl opacity-30 bottom-[-100px] left-[-100px] pointer-events-none" />

      {/* CONTENT (ABOVE BLOBS) */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

        {/* LEFT CONTENT */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-gray-900 leading-tight"
          >
            Modern Tenant &
            Maintenance Management
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-gray-600"
          >
            Habytix helps property managers track maintenance
            requests, manage tenants, and monitor service activity
            from a single modern dashboard.
          </motion.p>

          {/* BUTTONS (FIXED STRUCTURE + POLISH) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex gap-4 items-center"
          >
            <MotionLink
              to="/register"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
            >
              Get Started
            </MotionLink>

            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center justify-center border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Try Demo
            </motion.a>
          </motion.div>
        </div>

        {/* RIGHT SIDE FLOATING DASHBOARD UI */}
        <div className="relative h-[400px]">

          {/* CARD 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="absolute top-0 left-10 bg-white p-4 rounded-2xl shadow-lg w-52 border border-transparent hover:border-indigo-400 transition"
          >
            <p className="text-sm text-gray-500">Open Tickets</p>
            <h3 className="text-xl font-bold text-indigo-600">112</h3>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="absolute top-24 right-0 bg-white p-4 rounded-2xl shadow-lg w-56 border border-transparent hover:border-indigo-400 transition"
          >
            <p className="text-sm text-gray-500">In Progress</p>
            <h3 className="text-xl font-bold text-yellow-500">388</h3>
          </motion.div>

          {/* CARD 3 (UPGRADED → MINI CHART) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            className="absolute bottom-0 left-20 bg-white p-4 rounded-2xl shadow-lg w-56 border border-transparent hover:border-indigo-400 transition"
          >
            <p className="text-sm text-gray-500">Activity</p>

            <div className="flex items-end gap-1 mt-3 h-12">
              <div className="w-2 bg-indigo-400 h-6 rounded"></div>
              <div className="w-2 bg-indigo-500 h-8 rounded"></div>
              <div className="w-2 bg-indigo-600 h-10 rounded"></div>
              <div className="w-2 bg-indigo-400 h-7 rounded"></div>
              <div className="w-2 bg-indigo-500 h-9 rounded"></div>
              <div className="w-2 bg-indigo-500 h-9 rounded"></div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

