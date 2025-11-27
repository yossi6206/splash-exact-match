import TipCard from "./TipCard";
import tipSelling from "@/assets/tip-selling.jpg";
import tipBuying from "@/assets/tip-buying.jpg";
import tipSafety from "@/assets/tip-safety.jpg";
import tipWriting from "@/assets/tip-writing.jpg";

const TipsGuides = () => {
  const tips = [
    {
      image: tipSelling,
      title: "איך למכור בהצלחה",
      description: "טיפים חשובים למכירה מהירה ויעילה של הפריט שלך"
    },
    {
      image: tipBuying,
      title: "מדריך לקונה החכם",
      description: "כל מה שצריך לדעת לפני רכישת מוצר יד שנייה"
    },
    {
      image: tipSafety,
      title: "בטיחות ואבטחה",
      description: "הגן על עצמך ועל המידע האישי שלך בעסקאות"
    },
    {
      image: tipWriting,
      title: "כתיבת מודעה מושלמת",
      description: "כך תכתוב מודעה שתמשך קונים ותביא למכירה מהירה"
    }
  ];

  return (
    <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8">טיפים ומדריכים</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {tips.map((tip, index) => (
          <TipCard
            key={index}
            image={tip.image}
            title={tip.title}
            description={tip.description}
          />
        ))}
      </div>
    </section>
  );
};

export default TipsGuides;
