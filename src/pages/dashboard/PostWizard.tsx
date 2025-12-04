import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Home, 
  Laptop, 
  Package, 
  Briefcase, 
  Building2, 
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type Category = 'car' | 'property' | 'laptop' | 'secondhand' | 'job' | 'business' | 'freelancer' | 'project' | null;

const PostWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);

  const categories = [
    {
      id: 'car' as const,
      title: 'רכב למכירה',
      description: 'פרסם רכב פרטי, מסחרי או אופנוע',
      icon: Car,
      gradient: 'from-blue-500 to-blue-600',
      route: '/dashboard/post-car'
    },
    {
      id: 'property' as const,
      title: 'נדל״ן למכירה',
      description: 'דירה, בית, קרקע או נכס מסחרי',
      icon: Home,
      gradient: 'from-green-500 to-green-600',
      route: '/dashboard/post-property'
    },
    {
      id: 'project' as const,
      title: 'פרויקט חדש',
      description: 'פרסם פרויקט בנייה חדש מקבלן/יזם',
      icon: Building,
      gradient: 'from-cyan-500 to-cyan-600',
      route: '/dashboard/post-project'
    },
    {
      id: 'business' as const,
      title: 'עסק למכירה',
      description: 'מכור עסק פעיל עם נתונים פיננסיים',
      icon: Building2,
      gradient: 'from-amber-500 to-amber-600',
      route: '/dashboard/post-business'
    },
    {
      id: 'laptop' as const,
      title: 'מחשבים',
      description: 'מחשב נייד, נייח, טאבלט או אביזרים',
      icon: Laptop,
      gradient: 'from-purple-500 to-purple-600',
      route: '/dashboard/post-laptop'
    },
    {
      id: 'secondhand' as const,
      title: 'יד שנייה',
      description: 'ריהוט, מוצרי חשמל, ספורט ועוד',
      icon: Package,
      gradient: 'from-orange-500 to-orange-600',
      route: '/dashboard/post-secondhand'
    },
    {
      id: 'job' as const,
      title: 'פרסם משרה',
      description: 'חפש עובדים, פרילנסרים או שותפים',
      icon: Briefcase,
      gradient: 'from-pink-500 to-pink-600',
      route: '/dashboard/post-job'
    },
    {
      id: 'freelancer' as const,
      title: 'פרופיל פרילנסר',
      description: 'הצג את כישוריך וקבל הצעות עבודה',
      icon: User,
      gradient: 'from-indigo-500 to-indigo-600',
      route: '/dashboard/post-freelancer'
    }
  ];

  const handleCategorySelect = (categoryId: Category) => {
    setSelectedCategory(categoryId);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedCategory(null);
      setStep(1);
    }
  };

  const handleContinue = () => {
    const category = categories.find(c => c.id === selectedCategory);
    if (category) {
      navigate(category.route);
    }
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">פרסום מודעה חדשה</h1>
        <p className="text-muted-foreground">
          בחר קטגוריה ופרסם את המודעה שלך בקלות
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step > 1 ? <Check className="h-5 w-5" /> : '1'}
            </div>
            <span className={`font-medium ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              בחירת קטגוריה
            </span>
          </div>
          
          <div className={`h-1 w-20 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              2
            </div>
            <span className={`font-medium ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              מילוי פרטים
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Category Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">בחר את סוג המודעה שברצונך לפרסם</CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 bg-white"
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${category.gradient} group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-2 text-lg">{category.title}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Confirmation */}
      {step === 2 && selectedCategoryData && (
        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-center">אישור בחירה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className={`p-6 rounded-xl bg-gradient-to-br ${selectedCategoryData.gradient}`}>
                  <selectedCategoryData.icon className="h-12 w-12 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {selectedCategoryData.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedCategoryData.description}
                  </p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  קטגוריה נבחרה
                </Badge>
              </div>

              <div className="bg-muted/30 rounded-lg p-6">
                <h4 className="font-semibold text-foreground mb-3">מה הלאה?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>תועבר לטופס מילוי פרטים מפורט</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>תוכל להעלות תמונות ולתאר את המוצר/שירות</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>המודעה תפורסם מיד לאחר השלמת הטופס</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowRight className="h-5 w-5 ml-2" />
                  חזור לבחירת קטגוריה
                </Button>
                <Button
                  size="lg"
                  onClick={handleContinue}
                  className="flex-1"
                >
                  המשך למילוי פרטים
                  <ArrowLeft className="h-5 w-5 mr-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PostWizard;