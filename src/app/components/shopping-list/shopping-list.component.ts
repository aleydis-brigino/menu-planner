import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ShoppingListItem } from '../../models/shopping-list.model';
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

  private selectedIdsSubscription!: Subscription;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.selectedIdsSubscription = this.shoppingListService.selectedDishIds$.subscribe(ids => {
      const dishIds = Array.from(ids);
      this.hasSelection = dishIds.length > 0;

      if (this.hasSelection) {
        this.items = this.shoppingListService.generateShoppingList(dishIds);
      } else {
        this.items = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedIdsSubscription.unsubscribe();
  }

  toggleChecked(index: number): void {
    this.items[index].checked = !this.items[index].checked;
  }

  copyAsText(): void {
    const lines = this.items.map(item => {
      const check = item.checked ? '☑' : '☐';
      const suffix = item.checked ? ' (on hand)' : '';
      return `${check} ${item.name} - ${item.quantity} ${item.unit}${suffix}`;
    });
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
}
