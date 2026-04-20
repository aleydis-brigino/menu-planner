import { Pipe, PipeTransform } from '@angular/core';
import { ShoppingListItem } from '../models/shopping-list.model';

@Pipe({
  name: 'sortAlphabetical',
  standalone: true
})
export class SortAlphabeticalPipe implements PipeTransform {
  transform(items: ShoppingListItem[]): ShoppingListItem[] {
    if (!items || items.length === 0) {
      return items;
    }

    return [...items].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }
}
