/**
 * Generates a proper title without duplicate brand/manufacturer names
 * Prevents cases like "מזדה מאזדה 3" where model already contains manufacturer
 * Works for cars, laptops, and any other items with brand + model pattern
 */
export const getItemTitle = (brand: string | null | undefined, model: string): string => {
  if (!brand) return model;
  
  // Check if the model already contains the brand name (case-insensitive)
  const modelLower = model.toLowerCase();
  const brandLower = brand.toLowerCase();
  
  if (modelLower.includes(brandLower)) {
    return model;
  }
  
  return `${brand} ${model}`.trim();
};

// Alias for cars specifically
export const getCarTitle = getItemTitle;

// Alias for laptops specifically  
export const getLaptopTitle = getItemTitle;
