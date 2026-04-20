import { SortAlphabeticalPipe } from './sort-alphabetical.pipe';
import { ShoppingListItem } from '../models/shopping-list.model';

describe('SortAlphabeticalPipe', () => {
  let pipe: SortAlphabeticalPipe;

  beforeEach(() => {
    pipe = new SortAlphabeticalPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty array for empty input', () => {
    expect(pipe.transform([])).toEqual([]);
  });

  it('should return null/undefined as-is', () => {
    expect(pipe.transform(null as any)).toBeNull();
    expect(pipe.transform(undefined as any)).toBeUndefined();
  });

  it('should sort items alphabetically by name (case-insensitive)', () => {
    const items: ShoppingListItem[] = [
      { name: 'Tomato', quantity: 2, unit: 'kg', checked: false },
      { name: 'apple', quantity: 3, unit: 'pcs', checked: false },
      { name: 'Banana', quantity: 1, unit: 'bunch', checked: false },
    ];

    const result = pipe.transform(items);

    expect(result[0].name).toBe('apple');
    expect(result[1].name).toBe('Banana');
    expect(result[2].name).toBe('Tomato');
  });

  it('should not mutate the original array', () => {
    const items: ShoppingListItem[] = [
      { name: 'Zucchini', quantity: 1, unit: 'pcs', checked: false },
      { name: 'Avocado', quantity: 2, unit: 'pcs', checked: false },
    ];

    const result = pipe.transform(items);

    expect(result).not.toBe(items);
    expect(items[0].name).toBe('Zucchini');
  });

  it('should handle single item array', () => {
    const items: ShoppingListItem[] = [
      { name: 'Milk', quantity: 1, unit: 'L', checked: false },
    ];

    const result = pipe.transform(items);

    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Milk');
  });
});
