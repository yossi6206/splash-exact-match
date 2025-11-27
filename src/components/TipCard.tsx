import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface TipCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const TipCard = ({ icon: Icon, title, description }: TipCardProps) => {
  return (
    <Card className="group p-6 hover:shadow-lg transition-all cursor-pointer border-0 shadow-sm bg-background">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TipCard;
