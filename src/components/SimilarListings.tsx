import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudflareImage } from "@/components/CloudflareImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Default images for fallbacks
import property1 from "@/assets/property-1.jpg";
import carImage from "@/assets/item-car.jpg";
import laptopImage from "@/assets/item-laptop.jpg";
import jobImage from "@/assets/item-job.jpg";

interface SimilarListingsProps {
  itemType: "property" | "car" | "laptop" | "secondhand" | "job" | "business" | "freelancer";
  currentItemId: string;
  location?: string;
  propertyType?: string;
  rooms?: number;
  priceRange?: { min: number; max: number };
  size?: number;
  manufacturer?: string;
  brand?: string;
  category?: string;
  jobType?: string;
  year?: number;
}

interface SimilarItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
  location: string;
  details: string;
  relevanceScore: number;
  matchReasons: string[];
}

// Relevance scoring weights
const RELEVANCE_WEIGHTS = {
  property: {
    location: 35,      // מיקום - הכי חשוב
    propertyType: 25,  // סוג נכס
    rooms: 20,         // חדרים דומים
    price: 15,         // מחיר דומה
    size: 5,           // גודל דומה
  },
  car: {
    manufacturer: 35,
    location: 25,
    price: 20,
    year: 15,
    km: 5,
  },
  laptop: {
    brand: 35,
    location: 25,
    price: 25,
    specs: 15,
  },
  secondhand: {
    category: 35,
    location: 30,
    price: 20,
    condition: 15,
  },
  job: {
    jobType: 35,
    location: 30,
    salary: 20,
    scope: 15,
  },
  business: {
    category: 35,
    location: 30,
    price: 20,
    businessType: 15,
  },
  freelancer: {
    category: 40,
    location: 25,
    hourlyRate: 20,
    skills: 15,
  },
};

const SimilarListings = ({
  itemType,
  currentItemId,
  location,
  propertyType,
  rooms,
  priceRange,
  size,
  manufacturer,
  brand,
  category,
  jobType,
  year,
}: SimilarListingsProps) => {
  const [items, setItems] = useState<SimilarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchAndScoreSimilarItems = async () => {
      setLoading(true);
      let scoredItems: SimilarItem[] = [];
      const targetCount = 12; // Fetch more items for carousel

      try {
        switch (itemType) {
          case "property": {
            // Fetch more items and score them
            const { data: properties } = await supabase
              .from("properties")
              .select("id, title, images, price, location, property_type, rooms, street, house_number, size, floor")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(50); // Fetch more to score

            if (properties) {
              scoredItems = properties.map(p => {
                const { score, reasons } = calculatePropertyRelevance(p, {
                  location,
                  propertyType,
                  rooms,
                  priceRange,
                  size,
                });
                return {
                  ...mapProperty(p),
                  relevanceScore: score,
                  matchReasons: reasons,
                };
              });
            }
            break;
          }

          case "car": {
            const { data: cars } = await supabase
              .from("cars")
              .select("id, manufacturer, model, images, price, location, year, km, hand")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(50);

            if (cars) {
              scoredItems = cars.map(c => {
                const { score, reasons } = calculateCarRelevance(c, {
                  manufacturer,
                  location,
                  priceRange,
                  year,
                });
                return {
                  ...mapCar(c),
                  relevanceScore: score,
                  matchReasons: reasons,
                };
              });
            }
            break;
          }

          case "laptop": {
            const { data: laptops } = await supabase
              .from("laptops")
              .select("id, brand, model, images, price, location, condition, ram, storage, processor")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(50);

            if (laptops) {
              scoredItems = laptops.map(l => {
                const { score, reasons } = calculateLaptopRelevance(l, {
                  brand,
                  location,
                  priceRange,
                });
                return {
                  ...mapLaptop(l),
                  relevanceScore: score,
                  matchReasons: reasons,
                };
              });
            }
            break;
          }

          case "secondhand": {
            const { data: items } = await supabase
              .from("secondhand_items")
              .select("id, title, images, price, location, category, condition")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(50);

            if (items) {
              scoredItems = items.map(i => {
                const { score, reasons } = calculateSecondhandRelevance(i, {
                  category,
                  location,
                  priceRange,
                });
                return {
                  ...mapSecondhand(i),
                  relevanceScore: score,
                  matchReasons: reasons,
                };
              });
            }
            break;
          }

          case "job": {
            const { data: jobs } = await supabase
              .from("jobs")
              .select("id, title, company_name, location, job_type, salary_min, salary_max, scope")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(50);

            if (jobs) {
              scoredItems = jobs.map(j => {
                const { score, reasons } = calculateJobRelevance(j, {
                  jobType,
                  location,
                  priceRange,
                });
                return {
                  ...mapJob(j),
                  relevanceScore: score,
                  matchReasons: reasons,
                };
              });
            }
            break;
          }

          case "business": {
            const { data: businesses } = await supabase
              .from("businesses")
              .select("id, title, images, price, location, category, business_type")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(50);

            if (businesses) {
              scoredItems = businesses.map(b => {
                const { score, reasons } = calculateBusinessRelevance(b, {
                  category,
                  location,
                  priceRange,
                });
                return {
                  ...mapBusiness(b),
                  relevanceScore: score,
                  matchReasons: reasons,
                };
              });
            }
            break;
          }

          case "freelancer": {
            const { data: freelancers } = await supabase
              .from("freelancers")
              .select("id, full_name, title, avatar_url, hourly_rate, location, category, skills, rating")
              .eq("availability", "available")
              .neq("id", currentItemId)
              .limit(50);

            if (freelancers) {
              scoredItems = freelancers.map(f => {
                const { score, reasons } = calculateFreelancerRelevance(f, {
                  category,
                  location,
                  priceRange,
                });
                return {
                  ...mapFreelancer(f),
                  relevanceScore: score,
                  matchReasons: reasons,
                };
              });
            }
            break;
          }
        }

        // Sort by relevance score (highest first) and take top items
        const topItems = scoredItems
          .filter(item => item.relevanceScore > 0) // Only items with some relevance
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, targetCount);

        // If we don't have enough relevant items, add random ones
        if (topItems.length < targetCount) {
          const remainingItems = scoredItems
            .filter(item => !topItems.find(t => t.id === item.id))
            .slice(0, targetCount - topItems.length);
          topItems.push(...remainingItems);
        }

        setItems(topItems.slice(0, targetCount));
      } catch (error) {
        console.error("Error fetching similar items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndScoreSimilarItems();
  }, [itemType, currentItemId, location, propertyType, rooms, priceRange, size, manufacturer, brand, category, jobType, year]);

  // Relevance calculation functions
  const calculatePropertyRelevance = (
    property: any,
    criteria: { location?: string; propertyType?: string; rooms?: number; priceRange?: { min: number; max: number }; size?: number }
  ): { score: number; reasons: string[] } => {
    const weights = RELEVANCE_WEIGHTS.property;
    let score = 0;
    const reasons: string[] = [];

    // Location match (exact or partial city match)
    if (criteria.location && property.location) {
      if (property.location === criteria.location) {
        score += weights.location;
        reasons.push("מיקום זהה");
      } else if (property.location.includes(criteria.location.split(" ")[0]) || 
                 criteria.location.includes(property.location.split(" ")[0])) {
        score += weights.location * 0.5;
        reasons.push("אזור קרוב");
      }
    }

    // Property type match
    if (criteria.propertyType && property.property_type === criteria.propertyType) {
      score += weights.propertyType;
      reasons.push("סוג נכס זהה");
    }

    // Rooms similarity (±1 room = full points, ±2 = partial)
    if (criteria.rooms && property.rooms) {
      const roomsDiff = Math.abs(property.rooms - criteria.rooms);
      if (roomsDiff === 0) {
        score += weights.rooms;
        reasons.push("מספר חדרים זהה");
      } else if (roomsDiff === 1) {
        score += weights.rooms * 0.7;
        reasons.push("חדרים דומים");
      } else if (roomsDiff === 2) {
        score += weights.rooms * 0.3;
      }
    }

    // Price similarity (within percentage range)
    if (criteria.priceRange && property.price) {
      const avgPrice = (criteria.priceRange.min + criteria.priceRange.max) / 2;
      const priceDiffPercent = Math.abs(property.price - avgPrice) / avgPrice;
      if (priceDiffPercent <= 0.1) {
        score += weights.price;
        reasons.push("מחיר דומה");
      } else if (priceDiffPercent <= 0.2) {
        score += weights.price * 0.7;
        reasons.push("טווח מחיר קרוב");
      } else if (priceDiffPercent <= 0.3) {
        score += weights.price * 0.4;
      }
    }

    // Size similarity
    if (criteria.size && property.size) {
      const sizeDiffPercent = Math.abs(property.size - criteria.size) / criteria.size;
      if (sizeDiffPercent <= 0.15) {
        score += weights.size;
        reasons.push("גודל דומה");
      } else if (sizeDiffPercent <= 0.3) {
        score += weights.size * 0.5;
      }
    }

    return { score, reasons };
  };

  const calculateCarRelevance = (
    car: any,
    criteria: { manufacturer?: string; location?: string; priceRange?: { min: number; max: number }; year?: number }
  ): { score: number; reasons: string[] } => {
    const weights = RELEVANCE_WEIGHTS.car;
    let score = 0;
    const reasons: string[] = [];

    if (criteria.manufacturer && car.manufacturer === criteria.manufacturer) {
      score += weights.manufacturer;
      reasons.push("יצרן זהה");
    }

    if (criteria.location && car.location) {
      if (car.location === criteria.location) {
        score += weights.location;
        reasons.push("מיקום זהה");
      } else if (car.location.includes(criteria.location.split(" ")[0])) {
        score += weights.location * 0.5;
        reasons.push("אזור קרוב");
      }
    }

    if (criteria.priceRange && car.price) {
      const carPrice = parseInt(car.price) || 0;
      const avgPrice = (criteria.priceRange.min + criteria.priceRange.max) / 2;
      const priceDiffPercent = Math.abs(carPrice - avgPrice) / avgPrice;
      if (priceDiffPercent <= 0.15) {
        score += weights.price;
        reasons.push("מחיר דומה");
      } else if (priceDiffPercent <= 0.3) {
        score += weights.price * 0.5;
      }
    }

    if (criteria.year && car.year) {
      const yearDiff = Math.abs(car.year - criteria.year);
      if (yearDiff === 0) {
        score += weights.year;
        reasons.push("שנה זהה");
      } else if (yearDiff <= 2) {
        score += weights.year * 0.6;
        reasons.push("שנתון קרוב");
      } else if (yearDiff <= 4) {
        score += weights.year * 0.3;
      }
    }

    return { score, reasons };
  };

  const calculateLaptopRelevance = (
    laptop: any,
    criteria: { brand?: string; location?: string; priceRange?: { min: number; max: number } }
  ): { score: number; reasons: string[] } => {
    const weights = RELEVANCE_WEIGHTS.laptop;
    let score = 0;
    const reasons: string[] = [];

    if (criteria.brand && laptop.brand === criteria.brand) {
      score += weights.brand;
      reasons.push("מותג זהה");
    }

    if (criteria.location && laptop.location === criteria.location) {
      score += weights.location;
      reasons.push("מיקום זהה");
    }

    if (criteria.priceRange && laptop.price) {
      const avgPrice = (criteria.priceRange.min + criteria.priceRange.max) / 2;
      const priceDiffPercent = Math.abs(laptop.price - avgPrice) / avgPrice;
      if (priceDiffPercent <= 0.2) {
        score += weights.price;
        reasons.push("מחיר דומה");
      } else if (priceDiffPercent <= 0.4) {
        score += weights.price * 0.5;
      }
    }

    return { score, reasons };
  };

  const calculateSecondhandRelevance = (
    item: any,
    criteria: { category?: string; location?: string; priceRange?: { min: number; max: number } }
  ): { score: number; reasons: string[] } => {
    const weights = RELEVANCE_WEIGHTS.secondhand;
    let score = 0;
    const reasons: string[] = [];

    if (criteria.category && item.category === criteria.category) {
      score += weights.category;
      reasons.push("קטגוריה זהה");
    }

    if (criteria.location && item.location === criteria.location) {
      score += weights.location;
      reasons.push("מיקום זהה");
    }

    if (criteria.priceRange && item.price) {
      const avgPrice = (criteria.priceRange.min + criteria.priceRange.max) / 2;
      const priceDiffPercent = Math.abs(item.price - avgPrice) / avgPrice;
      if (priceDiffPercent <= 0.25) {
        score += weights.price;
        reasons.push("מחיר דומה");
      } else if (priceDiffPercent <= 0.5) {
        score += weights.price * 0.5;
      }
    }

    return { score, reasons };
  };

  const calculateJobRelevance = (
    job: any,
    criteria: { jobType?: string; location?: string; priceRange?: { min: number; max: number } }
  ): { score: number; reasons: string[] } => {
    const weights = RELEVANCE_WEIGHTS.job;
    let score = 0;
    const reasons: string[] = [];

    if (criteria.jobType && job.job_type === criteria.jobType) {
      score += weights.jobType;
      reasons.push("סוג משרה זהה");
    }

    if (criteria.location && job.location === criteria.location) {
      score += weights.location;
      reasons.push("מיקום זהה");
    }

    if (criteria.priceRange && job.salary_min) {
      const avgSalary = (criteria.priceRange.min + criteria.priceRange.max) / 2;
      const jobAvgSalary = (job.salary_min + (job.salary_max || job.salary_min)) / 2;
      const salaryDiffPercent = Math.abs(jobAvgSalary - avgSalary) / avgSalary;
      if (salaryDiffPercent <= 0.2) {
        score += weights.salary;
        reasons.push("שכר דומה");
      } else if (salaryDiffPercent <= 0.4) {
        score += weights.salary * 0.5;
      }
    }

    return { score, reasons };
  };

  const calculateBusinessRelevance = (
    business: any,
    criteria: { category?: string; location?: string; priceRange?: { min: number; max: number } }
  ): { score: number; reasons: string[] } => {
    const weights = RELEVANCE_WEIGHTS.business;
    let score = 0;
    const reasons: string[] = [];

    if (criteria.category && business.category === criteria.category) {
      score += weights.category;
      reasons.push("קטגוריה זהה");
    }

    if (criteria.location && business.location === criteria.location) {
      score += weights.location;
      reasons.push("מיקום זהה");
    }

    if (criteria.priceRange && business.price) {
      const avgPrice = (criteria.priceRange.min + criteria.priceRange.max) / 2;
      const priceDiffPercent = Math.abs(business.price - avgPrice) / avgPrice;
      if (priceDiffPercent <= 0.25) {
        score += weights.price;
        reasons.push("מחיר דומה");
      } else if (priceDiffPercent <= 0.5) {
        score += weights.price * 0.5;
      }
    }

    return { score, reasons };
  };

  const calculateFreelancerRelevance = (
    freelancer: any,
    criteria: { category?: string; location?: string; priceRange?: { min: number; max: number } }
  ): { score: number; reasons: string[] } => {
    const weights = RELEVANCE_WEIGHTS.freelancer;
    let score = 0;
    const reasons: string[] = [];

    if (criteria.category && freelancer.category === criteria.category) {
      score += weights.category;
      reasons.push("תחום זהה");
    }

    if (criteria.location && freelancer.location === criteria.location) {
      score += weights.location;
      reasons.push("מיקום זהה");
    }

    if (criteria.priceRange && freelancer.hourly_rate) {
      const avgRate = (criteria.priceRange.min + criteria.priceRange.max) / 2;
      const rateDiffPercent = Math.abs(freelancer.hourly_rate - avgRate) / avgRate;
      if (rateDiffPercent <= 0.3) {
        score += weights.hourlyRate;
        reasons.push("תעריף דומה");
      } else if (rateDiffPercent <= 0.5) {
        score += weights.hourlyRate * 0.5;
      }
    }

    return { score, reasons };
  };

  // Mapping functions
  const mapProperty = (p: any): Omit<SimilarItem, 'relevanceScore' | 'matchReasons'> => ({
    id: p.id,
    title: p.street && p.house_number ? `${p.street} ${p.house_number}` : p.title,
    subtitle: `${p.property_type} ב${p.location}`,
    image: p.images?.[0] || property1,
    price: `₪${p.price?.toLocaleString()}`,
    location: p.location,
    details: `${p.rooms} חדרים${p.size ? ` | ${p.size} מ"ר` : ""}${p.floor ? ` | קומה ${p.floor}` : ""}`,
  });

  const mapCar = (c: any): Omit<SimilarItem, 'relevanceScore' | 'matchReasons'> => ({
    id: c.id,
    title: `${c.manufacturer || ""} ${c.model}`.trim(),
    subtitle: `${c.year} | יד ${c.hand}`,
    image: c.images?.[0] || carImage,
    price: c.price ? `₪${parseInt(c.price).toLocaleString()}` : "לא צוין",
    location: c.location,
    details: `${c.km?.toLocaleString()} ק"מ`,
  });

  const mapLaptop = (l: any): Omit<SimilarItem, 'relevanceScore' | 'matchReasons'> => ({
    id: l.id,
    title: `${l.brand} ${l.model}`,
    subtitle: l.condition,
    image: l.images?.[0] || laptopImage,
    price: `₪${l.price?.toLocaleString()}`,
    location: l.location,
    details: `${l.ram ? `${l.ram}GB RAM` : ""} ${l.storage ? `| ${l.storage}GB` : ""}`.trim(),
  });

  const mapSecondhand = (i: any): Omit<SimilarItem, 'relevanceScore' | 'matchReasons'> => ({
    id: i.id,
    title: i.title,
    subtitle: i.category,
    image: i.images?.[0] || property1,
    price: `₪${i.price?.toLocaleString()}`,
    location: i.location,
    details: i.condition,
  });

  const mapJob = (j: any): Omit<SimilarItem, 'relevanceScore' | 'matchReasons'> => ({
    id: j.id,
    title: j.title,
    subtitle: j.company_name,
    image: jobImage,
    price: j.salary_min && j.salary_max 
      ? `₪${j.salary_min.toLocaleString()} - ₪${j.salary_max.toLocaleString()}`
      : j.salary_min 
        ? `מ-₪${j.salary_min.toLocaleString()}`
        : "לא צוין",
    location: j.location,
    details: `${j.job_type} | ${j.scope}`,
  });

  const mapBusiness = (b: any): Omit<SimilarItem, 'relevanceScore' | 'matchReasons'> => ({
    id: b.id,
    title: b.title,
    subtitle: b.category,
    image: b.images?.[0] || property1,
    price: `₪${b.price?.toLocaleString()}`,
    location: b.location,
    details: b.business_type,
  });

  const mapFreelancer = (f: any): Omit<SimilarItem, 'relevanceScore' | 'matchReasons'> => ({
    id: f.id,
    title: f.full_name,
    subtitle: f.title,
    image: f.avatar_url || jobImage,
    price: `₪${f.hourly_rate}/שעה`,
    location: f.location || "לא צוין",
    details: f.rating ? `דירוג: ${f.rating.toFixed(1)}` : "",
  });

  const getItemLink = (id: string) => {
    const routes = {
      property: `/properties/${id}`,
      car: `/cars/${id}`,
      laptop: `/laptops/${id}`,
      secondhand: `/secondhand/${id}`,
      job: `/jobs/${id}`,
      business: `/businesses/${id}`,
      freelancer: `/freelancers/${id}`,
    };
    return routes[itemType];
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">נכסים דומים למה שחיפשת</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const getTitle = () => {
    const titles = {
      property: "נכסים דומים למה שחיפשת",
      car: "רכבים דומים למה שחיפשת",
      laptop: "מחשבים דומים למה שחיפשת",
      secondhand: "פריטים דומים למה שחיפשת",
      job: "משרות דומות למה שחיפשת",
      business: "עסקים דומים למה שחיפשת",
      freelancer: "פרילנסרים דומים למה שחיפשת",
    };
    return titles[itemType];
  };

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const displayedItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{getTitle()}</h3>
        {/* Navigation Arrows in Header */}
        {items.length > 4 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
              className="h-8 w-8 rounded-full border-border hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="h-8 w-8 rounded-full border-border hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedItems.map((item) => (
          <Link key={item.id} to={getItemLink(item.id)}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
              <div className="relative h-40">
                <CloudflareImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.matchReasons.length > 0 && (
                  <div className="absolute top-2 right-2 flex flex-wrap gap-1 max-w-[90%]">
                    {item.matchReasons.slice(0, 2).map((reason, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="bg-primary/90 text-primary-foreground text-xs px-2 py-0.5"
                      >
                        {reason}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4" dir="rtl">
                <h4 className="font-bold text-foreground truncate">{item.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                <p className="text-sm text-muted-foreground truncate">{item.details}</p>
                <p className="font-bold text-primary mt-2">{item.price}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarListings;
