import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Laptops from "./pages/Laptops";
import LaptopDetails from "./pages/LaptopDetails";
import Auth from "./pages/Auth";
import TipsGuidesPage from "./pages/TipsGuides";
import TipDetails from "./pages/TipDetails";
import NotFound from "./pages/NotFound";
import MobileNav from "./components/MobileNav";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehavior = "none";
    
    // Add mobile-specific classes
    if (window.innerWidth < 768) {
      document.body.classList.add("mobile");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/laptops" element={<Laptops />} />
        <Route path="/laptops/:id" element={<LaptopDetails />} />
        <Route path="/tips" element={<TipsGuidesPage />} />
        <Route path="/tips/:id" element={<TipDetails />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNav />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
