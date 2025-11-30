/**
 * Checks if an item is currently promoted
 * @param item - Item to check
 * @returns boolean
 */
export function isItemPromoted(item: {
  is_promoted?: boolean;
  promotion_end_date?: string | null;
}): boolean {
  return Boolean(
    item.is_promoted && 
    item.promotion_end_date && 
    new Date(item.promotion_end_date) > new Date()
  );
}

/**
 * Combines promoted and regular items into a single array
 * @param promoted - Array of promoted items
 * @param regular - Array of regular items
 * @returns Combined array with promoted items first
 */
export function combinePromotedAndRegular<T>(
  promoted: T[],
  regular: T[]
): T[] {
  return [...(promoted || []), ...(regular || [])];
}
