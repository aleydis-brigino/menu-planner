import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dish } from '../models/dish.model';
import { ShoppingListItem } from '../models/shopping-list.model';
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

    // Map to track consolidated ingredients
    // Key: normalizedName + '|' + unit
    const consolidated = new Map<string, { name: string; quantity: number; unit: string }>();

    for (const dish of selectedDishes) {
      for (const ingredient of dish.ingredients) {
        const normalizedName = ingredient.name.trim().toLowerCase();
        const key = `${normalizedName}|${ingredient.unit}`;

        if (consolidated.has(key)) {
          const existing = consolidated.get(key)!;
          existing.quantity += ingredient.quantity;
        } else {
          consolidated.set(key, {
            name: ingredient.name.trim(),
            quantity: ingredient.quantity,
            unit: ingredient.unit
          });
        }
      }
    }

    // Convert to ShoppingListItem array and sort alphabetically (case-insensitive)
    const items: ShoppingListItem[] = Array.from(consolidated.values()).map(entry => ({
      name: entry.name,
      quantity: entry.quantity,
      unit: entry.unit,
      checked: false
    }));

    items.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    return items;
  }
}
