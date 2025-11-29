import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export const ImageUpload = ({ onImagesChange, maxImages = 8, existingImages = [] }: ImageUploadProps) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('שגיאה בהעלאת התמונה: ' + error.message);
      return null;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`ניתן להעלות עד ${maxImages} תמונות`);
      return;
    }

    setUploading(true);

    const uploadPromises = Array.from(files).map(file => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`הקובץ ${file.name} גדול מדי (מקסימום 5MB)`);
        return Promise.resolve(null);
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`הקובץ ${file.name} אינו תמונה`);
        return Promise.resolve(null);
      }

      return uploadImage(file);
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter((url): url is string => url !== null);

    const newImages = [...images, ...validUrls];
    setImages(newImages);
    onImagesChange(newImages);
    setUploading(false);

    if (validUrls.length > 0) {
      toast.success(`${validUrls.length} תמונות הועלו בהצלחה`);
    }

    // Reset input
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <Card key={index} className="relative aspect-square overflow-hidden group">
            <img
              src={url}
              alt={`תמונה ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Card>
        ))}

        {images.length < maxImages && (
          <label
            className="aspect-square border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">מעלה...</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground text-center px-2">
                  לחץ להעלאת תמונה
                </span>
              </>
            )}
          </label>
        )}
      </div>

      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div>
          <p>ניתן להעלות עד {maxImages} תמונות (מקסימום 5MB לתמונה)</p>
          <p>תמונה ראשונה תהיה התמונה הראשית של המודעה</p>
        </div>
      </div>
    </div>
  );
};