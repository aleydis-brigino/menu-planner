import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { Dish, Ingredient } from '../models/dish.model';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateIngredient', () => {
    it('should accept a valid ingredient', () => {
      const ingredient: Ingredient = { name: 'Flour', quantity: 500, unit: 'g' };
      const result = service.validateIngredient(ingredient);
      expect(result.valid).toBeTrue();
      expect(result.errors).toEqual([]);
    });

    it('should reject an ingredient with an empty name', () => {
      const ingredient: Ingredient = { name: '', quantity: 1, unit: 'kg' };
      const result = service.validateIngredient(ingredient);
      expect(result.valid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject an ingredient with a whitespace-only name', () => {
      const ingredient: Ingredient = { name: '   ', quantity: 1, unit: 'kg' };
      const result = service.validateIngredient(ingredient);
      expect(result.valid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject an ingredient with quantity zero', () => {
      const ingredient: Ingredient = { name: 'Salt', quantity: 0, unit: 'tsp' };
      const result = service.validateIngredient(ingredient);
      expect(result.valid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject an ingredient with negative quantity', () => {
      const ingredient: Ingredient = { name: 'Salt', quantity: -5, unit: 'tsp' };
      const result = service.validateIngredient(ingredient);
      expect(result.valid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateDish', () => {
    it('should accept a valid dish', () => {
      const dish: Dish = {
        id: '123',
        name: 'Pasta',
        ingredients: [{ name: 'Spaghetti', quantity: 500, unit: 'g' }]
      };
      const result = service.validateDish(dish);
      expect(result.valid).toBeTrue();
      expect(result.errors).toEqual([]);
    });

    it('should reject a dish with an empty name', () => {
      const dish: Dish = {
        id: '123',
        name: '',
        ingredients: [{ name: 'Spaghetti', quantity: 500, unit: 'g' }]
      };
      const result = service.validateDish(dish);
      expect(result.valid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject a dish with a whitespace-only name', () => {
      const dish: Dish = {
        id: '123',
        name: '   ',
        ingredients: [{ name: 'Spaghetti', quantity: 500, unit: 'g' }]
      };
      const result = service.validateDish(dish);
      expect(result.valid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject a dish with zero ingredients', () => {
      const dish: Dish = {
        id: '123',
        name: 'Empty Dish',
        ingredients: []
      };
      const result = service.validateDish(dish);
      expect(result.valid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject a dish where all ingredients are invalid', () => {
      const dish: Dish = {
        id: '123',
        name: 'Bad Dish',
        ingredients: [{ name: '', quantity: 0, unit: 'g' }]
      };
      const result = service.validateDish(dish);
      expect(result.valid).toBeFalse();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should accept a dish with at least one valid ingredient among invalid ones', () => {
      const dish: Dish = {
        id: '123',
        name: 'Mixed Dish',
        ingredients: [
          { name: '', quantity: 0, unit: 'g' },
          { name: 'Flour', quantity: 200, unit: 'g' }
        ]
      };
      const result = service.validateDish(dish);
      expect(result.valid).toBeTrue();
      expect(result.errors).toEqual([]);
    });
  });
});
