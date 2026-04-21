import { IngredientCategory } from './dish.model';

export interface IngredientSource {
  dishName: string;
  quantity: number;
  unit: string;
}

export interface ShoppingListItem {
  name: string;
  category: IngredientCategory;
  checked: boolean;
  /** All sources for this ingredient. If length === 1 and units match, it's a simple entry. */
  sources: IngredientSource[];
  /** Total quantity — only set when all sources share the same unit. */
  totalQuantity: number | null;
  /** Shared unit — only set when all sources share the same unit. */
  totalUnit: string | null;
}
