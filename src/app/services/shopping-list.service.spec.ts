import { TestBed } from '@angular/core/testing';
import { ShoppingListService } from './shopping-list.service';
import { DishService } from './dish.service';
import { Dish } from '../models/dish.model';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let dishServiceSpy: jasmine.SpyObj<DishService>;

  const mockDishes: Dish[] = [
    {
      id: 'dish-1',
      name: 'Spaghetti Bolognese',
      ingredients: [
        { name: 'Spaghetti', quantity: 500, unit: 'g' },
        { name: 'ground beef', quantity: 400, unit: 'g' },
        { name: 'Tomato Sauce', quantity: 1, unit: 'jar' }
      ]
    },
    {
      id: 'dish-2',
      name: 'Meatballs',
      ingredients: [
        { name: 'Ground Beef', quantity: 300, unit: 'g' },
        { name: 'Breadcrumbs', quantity: 100, unit: 'g' },
        { name: 'eggs', quantity: 2, unit: 'pcs' }
      ]
    },
    {
      id: 'dish-3',
      name: 'Tomato Soup',
      ingredients: [
        { name: 'tomato sauce', quantity: 2, unit: 'cans' },
        { name: 'Onion', quantity: 1, unit: 'pcs' }
      ]
    }
  ];

  beforeEach(() => {
    dishServiceSpy = jasmine.createSpyObj('DishService', ['getDishes']);
    dishServiceSpy.getDishes.and.returnValue(mockDishes);

    TestBed.configureTestingModule({
      providers: [
        ShoppingListService,
        { provide: DishService, useValue: dishServiceSpy }
      ]
    });
    service = TestBed.inject(ShoppingListService);
  });

  describe('toggleDishSelection', () => {
    it('should add a dish id to selection', (done) => {
      service.toggleDishSelection('dish-1');
      service.selectedDishIds$.subscribe(ids => {
        expect(ids.has('dish-1')).toBeTrue();
        expect(ids.size).toBe(1);
        done();
      });
    });

    it('should remove a dish id if already selected', (done) => {
      service.toggleDishSelection('dish-1');
      service.toggleDishSelection('dish-1');
      service.selectedDishIds$.subscribe(ids => {
        expect(ids.has('dish-1')).toBeFalse();
        expect(ids.size).toBe(0);
        done();
      });
    });

    it('should support multiple selections', (done) => {
      service.toggleDishSelection('dish-1');
      service.toggleDishSelection('dish-2');
      service.selectedDishIds$.subscribe(ids => {
        expect(ids.has('dish-1')).toBeTrue();
        expect(ids.has('dish-2')).toBeTrue();
        expect(ids.size).toBe(2);
        done();
      });
    });
  });

  describe('clearSelection', () => {
    it('should deselect all dishes', (done) => {
      service.toggleDishSelection('dish-1');
      service.toggleDishSelection('dish-2');
      service.clearSelection();
      service.selectedDishIds$.subscribe(ids => {
        expect(ids.size).toBe(0);
        done();
      });
    });
  });

  describe('generateShoppingList', () => {
    it('should return empty list when no dishes are selected', () => {
      const result = service.generateShoppingList([]);
      expect(result.length).toBe(0);
    });

    it('should return ingredients from a single dish', () => {
      const result = service.generateShoppingList(['dish-1']);
      expect(result.length).toBe(3);
      expect(result.find(i => i.name.toLowerCase() === 'spaghetti')).toBeTruthy();
      expect(result.find(i => i.name.toLowerCase() === 'ground beef')).toBeTruthy();
      expect(result.find(i => i.name.toLowerCase() === 'tomato sauce')).toBeTruthy();
    });

    it('should sum quantities for same name + same unit (case-insensitive)', () => {
      // dish-1 has "ground beef" 400g, dish-2 has "Ground Beef" 300g
      const result = service.generateShoppingList(['dish-1', 'dish-2']);
      const groundBeef = result.find(i => i.name.toLowerCase() === 'ground beef' && i.unit === 'g');
      expect(groundBeef).toBeTruthy();
      expect(groundBeef!.quantity).toBe(700);
    });

    it('should keep separate entries for same name but different unit', () => {
      // dish-1 has "Tomato Sauce" 1 jar, dish-3 has "tomato sauce" 2 cans
      const result = service.generateShoppingList(['dish-1', 'dish-3']);
      const tomatoSauceItems = result.filter(i => i.name.toLowerCase() === 'tomato sauce');
      expect(tomatoSauceItems.length).toBe(2);
      expect(tomatoSauceItems.find(i => i.unit === 'jar')!.quantity).toBe(1);
      expect(tomatoSauceItems.find(i => i.unit === 'cans')!.quantity).toBe(2);
    });

    it('should sort results alphabetically (case-insensitive)', () => {
      const result = service.generateShoppingList(['dish-1', 'dish-2']);
      for (let i = 0; i < result.length - 1; i++) {
        const current = result[i].name.toLowerCase();
        const next = result[i + 1].name.toLowerCase();
        expect(current.localeCompare(next)).toBeLessThanOrEqual(0);
      }
    });

    it('should use original casing from first occurrence for display name', () => {
      // dish-1 has "ground beef" (lowercase), dish-2 has "Ground Beef" (title case)
      // First occurrence is "ground beef" from dish-1
      const result = service.generateShoppingList(['dish-1', 'dish-2']);
      const groundBeef = result.find(i => i.name.toLowerCase() === 'ground beef');
      expect(groundBeef!.name).toBe('ground beef');
    });

    it('should set checked to false for all items', () => {
      const result = service.generateShoppingList(['dish-1', 'dish-2']);
      for (const item of result) {
        expect(item.checked).toBeFalse();
      }
    });

    it('should trim ingredient names for normalization', () => {
      // Override getDishes to include whitespace in names
      const dishesWithWhitespace: Dish[] = [
        {
          id: 'dish-ws-1',
          name: 'Test Dish 1',
          ingredients: [{ name: '  Flour  ', quantity: 200, unit: 'g' }]
        },
        {
          id: 'dish-ws-2',
          name: 'Test Dish 2',
          ingredients: [{ name: 'flour', quantity: 100, unit: 'g' }]
        }
      ];
      dishServiceSpy.getDishes.and.returnValue(dishesWithWhitespace);

      const result = service.generateShoppingList(['dish-ws-1', 'dish-ws-2']);
      const flour = result.find(i => i.name.toLowerCase() === 'flour');
      expect(flour).toBeTruthy();
      expect(flour!.quantity).toBe(300);
      expect(flour!.name).toBe('Flour'); // trimmed first occurrence
    });
  });
});
