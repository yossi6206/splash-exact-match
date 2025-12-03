import { Card } from "@/components/ui/card";
import { CloudflareImage } from "@/components/CloudflareImage";

interface SearchCardProps {
  image: string;
  title: string;
}

const SearchCard = ({ image, title }: SearchCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden">
        <CloudflareImage
          src={image}
          alt={title}
          preset="card"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5 bg-background">
        <p className="text-base font-medium text-foreground text-center leading-relaxed">
          {title}
        </p>
      </div>
    </Card>
  );
};

export default SearchCard;
