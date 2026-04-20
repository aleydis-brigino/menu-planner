export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Dish {
  id: string; // UUID
  name: string;
  ingredients: Ingredient[];
}

export interface DishCollection {
  dishes: Dish[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
