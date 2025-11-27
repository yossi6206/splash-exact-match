import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Freelancers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(250,70%,55%)] via-[hsl(240,65%,50%)] to-[hsl(200,70%,50%)]">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              מצא את העבודה החלומית שלך
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              אלפי משרות מובילות ממיטב החברות בישראל
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-full shadow-2xl p-2 flex items-center gap-2 max-w-3xl mx-auto">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="תפקיד, חברה או מילות חפש..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleSearch}
                className="rounded-full px-8 bg-[hsl(250,70%,55%)] hover:bg-[hsl(250,70%,50%)]"
              >
                חפש
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  89%
                </div>
                <div className="text-white/80 text-lg">
                  שיעור השמה
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  +3,200
                </div>
                <div className="text-white/80 text-lg">
                  הצעות מועמדות
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  +10
                </div>
                <div className="text-white/80 text-lg">
                  משרות פעילות
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for more content */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">פרילנסרים מובילים</h2>
          <p className="text-muted-foreground">תוכן נוסף יתוסף בקרוב...</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Freelancers;
