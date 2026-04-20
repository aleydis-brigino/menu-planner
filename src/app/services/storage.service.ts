import { Injectable } from '@angular/core';
import { DishCollection } from '../models/dish.model';

const STORAGE_KEY = 'menu-planner-dishes';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  loadCollection(): DishCollection {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { dishes: [] };
      }
      const parsed = JSON.parse(raw);
      if (this.isValidCollection(parsed)) {
        return parsed;
      }
      return { dishes: [] };
    } catch {
      return { dishes: [] };
    }
  }

  saveCollection(collection: DishCollection): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  }

  exportToJson(): void {
    const collection = this.loadCollection();
    const json = JSON.stringify(collection, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'dishes.json';
    anchor.click();

    URL.revokeObjectURL(url);
  }

  importFromJson(file: File): Promise<DishCollection> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const text = reader.result as string;
          const parsed = JSON.parse(text);
          if (this.isValidCollection(parsed)) {
            resolve(parsed);
          } else {
            reject(new Error('Invalid dish collection structure'));
          }
        } catch {
          reject(new Error('Invalid JSON file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  private isValidCollection(data: unknown): data is DishCollection {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const obj = data as Record<string, unknown>;
    if (!Array.isArray(obj['dishes'])) {
      return false;
    }

    return obj['dishes'].every((dish: unknown) => {
      if (!dish || typeof dish !== 'object') {
        return false;
      }
      const d = dish as Record<string, unknown>;
      if (typeof d['id'] !== 'string' || typeof d['name'] !== 'string') {
        return false;
      }
      if (!Array.isArray(d['ingredients'])) {
        return false;
      }
      return d['ingredients'].every((ing: unknown) => {
        if (!ing || typeof ing !== 'object') {
          return false;
        }
        const i = ing as Record<string, unknown>;
        return (
          typeof i['name'] === 'string' &&
          typeof i['quantity'] === 'number' &&
          typeof i['unit'] === 'string'
        );
      });
    });
  }
}
