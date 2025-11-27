import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import FeaturedListings from "@/components/FeaturedListings";
import PromoBanner from "@/components/PromoBanner";
import FeaturedSearches from "@/components/FeaturedSearches";
import RecommendedItems from "@/components/RecommendedItems";
import TipsGuides from "@/components/TipsGuides";
import FurnitureBanner from "@/components/FurnitureBanner";
import RentalBanner from "@/components/RentalBanner";

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
        <TipsGuides />
        <div className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FurnitureBanner />
            <RentalBanner />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
