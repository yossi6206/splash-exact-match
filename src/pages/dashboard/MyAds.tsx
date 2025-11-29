import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  MapPin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
  type: 'car' | 'property' | 'laptop' | 'secondhand' | 'job' | 'freelancer';
}

const MyAds = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [deleteId, setDeleteId] = useState<{ id: string; type: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      const [carsRes, propsRes, laptopsRes, secondhandRes, jobsRes] = await Promise.all([
        supabase.from("cars").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("properties").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("laptops").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("secondhand_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("jobs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      const allListings: Listing[] = [
        ...(carsRes.data || []).map(car => ({
          ...car,
          title: `${car.manufacturer || ''} ${car.model}`.trim(),
          type: 'car' as const
        })),
        ...(propsRes.data || []).map(prop => ({
          ...prop,
          type: 'property' as const
        })),
        ...(laptopsRes.data || []).map(laptop => ({
          ...laptop,
          title: `${laptop.brand} ${laptop.model}`,
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
      default: return type;
    }
  };

  const getViewUrl = (listing: Listing) => {
    const baseUrl = 
      listing.type === 'car' ? '/cars' :
      listing.type === 'property' ? '/properties' :
      listing.type === 'laptop' ? '/laptops' :
      listing.type === 'secondhand' ? '/secondhand' :
      listing.type === 'job' ? '/jobs' : '';
    
    return `${baseUrl}/${listing.id}`;
  };

  const filterByType = (type: string) => {
    if (type === 'all') return listings;
    return listings.filter(l => l.type === type);
  };

  const renderListingCard = (listing: Listing) => (
    <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
        {/* Image */}
        <div className="relative aspect-video md:aspect-square bg-muted">
          {listing.images && listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title || 'תמונה'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              {getTypeIcon(listing.type)}
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
            {getTypeName(listing.type)}
          </Badge>
        </div>

        {/* Content */}
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

            <div className="text-2xl font-bold text-primary">
              {listing.type === 'job' 
                ? `₪${listing.price}` 
                : `₪${typeof listing.price === 'number' ? listing.price.toLocaleString('he-IL') : listing.price}`
              }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">המודעות שלי</h1>
        <p className="text-muted-foreground">
          כאן תוכל לראות, לערוך ולנהל את כל המודעות שפרסמת
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="all">
            הכל ({listings.length})
          </TabsTrigger>
          <TabsTrigger value="car">
            <Car className="h-4 w-4 ml-2" />
            רכבים ({filterByType('car').length})
          </TabsTrigger>
          <TabsTrigger value="property">
            <Home className="h-4 w-4 ml-2" />
            נדל״ן ({filterByType('property').length})
          </TabsTrigger>
          <TabsTrigger value="laptop">
            <Laptop className="h-4 w-4 ml-2" />
            מחשבים ({filterByType('laptop').length})
          </TabsTrigger>
          <TabsTrigger value="secondhand">
            <Package className="h-4 w-4 ml-2" />
            יד שנייה ({filterByType('secondhand').length})
          </TabsTrigger>
          <TabsTrigger value="job">
            <Briefcase className="h-4 w-4 ml-2" />
            משרות ({filterByType('job').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {listings.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground text-lg">אין לך מודעות עדיין</p>
              <p className="text-muted-foreground text-sm mt-2">התחל לפרסם מודעות כדי לראות אותן כאן</p>
            </Card>
          ) : (
            listings.map(renderListingCard)
          )}
        </TabsContent>

        <TabsContent value="car" className="space-y-4">
          {filterByType('car').length === 0 ? (
            <Card className="p-12 text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות רכב</p>
            </Card>
          ) : (
            filterByType('car').map(renderListingCard)
          )}
        </TabsContent>

        <TabsContent value="property" className="space-y-4">
          {filterByType('property').length === 0 ? (
            <Card className="p-12 text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות נדל״ן</p>
            </Card>
          ) : (
            filterByType('property').map(renderListingCard)
          )}
        </TabsContent>

        <TabsContent value="laptop" className="space-y-4">
          {filterByType('laptop').length === 0 ? (
            <Card className="p-12 text-center">
              <Laptop className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות מחשבים</p>
            </Card>
          ) : (
            filterByType('laptop').map(renderListingCard)
          )}
        </TabsContent>

        <TabsContent value="secondhand" className="space-y-4">
          {filterByType('secondhand').length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות יד שנייה</p>
            </Card>
          ) : (
            filterByType('secondhand').map(renderListingCard)
          )}
        </TabsContent>

        <TabsContent value="job" className="space-y-4">
          {filterByType('job').length === 0 ? (
            <Card className="p-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">אין לך מודעות משרות</p>
            </Card>
          ) : (
            filterByType('job').map(renderListingCard)
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