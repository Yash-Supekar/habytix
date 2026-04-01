import LandingNavbar from "../../components/landing/LandingNavbar";
import HeroSection from "../../components/landing/HeroSection";
import StatsSection from "../../components/landing/StatsSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import DemoSection from "../../components/landing/DemoSection";
import Footer from "../../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <LandingNavbar />

      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <DemoSection />
      </main>

      <Footer />
    </div>
  );
}