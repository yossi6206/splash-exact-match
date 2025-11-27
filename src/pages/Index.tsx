import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import FeaturedListings from "@/components/FeaturedListings";
import PromoBanner from "@/components/PromoBanner";
import FeaturedSearches from "@/components/FeaturedSearches";
import RecommendedItems from "@/components/RecommendedItems";
import TipsGuides from "@/components/TipsGuides";
import FurnitureBanner from "@/components/FurnitureBanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Categories />
        <FeaturedListings />
        <PromoBanner />
        <FeaturedSearches />
        <RecommendedItems />
        <FurnitureBanner />
        <TipsGuides />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
