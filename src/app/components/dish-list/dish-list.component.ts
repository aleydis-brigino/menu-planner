import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Dish } from '../../models/dish.model';
import { DishService } from '../../services/dish.service';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
  selector: 'app-dish-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css']
})
export class DishListComponent implements OnInit, OnDestroy {
  dishes: Dish[] = [];
  selectedDishIds: Set<string> = new Set();

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
}
