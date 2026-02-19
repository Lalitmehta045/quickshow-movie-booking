import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NowShowing from "@/components/NowShowing";
import TrailersSection from "@/components/TrailersSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <NowShowing />
      <TrailersSection />
      <Footer />
    </div>
  );
};

export default Index;
