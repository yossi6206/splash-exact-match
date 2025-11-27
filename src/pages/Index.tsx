import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import FeaturedListings from "@/components/FeaturedListings";
import PromoBanner from "@/components/PromoBanner";
import FeaturedSearches from "@/components/FeaturedSearches";

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
      </main>
    </div>
  );
};

export default Index;
