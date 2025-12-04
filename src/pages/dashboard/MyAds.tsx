import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Loader2, 
  Car, 
  Home, 
  Laptop, 
  Package, 
  Briefcase, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  MousePointer,
  Phone,
  Users
} from "lucide-react";
import { getCarTitle, getLaptopTitle } from "@/utils/titleUtils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CloudflareImage } from "@/components/CloudflareImage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Listing {
  id: string;
  title?: string;
  brand?: string;
  model?: string;
  price: number | string;
  location: string;
  images?: string[];
  status: string;
  created_at: string;
  views_count?: number;
  clicks_count?: number;
  contacts_count?: number;
  applicants_count?: number;
  type: 'car' | 'property' | 'laptop' | 'secondhand' | 'job' | 'freelancer';
}

const MyAds = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [deleteId, setDeleteId] = useState<{ id: string; type: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchAllListings();
  }, [user, navigate]);

  const fetchAllListings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [carsRes, propsRes, laptopsRes, secondhandRes, jobsRes, freelancersRes] = await Promise.all([
        supabase.from("cars").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("properties").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("laptops").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("secondhand_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("jobs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("freelancers").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      const allListings: Listing[] = [
        ...(carsRes.data || []).map(car => ({
          ...car,
          title: getCarTitle(car.manufacturer, car.model),
          type: 'car' as const
        })),
        ...(propsRes.data || []).map(prop => ({
          ...prop,
          type: 'property' as const
        })),
        ...(laptopsRes.data || []).map(laptop => ({
          ...laptop,
          title: getLaptopTitle(laptop.brand, laptop.model),
          type: 'laptop' as const
        })),
        ...(secondhandRes.data || []).map(item => ({
          ...item,
          type: 'secondhand' as const
        })),
        ...(jobsRes.data || []).map(job => ({
          ...job,
          price: `${job.salary_min || 0}-${job.salary_max || 0}`,
          type: 'job' as const
        })),
        ...(freelancersRes.data || []).map(freelancer => ({
          ...freelancer,
          title: `${freelancer.full_name} - ${freelancer.title}`,
          price: freelancer.hourly_rate,
          location: freelancer.location || '',
          images: freelancer.avatar_url ? [freelancer.avatar_url] : [],
          views_count: 0,
          clicks_count: 0,
          contacts_count: freelancer.total_reviews || 0,
          status: freelancer.availability || 'available',
          type: 'freelancer' as const
        })),
      ];

      allListings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setListings(allListings);
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      toast.error("שגיאה באחזור המודעות");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      let deletePromise;
      
      switch (deleteId.type) {
        case 'car':
          deletePromise = supabase.from('cars').delete().eq('id', deleteId.id);
          break;
        case 'property':
          deletePromise = supabase.from('properties').delete().eq('id', deleteId.id);
          break;
        case 'laptop':
          deletePromise = supabase.from('laptops').delete().eq('id', deleteId.id);
          break;
        case 'secondhand':
          deletePromise = supabase.from('secondhand_items').delete().eq('id', deleteId.id);
          break;
        case 'job':
          deletePromise = supabase.from('jobs').delete().eq('id', deleteId.id);
          break;
        case 'freelancer':
          deletePromise = supabase.from('freelancers').delete().eq('id', deleteId.id);
          break;
        default:
          throw new Error('Invalid type');
      }

      const { error } = await deletePromise;

      if (error) throw error;

      toast.success("המודעה נמחקה בהצלחה");
      setListings(listings.filter(l => l.id !== deleteId.id));
      setDeleteId(null);
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      toast.error("שגיאה במחיקת המודעה");
    } finally {
      setDeleting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'car': return <Car className="h-4 w-4" />;
      case 'property': return <Home className="h-4 w-4" />;
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'secondhand': return <Package className="h-4 w-4" />;
      case 'job': return <Briefcase className="h-4 w-4" />;
      case 'freelancer': return <Users className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'car': return 'רכב';
      case 'property': return 'נדל״ן';
      case 'laptop': return 'מחשב';
      case 'secondhand': return 'יד שנייה';
      case 'job': return 'משרה';
      case 'freelancer': return 'פרילנסר';
      default: return type;
    }
  };

  const getViewUrl = (listing: Listing) => {
    const baseUrl = 
      listing.type === 'car' ? '/cars' :
      listing.type === 'property' ? '/properties' :
      listing.type === 'laptop' ? '/laptops' :
      listing.type === 'secondhand' ? '/secondhand/item' :
      listing.type === 'job' ? '/jobs' :
      listing.type === 'freelancer' ? '/freelancers' : '';
    
    return `${baseUrl}/${listing.id}`;
  };

  const filterByType = (type: string) => {
    if (type === 'all') return listings;
    return listings.filter(l => l.type === type);
  };

  const paginateListings = (listings: Listing[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return listings.slice(startIndex, endIndex);
  };

  const getTotalPages = (listings: Listing[]) => {
    return Math.ceil(listings.length / itemsPerPage);
  };

  const renderPagination = (totalItems: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            // Show first page, last page, current page, and pages around current
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              pageNum === currentPage - 2 ||
              pageNum === currentPage + 2
            ) {
              return (
                <PaginationItem key={pageNum}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderListingCard = (listing: Listing) => (
    <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Mobile Layout - Ultra compact horizontal card */}
      <div className="md:hidden flex gap-2 p-1.5">
        {/* Mobile Image - tiny square thumbnail */}
        <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          {listing.images && listing.images[0] ? (
            <CloudflareImage
              src={listing.images[0]}
              alt={listing.title || 'תמונה'}
              preset="thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              {getTypeIcon(listing.type)}
            </div>
          )}
        </div>
        
        {/* Mobile Content - ultra compact */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-xs font-bold text-foreground line-clamp-1">
            {listing.title || 'ללא כותרת'}
          </h3>
          <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
            <span className="truncate max-w-[80px]">{listing.location}</span>
            <span>•</span>
            <span>{new Date(listing.created_at).toLocaleDateString('he-IL')}</span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-xs font-bold text-primary">
              ₪{typeof listing.price === 'number' ? listing.price.toLocaleString('he-IL') : listing.price}
            </span>
            <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <Eye className="h-2 w-2" />{listing.views_count || 0}
              </span>
              <span className="flex items-center gap-0.5">
                <MousePointer className="h-2 w-2" />{listing.clicks_count || 0}
              </span>
              <span className="flex items-center gap-0.5">
                <Phone className="h-2 w-2" />{listing.type === 'job' ? (listing.applicants_count || 0) : (listing.contacts_count || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Actions - tiny icons */}
        <div className="flex flex-col gap-0 flex-shrink-0 justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(getViewUrl(listing))}
            className="h-5 w-5"
          >
            <Eye className="h-2.5 w-2.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId({ id: listing.id, type: listing.type })}
            className="h-5 w-5 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[200px_1fr] gap-4">
        {/* Desktop Image */}
        <div className="relative aspect-square bg-muted">
          {listing.images && listing.images[0] ? (
            <CloudflareImage
              src={listing.images[0]}
              alt={listing.title || 'תמונה'}
              preset="card"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              {getTypeIcon(listing.type)}
            </div>
          )}
          <Badge className="absolute top-2 left-2 bg-background/90 text-foreground">
            {getTypeName(listing.type)}
          </Badge>
        </div>
        
        {/* Desktop Content */}
        <div className="p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-bold text-foreground line-clamp-2">
                {listing.title || 'ללא כותרת'}
              </h3>
              <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                {listing.status === 'active' ? 'פעיל' : 'לא פעיל'}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(listing.created_at).toLocaleDateString('he-IL')}</span>
              </div>
            </div>

            <div className="text-2xl font-bold text-primary mb-3">
              {listing.type === 'job' 
                ? `₪${listing.price}` 
                : listing.type === 'freelancer'
                ? `₪${typeof listing.price === 'number' ? listing.price.toLocaleString('he-IL') : listing.price} לשעה`
                : `₪${typeof listing.price === 'number' ? listing.price.toLocaleString('he-IL') : listing.price}`
              }
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <span>צפיות</span>
                  <Eye className="h-3 w-3" />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {listing.views_count || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <span>לחיצות</span>
                  <MousePointer className="h-3 w-3" />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {listing.clicks_count || 0}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                  <span>{listing.type === 'job' ? 'מועמדים' : listing.type === 'freelancer' ? 'ביקורות' : 'פניות'}</span>
                  <Phone className="h-3 w-3" />
                </div>
                <div className="text-lg font-bold text-foreground">
                  {listing.type === 'job' ? (listing.applicants_count || 0) : (listing.contacts_count || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(getViewUrl(listing))}
              className="flex-1"
            >
              <Eye className="h-4 w-4 ml-2" />
              צפייה
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled
            >
              <Edit className="h-4 w-4 ml-2" />
              עריכה
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteId({ id: listing.id, type: listing.type })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-foreground mb-1">המודעות שלי</h1>
        <p className="text-xs md:text-base text-muted-foreground hidden md:block">
          כאן תוכל לראות, לערוך ולנהל את כל המודעות שפרסמת
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-3 md:space-y-6">
        <TabsList className="flex overflow-x-auto w-full h-auto p-1 gap-1">
          <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3 py-1.5 whitespace-nowrap">
            הכל ({listings.length})
          </TabsTrigger>
          <TabsTrigger value="car" className="text-xs md:text-sm px-2 md:px-3 py-1.5 whitespace-nowrap">
            <Car className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            רכבים ({filterByType('car').length})
          </TabsTrigger>
          <TabsTrigger value="property" className="text-xs md:text-sm px-2 md:px-3 py-1.5 whitespace-nowrap">
            <Home className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            נדל״ן ({filterByType('property').length})
          </TabsTrigger>
          <TabsTrigger value="laptop" className="text-xs md:text-sm px-2 md:px-3 py-1.5 whitespace-nowrap">
            <Laptop className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            מחשבים ({filterByType('laptop').length})
          </TabsTrigger>
          <TabsTrigger value="secondhand" className="text-xs md:text-sm px-2 md:px-3 py-1.5 whitespace-nowrap">
            <Package className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            יד שנייה ({filterByType('secondhand').length})
          </TabsTrigger>
          <TabsTrigger value="job" className="text-xs md:text-sm px-2 md:px-3 py-1.5 whitespace-nowrap">
            <Briefcase className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            משרות ({filterByType('job').length})
          </TabsTrigger>
          <TabsTrigger value="freelancer" className="text-xs md:text-sm px-2 md:px-3 py-1.5 whitespace-nowrap">
            <Users className="h-3 w-3 md:h-4 md:w-4 ml-1" />
            פרילנסרים ({filterByType('freelancer').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2 md:space-y-4">
          {listings.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">אין לך מודעות עדיין</p>
              <p className="text-muted-foreground text-sm mt-2">התחל לפרסם מודעות כדי לראות אותן כאן</p>
            </Card>
          ) : (
            <>
              {paginateListings(listings).map(renderListingCard)}
              {renderPagination(listings.length)}
            </>
          )}
        </TabsContent>

        <TabsContent value="car" className="space-y-4">
          {filterByType('car').length === 0 ? (
            <Card className="p-12 text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות רכב</p>
            </Card>
          ) : (
            <>
              {paginateListings(filterByType('car')).map(renderListingCard)}
              {renderPagination(filterByType('car').length)}
            </>
          )}
        </TabsContent>

        <TabsContent value="property" className="space-y-4">
          {filterByType('property').length === 0 ? (
            <Card className="p-12 text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות נדל״ן</p>
            </Card>
          ) : (
            <>
              {paginateListings(filterByType('property')).map(renderListingCard)}
              {renderPagination(filterByType('property').length)}
            </>
          )}
        </TabsContent>

        <TabsContent value="laptop" className="space-y-4">
          {filterByType('laptop').length === 0 ? (
            <Card className="p-12 text-center">
              <Laptop className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות מחשבים</p>
            </Card>
          ) : (
            <>
              {paginateListings(filterByType('laptop')).map(renderListingCard)}
              {renderPagination(filterByType('laptop').length)}
            </>
          )}
        </TabsContent>

        <TabsContent value="secondhand" className="space-y-4">
          {filterByType('secondhand').length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות יד שנייה</p>
            </Card>
          ) : (
            <>
              {paginateListings(filterByType('secondhand')).map(renderListingCard)}
              {renderPagination(filterByType('secondhand').length)}
            </>
          )}
        </TabsContent>

        <TabsContent value="job" className="space-y-4">
          {filterByType('job').length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות משרות</p>
            </Card>
          ) : (
            <>
              {paginateListings(filterByType('job')).map(renderListingCard)}
              {renderPagination(filterByType('job').length)}
            </>
          )}
        </TabsContent>

        <TabsContent value="freelancer" className="space-y-4">
          {filterByType('freelancer').length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך פרופילי פרילנסר</p>
            </Card>
          ) : (
            <>
              {paginateListings(filterByType('freelancer')).map(renderListingCard)}
              {renderPagination(filterByType('freelancer').length)}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם למחוק את המודעה?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את המודעה לצמיתות ולא ניתן יהיה לשחזר אותה.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "מחק"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyAds;