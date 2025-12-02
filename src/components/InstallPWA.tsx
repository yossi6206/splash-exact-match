import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone, Share } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const wasDismissed = localStorage.getItem("pwa-install-dismissed");
    if (wasDismissed) {
      setDismissed(true);
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) {
      return; // Already installed
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // For iOS, show install banner after a delay
    if (iOS && !wasDismissed) {
      setTimeout(() => setIsInstallable(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setIsInstallable(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (dismissed || !isInstallable) {
    return null;
  }

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40 animate-fade-in">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm mb-1">התקן את האפליקציה</h3>
              <p className="text-white/80 text-xs mb-3">
                הוסף את SecondHandPro למסך הבית לגישה מהירה
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 bg-white hover:bg-white/90 text-primary"
                  onClick={handleInstall}
                >
                  <Download className="h-4 w-4 ml-1" />
                  התקן
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Instructions Dialog */}
      <Dialog open={showIOSInstructions} onOpenChange={setShowIOSInstructions}>
        <DialogContent className="max-w-sm" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">התקנה באייפון</DialogTitle>
            <DialogDescription className="text-right">
              כדי להתקין את האפליקציה באייפון, יש לבצע את השלבים הבאים:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <p className="font-medium">לחץ על כפתור השיתוף</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Share className="h-4 w-4" /> בתחתית המסך
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                2
              </div>
              <div>
                <p className="font-medium">גלול ולחץ על "הוסף למסך הבית"</p>
                <p className="text-sm text-muted-foreground">Add to Home Screen</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                3
              </div>
              <div>
                <p className="font-medium">לחץ "הוסף"</p>
                <p className="text-sm text-muted-foreground">האפליקציה תופיע במסך הבית</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowIOSInstructions(false)} className="w-full">
            הבנתי
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallPWA;