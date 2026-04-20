import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dish } from '../models/dish.model';
import { StorageService } from './storage.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private dishesSubject: BehaviorSubject<Dish[]>;
  dishes$: Observable<Dish[]>;

  constructor(
    private storageService: StorageService,
    private validationService: ValidationService
  ) {
    const collection = this.storageService.loadCollection();
    this.dishesSubject = new BehaviorSubject<Dish[]>(collection.dishes);
    this.dishes$ = this.dishesSubject.asObservable();
  }

  getDishes(): Dish[] {
    return this.dishesSubject.getValue();
  }

  addDish(dish: Omit<Dish, 'id'> & { id?: string }): Dish {
    const newDish: Dish = {
      ...dish,
      id: crypto.randomUUID()
    };

    const result = this.validationService.validateDish(newDish);
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }

    const dishes = [...this.getDishes(), newDish];
    this.dishesSubject.next(dishes);
    this.storageService.saveCollection({ dishes });
    return newDish;
  }

  updateDish(id: string, updates: Partial<Dish>): Dish {
    const dishes = this.getDishes();
    const index = dishes.findIndex(d => d.id === id);

    if (index === -1) {
      throw new Error(`Dish with id "${id}" not found`);
    }

    const updatedDish: Dish = { ...dishes[index], ...updates, id };

    const result = this.validationService.validateDish(updatedDish);
    if (!result.valid) {
      throw new Error(`Validation failed: ${result.errors.join(', ')}`);
    }

    const updatedDishes = [...dishes];
    updatedDishes[index] = updatedDish;
    this.dishesSubject.next(updatedDishes);
    this.storageService.saveCollection({ dishes: updatedDishes });
    return updatedDish;
  }

  removeDish(id: string): void {
    const dishes = this.getDishes().filter(d => d.id !== id);
    this.dishesSubject.next(dishes);
    this.storageService.saveCollection({ dishes });
  }
}
