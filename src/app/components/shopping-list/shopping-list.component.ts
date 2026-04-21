import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ShoppingListItem } from '../../models/shopping-list.model';
import { INGREDIENT_CATEGORIES } from '../../models/dish.model';
import { ShoppingListService } from '../../services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  items: ShoppingListItem[] = [];
  hasSelection = false;
  copyButtonText = 'Copy as Text';
  categories = INGREDIENT_CATEGORIES;
  itemsByCategory: Record<string, ShoppingListItem[]> = {};

  private selectedIdsSubscription!: Subscription;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.selectedIdsSubscription = this.shoppingListService.selectedDishIds$.subscribe(ids => {
      const dishIds = Array.from(ids);
      this.hasSelection = dishIds.length > 0;

      if (this.hasSelection) {
        this.items = this.shoppingListService.generateShoppingList(dishIds);
        this.groupByCategory();
      } else {
        this.items = [];
        this.itemsByCategory = {};
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedIdsSubscription.unsubscribe();
  }

  copyAsText(): void {
    const lines: string[] = [];
    for (const item of this.items) {
      const check = item.checked ? '☑' : '☐';
      if (item.totalQuantity !== null) {
        lines.push(`${check} ${item.name} - ${item.totalQuantity} ${item.totalUnit}`);
      } else {
        lines.push(`${check} ${item.name}`);
      }
      if (item.sources.length > 1) {
        for (const src of item.sources) {
          lines.push(`    · ${src.quantity} ${src.unit} (for ${src.dishName})`);
        }
      }
    }
    const text = 'Shopping List\n' + lines.join('\n');

    navigator.clipboard.writeText(text).then(() => {
      this.copyButtonText = 'Copied!';
      setTimeout(() => {
        this.copyButtonText = 'Copy as Text';
      }, 2000);
    });
  }

  print(): void {
    window.print();
  }

  private groupByCategory(): void {
    this.itemsByCategory = {};
    for (const cat of this.categories) {
      const catItems = this.items.filter(item => (item.category || 'Others') === cat);
      if (catItems.length > 0) {
        this.itemsByCategory[cat] = catItems;
      }
    }
  }

  get activeCategories(): string[] {
    return this.categories.filter(cat => this.itemsByCategory[cat]?.length > 0);
  }

  toggleChecked(item: ShoppingListItem): void {
    item.checked = !item.checked;
  }
}
