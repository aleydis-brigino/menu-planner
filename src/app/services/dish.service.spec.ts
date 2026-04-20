import { TestBed } from '@angular/core/testing';
import { DishService } from './dish.service';
import { StorageService } from './storage.service';
import { ValidationService } from './validation.service';
import { Dish, DishCollection } from '../models/dish.model';

describe('DishService', () => {
  let service: DishService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let validationService: ValidationService;

  const mockDish: Omit<Dish, 'id'> = {
    name: 'Spaghetti',
    ingredients: [{ name: 'pasta', quantity: 500, unit: 'g' }]
  };

  beforeEach(() => {
    storageServiceSpy = jasmine.createSpyObj('StorageService', ['loadCollection', 'saveCollection']);
    storageServiceSpy.loadCollection.and.returnValue({ dishes: [] });

    TestBed.configureTestingModule({
      providers: [
        DishService,
        ValidationService,
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    });

    validationService = TestBed.inject(ValidationService);
    service = TestBed.inject(DishService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial state from StorageService', () => {
    const existingDish: Dish = { id: '123', name: 'Pizza', ingredients: [{ name: 'dough', quantity: 1, unit: 'ball' }] };
    storageServiceSpy.loadCollection.and.returnValue({ dishes: [existingDish] });

    const freshService = new DishService(storageServiceSpy as any, validationService);
    expect(freshService.getDishes()).toEqual([existingDish]);
  });

  it('should expose dishes$ as an observable', (done) => {
    service.dishes$.subscribe(dishes => {
      expect(Array.isArray(dishes)).toBeTrue();
      done();
    });
  });

  describe('addDish', () => {
    it('should add a valid dish and return it with a generated UUID', () => {
      const result = service.addDish(mockDish);

      expect(result.id).toBeTruthy();
      expect(result.name).toBe('Spaghetti');
      expect(result.ingredients).toEqual(mockDish.ingredients);
      expect(service.getDishes().length).toBe(1);
    });

    it('should persist after adding a dish', () => {
      service.addDish(mockDish);

      expect(storageServiceSpy.saveCollection).toHaveBeenCalledWith({
        dishes: jasmine.arrayContaining([jasmine.objectContaining({ name: 'Spaghetti' })])
      });
    });

    it('should throw on invalid dish (empty name)', () => {
      expect(() => service.addDish({ name: '', ingredients: [{ name: 'x', quantity: 1, unit: 'g' }] }))
        .toThrowError(/Validation failed/);
    });

    it('should throw on invalid dish (no ingredients)', () => {
      expect(() => service.addDish({ name: 'Test', ingredients: [] }))
        .toThrowError(/Validation failed/);
    });
  });

  describe('updateDish', () => {
    it('should update an existing dish', () => {
      const added = service.addDish(mockDish);
      const updated = service.updateDish(added.id, { name: 'Penne' });

      expect(updated.name).toBe('Penne');
      expect(updated.ingredients).toEqual(mockDish.ingredients);
      expect(service.getDishes()[0].name).toBe('Penne');
    });

    it('should persist after updating a dish', () => {
      const added = service.addDish(mockDish);
      storageServiceSpy.saveCollection.calls.reset();

      service.updateDish(added.id, { name: 'Penne' });

      expect(storageServiceSpy.saveCollection).toHaveBeenCalled();
    });

    it('should throw if dish id not found', () => {
      expect(() => service.updateDish('nonexistent', { name: 'X' }))
        .toThrowError(/not found/);
    });

    it('should throw on invalid update (empty name)', () => {
      const added = service.addDish(mockDish);
      expect(() => service.updateDish(added.id, { name: '   ' }))
        .toThrowError(/Validation failed/);
    });
  });

  describe('removeDish', () => {
    it('should remove a dish by id', () => {
      const added = service.addDish(mockDish);
      service.removeDish(added.id);

      expect(service.getDishes().length).toBe(0);
    });

    it('should persist after removing a dish', () => {
      const added = service.addDish(mockDish);
      storageServiceSpy.saveCollection.calls.reset();

      service.removeDish(added.id);

      expect(storageServiceSpy.saveCollection).toHaveBeenCalledWith({ dishes: [] });
    });

    it('should be a no-op if id does not exist', () => {
      service.addDish(mockDish);
      service.removeDish('nonexistent');

      expect(service.getDishes().length).toBe(1);
    });
  });

  describe('getDishes', () => {
    it('should return current snapshot of dishes', () => {
      expect(service.getDishes()).toEqual([]);

      service.addDish(mockDish);
      expect(service.getDishes().length).toBe(1);
    });
  });
});
