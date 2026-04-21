export const DISH_CATEGORIES = ['Pork', 'Beef', 'Chicken', 'Seafood', 'Vegetables', 'Others'] as const;
export type DishCategory = typeof DISH_CATEGORIES[number];

export const INGREDIENT_CATEGORIES = [
  'Fruits and Vegetables', 'Meats', 'Seafood', 'Dairy and Eggs',
  'Condiments and Spices', 'Preserved Food', 'Pasta and Grains', 'Others'
] as const;
export type IngredientCategory = typeof INGREDIENT_CATEGORIES[number];

export const UNIT_GROUPS: { label: string; units: string[] }[] = [
  { label: 'Volume', units: ['ml', 'L', 'tsp', 'tbsp', 'cup'] },
  { label: 'Weight', units: ['g', 'kg'] },
  { label: 'Count/Other', units: ['pcs', 'slice', 'bunch', 'clove', 'can', 'jar', 'bottle', 'pack', 'bag', 'pinch', 'dash'] },
];

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
}

export interface Dish {
  id: string; // UUID
  name: string;
  category: DishCategory;
  ingredients: Ingredient[];
}

export interface DishCollection {
  dishes: Dish[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
