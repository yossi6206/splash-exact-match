import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car, Home, Laptop, Package, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PostAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostAdDialog = ({ open, onOpenChange }: PostAdDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handlePostOption = (path: string) => {
    if (!user) {
      toast.error("עליך להתחבר כדי לפרסם מודעה");
      navigate("/auth");
      return;
    }
    onOpenChange(false);
    navigate(path);
  };

  const postOptions = [
    {
      title: "פרסם רכב",
      description: "מכור או קנה רכב, אופנוע או אביזרים",
      icon: Car,
      path: "/dashboard/post-car",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "פרסם נכס",
      description: "דירות, בתים ונכסים למכירה או השכרה",
      icon: Home,
      path: "/dashboard/post-property",
      color: "from-green-500 to-green-600",
    },
    {
      title: "פרסם מחשב",
      description: "מחשבים ניידים, נייחים ואביזרים",
      icon: Laptop,
      path: "/dashboard/post-laptop",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "פרסם יד שנייה",
      description: "ריהוט, מוצרי חשמל, אופנה ועוד",
      icon: Package,
      path: "/dashboard/post-secondhand",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "פרסם משרה",
      description: "חפש עובדים או הצע שירותים",
      icon: Briefcase,
      path: "/dashboard/post-job",
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "פרסם עסק למכירה",
      description: "מכור עסק פעיל עם נתונים פיננסיים",
      icon: Building2,
      path: "/dashboard/post-business",
      color: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            מה תרצה לפרסם?
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {postOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.path}
                variant="outline"
                className="h-auto py-6 px-4 flex flex-col items-start gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                onClick={() => handlePostOption(option.path)}
              >
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${option.color} group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-foreground text-lg mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostAdDialog;
