import { Building2, MapPin, Clock, Briefcase, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface JobCardProps {
  id: number;
  company: string;
  logo?: string;
  title: string;
  location: string;
  type: string;
  scope: string;
  salary?: string;
  experience: string;
  postedDate: string;
  requirements: string[];
}

export const JobCard = ({
  id,
  company,
  logo,
  title,
  location,
  type,
  scope,
  salary,
  experience,
  postedDate,
  requirements,
}: JobCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300 bg-card">
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            {logo ? (
              <img src={logo} alt={company} className="w-12 h-12 object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-primary" />
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <Link
                to={`/jobs/${id}`}
                className="text-xl font-bold text-foreground hover:text-primary transition-colors mb-1 block"
              >
                {title}
              </Link>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {company}
              </p>
            </div>
            <Button size="icon" variant="ghost" className="hover:bg-muted">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Info Tags */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {location}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {type}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {scope}
            </Badge>
            {salary && (
              <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20">
                {salary}
              </Badge>
            )}
          </div>

          {/* Requirements */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {requirements.slice(0, 5).map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {experience}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {postedDate}
              </span>
            </div>
            <Link to={`/jobs/${id}`}>
              <Button size="sm" className="rounded-full">
                צפה במשרה
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
