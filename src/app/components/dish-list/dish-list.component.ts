import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dish, DISH_CATEGORIES, DishCategory } from '../../models/dish.model';
import { DishService } from '../../services/dish.service';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
  selector: 'app-dish-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css']
})
export class DishListComponent implements OnInit, OnDestroy {
  dishes: Dish[] = [];
  selectedDishIds: Set<string> = new Set();
  categories = DISH_CATEGORIES;
  dishesByCategory: Record<string, Dish[]> = {};
  showDeleteAllConfirm = false;

  private dishesSubscription!: Subscription;
  private selectedIdsSubscription!: Subscription;

  constructor(
    private dishService: DishService,
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dishesSubscription = this.dishService.dishes$.subscribe(dishes => {
      this.dishes = dishes;
      this.groupByCategory();
    });

    this.selectedIdsSubscription = this.shoppingListService.selectedDishIds$.subscribe(ids => {
      this.selectedDishIds = ids;
    });
  }

  ngOnDestroy(): void {
    this.dishesSubscription.unsubscribe();
    this.selectedIdsSubscription.unsubscribe();
  }

  isSelected(dishId: string): boolean {
    return this.selectedDishIds.has(dishId);
  }

  toggleSelection(dishId: string): void {
    this.shoppingListService.toggleDishSelection(dishId);
  }

  editDish(dishId: string): void {
    this.router.navigate(['/dishes/edit', dishId]);
  }

  deleteDish(dishId: string): void {
    this.dishService.removeDish(dishId);
  }

  promptDeleteAll(): void {
    this.showDeleteAllConfirm = true;
  }

  cancelDeleteAll(): void {
    this.showDeleteAllConfirm = false;
  }

  confirmDeleteAll(): void {
    const currentDishes = this.dishService.getDishes();
    for (const dish of currentDishes) {
      this.dishService.removeDish(dish.id);
    }
    this.showDeleteAllConfirm = false;
  }

  private groupByCategory(): void {
    this.dishesByCategory = {};
    for (const cat of this.categories) {
      const catDishes = this.dishes.filter(d => (d.category || 'Others') === cat);
      if (catDishes.length > 0) {
        this.dishesByCategory[cat] = catDishes;
      }
    }
  }

  get activeCategories(): string[] {
    return this.categories.filter(cat => this.dishesByCategory[cat]?.length > 0);
  }
}
