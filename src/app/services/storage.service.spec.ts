import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { DishCollection } from '../models/dish.model';

describe('StorageService', () => {
  let service: StorageService;
  const STORAGE_KEY = 'menu-planner-dishes';

  const validCollection: DishCollection = {
    dishes: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Spaghetti Bolognese',
        ingredients: [
          { name: 'spaghetti', quantity: 500, unit: 'g' },
          { name: 'ground beef', quantity: 400, unit: 'g' }
        ]
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('loadCollection', () => {
    it('should return empty collection when localStorage is empty', () => {
      const result = service.loadCollection();
      expect(result).toEqual({ dishes: [] });
    });

    it('should return empty collection when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not valid json{{{');
      const result = service.loadCollection();
      expect(result).toEqual({ dishes: [] });
    });

    it('should return empty collection when localStorage contains wrong structure', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ notDishes: [] }));
      const result = service.loadCollection();
      expect(result).toEqual({ dishes: [] });
    });

    it('should return the stored collection when data is valid', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validCollection));
      const result = service.loadCollection();
      expect(result).toEqual(validCollection);
    });

    it('should return empty collection when dishes array contains invalid items', () => {
      const invalid = { dishes: [{ name: 'No ID dish' }] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invalid));
      const result = service.loadCollection();
      expect(result).toEqual({ dishes: [] });
    });
  });

  describe('saveCollection', () => {
    it('should serialize and write collection to localStorage', () => {
      service.saveCollection(validCollection);
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBe(JSON.stringify(validCollection));
    });

    it('should overwrite existing data', () => {
      service.saveCollection(validCollection);
      const emptyCollection: DishCollection = { dishes: [] };
      service.saveCollection(emptyCollection);
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBe(JSON.stringify(emptyCollection));
    });
  });

  describe('exportToJson', () => {
    it('should create and click an anchor element to trigger download', () => {
      service.saveCollection(validCollection);

      const clickSpy = jasmine.createSpy('click');
      const createElementSpy = spyOn(document, 'createElement').and.returnValue({
        href: '',
        download: '',
        click: clickSpy
      } as unknown as HTMLAnchorElement);
      spyOn(URL, 'createObjectURL').and.returnValue('blob:test-url');
      spyOn(URL, 'revokeObjectURL');

      service.exportToJson();

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
    });
  });

  describe('importFromJson', () => {
    it('should resolve with a valid collection from a JSON file', async () => {
      const json = JSON.stringify(validCollection);
      const file = new File([json], 'dishes.json', { type: 'application/json' });

      const result = await service.importFromJson(file);
      expect(result).toEqual(validCollection);
    });

    it('should reject when file contains invalid JSON', async () => {
      const file = new File(['not json'], 'bad.json', { type: 'application/json' });

      await expectAsync(service.importFromJson(file))
        .toBeRejectedWithError('Invalid JSON file');
    });

    it('should reject when file contains wrong structure', async () => {
      const json = JSON.stringify({ notDishes: [] });
      const file = new File([json], 'wrong.json', { type: 'application/json' });

      await expectAsync(service.importFromJson(file))
        .toBeRejectedWithError('Invalid dish collection structure');
    });
  });
});
