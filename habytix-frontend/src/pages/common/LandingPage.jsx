import LandingNavbar from "../../components/landing/LandingNavbar";
import HeroSection from "../../components/landing/HeroSection";
import StatsSection from "../../components/landing/StatsSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import DemoSection from "../../components/landing/DemoSection";
import Footer from "../../components/landing/Footer";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-slate-50 min-h-screen"
    >
      <LandingNavbar />

      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <DemoSection />
      </main>

      <Footer />
    </motion.div>
  );
}