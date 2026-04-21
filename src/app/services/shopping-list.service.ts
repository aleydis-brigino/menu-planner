import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dish, INGREDIENT_CATEGORIES, IngredientCategory } from '../models/dish.model';
import { ShoppingListItem, IngredientSource } from '../models/shopping-list.model';
import { DishService } from './dish.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private selectedDishIdsSubject = new BehaviorSubject<Set<string>>(new Set());
  selectedDishIds$: Observable<Set<string>> = this.selectedDishIdsSubject.asObservable();

  constructor(private dishService: DishService) {}

  toggleDishSelection(id: string): void {
    const current = new Set(this.selectedDishIdsSubject.getValue());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedDishIdsSubject.next(current);
  }

  clearSelection(): void {
    this.selectedDishIdsSubject.next(new Set());
  }

  generateShoppingList(dishIds: string[]): ShoppingListItem[] {
    const dishes = this.dishService.getDishes();
    const selectedDishes = dishes.filter(d => dishIds.includes(d.id));

    // Group by normalized ingredient name
    const grouped = new Map<string, {
      name: string;
      category: IngredientCategory;
      sources: IngredientSource[];
    }>();

    for (const dish of selectedDishes) {
      for (const ingredient of dish.ingredients) {
        const normalizedName = ingredient.name.trim().toLowerCase();

        if (grouped.has(normalizedName)) {
          grouped.get(normalizedName)!.sources.push({
            dishName: dish.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit
          });
        } else {
          grouped.set(normalizedName, {
            name: ingredient.name.trim(),
            category: ingredient.category || 'Others',
            sources: [{
              dishName: dish.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit
            }]
          });
        }
      }
    }

    // Build ShoppingListItems
    const items: ShoppingListItem[] = Array.from(grouped.values()).map(entry => {
      // Check if all sources share the same unit
      const allSameUnit = entry.sources.every(s => s.unit === entry.sources[0].unit);

      let totalQuantity: number | null = null;
      let totalUnit: string | null = null;

      if (allSameUnit) {
        totalQuantity = entry.sources.reduce((sum, s) => sum + s.quantity, 0);
        totalUnit = entry.sources[0].unit;
      }

      return {
        name: entry.name,
        category: entry.category,
        checked: false,
        sources: entry.sources,
        totalQuantity,
        totalUnit
      };
    });

    items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    return items;
  }
}
