
import ImageCarousel from "@/components/home/ImageCarousel";
import QuickLinks from "@/components/home/QuickLinks";
import NoticesSection from "@/components/home/NoticesSection";
import AboutSummary from "@/components/home/AboutSummary";
import StatsCounter from "@/components/home/StatsCounter";
import CTASection from "@/components/home/CTASection";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section with Image Carousel */}
      <ImageCarousel />

      {/* Quick Links Section */}
      <QuickLinks />

      {/* Notices & About Section */}
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Notices */}
            <NoticesSection />
            
            {/* About Summary */}
            <AboutSummary />
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <StatsCounter />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default HomePage;
