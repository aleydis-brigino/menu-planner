import { Injectable } from '@angular/core';
import { Dish, Ingredient, ValidationResult } from '../models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  validateDish(dish: Dish): ValidationResult {
    const errors: string[] = [];

    if (!dish.name || dish.name.trim().length === 0) {
      errors.push('Dish name must not be empty');
    }

    if (!dish.ingredients || dish.ingredients.length === 0) {
      errors.push('Dish must have at least one ingredient');
    } else {
      const hasValidIngredient = dish.ingredients.some(
        ingredient => this.validateIngredient(ingredient).valid
      );

      if (!hasValidIngredient) {
        errors.push('Dish must have at least one valid ingredient');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateIngredient(ingredient: Ingredient): ValidationResult {
    const errors: string[] = [];

    if (!ingredient.name || ingredient.name.trim().length === 0) {
      errors.push('Ingredient name must not be empty');
    }

    if (ingredient.quantity <= 0) {
      errors.push('Ingredient quantity must be greater than zero');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
