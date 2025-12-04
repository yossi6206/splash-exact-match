/**
 * Generates a proper car title without duplicate manufacturer names
 * Prevents cases like "מזדה מאזדה 3" where model already contains manufacturer
 */
export const getCarTitle = (manufacturer: string | null | undefined, model: string): string => {
  if (!manufacturer) return model;
  
  // Check if the model already contains the manufacturer name (case-insensitive)
  const modelLower = model.toLowerCase();
  const manufacturerLower = manufacturer.toLowerCase();
  
  if (modelLower.includes(manufacturerLower)) {
    return model;
  }
  
  return `${manufacturer} ${model}`.trim();
};
