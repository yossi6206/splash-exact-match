import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Laptops from "./pages/Laptops";
import LaptopDetails from "./pages/LaptopDetails";
import Secondhand from "./pages/Secondhand";
import SecondhandCategory from "./pages/SecondhandCategory";
import SecondhandDetails from "./pages/SecondhandDetails";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import TipsGuidesPage from "./pages/TipsGuides";
import TipDetails from "./pages/TipDetails";
import Freelancers from "./pages/Freelancers";
import FreelancerDetails from "./pages/FreelancerDetails";
import Businesses from "./pages/Businesses";
import BusinessDetails from "./pages/BusinessDetails";
import SellerProfile from "./pages/SellerProfile";
import Messages from "./pages/Messages";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import MobileNav from "./components/MobileNav";
import TawkToChat from "./components/TawkToChat";
import InstallPWA from "./components/InstallPWA";

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
        <Route path="/secondhand" element={<Secondhand />} />
        <Route path="/secondhand/:category" element={<SecondhandCategory />} />
        <Route path="/secondhand/item/:id" element={<SecondhandDetails />} />
        <Route path="/seller/:id" element={<SellerProfile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/freelancers" element={<Freelancers />} />
        <Route path="/freelancers/:id" element={<FreelancerDetails />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/businesses/:id" element={<BusinessDetails />} />
        <Route path="/tips" element={<TipsGuidesPage />} />
        <Route path="/tips/:id" element={<TipDetails />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
        <MobileNav />
        <TawkToChat />
        <InstallPWA />
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
