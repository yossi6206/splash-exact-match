import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { CloudflareImage } from "@/components/CloudflareImage";

interface TipCardProps {
  image: string;
  title: string;
  description: string;
  slug?: string;
}

const TipCard = ({ image, title, description, slug }: TipCardProps) => {
  const content = (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 aspect-[4/3]">
        <CloudflareImage
          src={image}
          alt={title}
          preset="card"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 right-4">
          <div className="bg-white rounded-full p-2 transform transition-transform duration-300 group-hover:-translate-x-1">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  if (slug) {
    return <Link to={`/tips/${slug}`}>{content}</Link>;
  }

  return content;
};

export default TipCard;
