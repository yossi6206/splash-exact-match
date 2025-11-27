import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import FeaturedListings from "@/components/FeaturedListings";
import PromoBanner from "@/components/PromoBanner";
import FeaturedSearches from "@/components/FeaturedSearches";
import RecommendedItems from "@/components/RecommendedItems";
import GuidesSection from "@/components/GuidesSection";

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
        <GuidesSection />
      </main>
    </div>
  );
};

export default Index;
