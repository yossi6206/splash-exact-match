import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Zap, Check } from "lucide-react";

interface PromotionPackageCardProps {
  duration: number;
  price: number;
  isPopular?: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

export const PromotionPackageCard = ({
  duration,
  price,
  isPopular,
  onSelect,
  isLoading,
}: PromotionPackageCardProps) => {
  const features = [
    "הצגה בראש הרשימה",
    "סימון חזותי מיוחד",
    "עדיפות בתוצאות חיפוש",
    "מעקב אחר ביצועים",
  ];

  const getIcon = () => {
    if (duration === 7) return <Sparkles className="w-6 h-6" />;
    if (duration === 14) return <TrendingUp className="w-6 h-6" />;
    return <Zap className="w-6 h-6" />;
  };

  const getPricePerDay = () => (price / duration).toFixed(2);

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
      isPopular ? 'ring-2 ring-primary shadow-primary/20' : ''
    }`}>
      {isPopular && (
        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
          הכי פופולרי
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className={`p-3 rounded-full ${
            duration === 7 ? 'bg-blue-100 text-blue-600' :
            duration === 14 ? 'bg-green-100 text-green-600' :
            'bg-purple-100 text-purple-600'
          }`}>
            {getIcon()}
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold">
          חבילת {duration} ימים
        </CardTitle>
        
        <CardDescription className="text-sm">
          ₪{getPricePerDay()} ליום
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-1">
            ₪{price}
          </div>
          <div className="text-sm text-muted-foreground">
            סך הכל לתקופה
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Button 
          onClick={onSelect}
          disabled={isLoading}
          className={`w-full ${isPopular ? 'bg-gradient-to-r from-primary to-primary/80' : ''}`}
          size="lg"
        >
          {isLoading ? "מעבד..." : "בחר חבילה"}
        </Button>
      </CardContent>
    </Card>
  );
};
