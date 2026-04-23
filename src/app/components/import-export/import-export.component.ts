import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';
import { DishService } from '../../services/dish.service';
import { Dish, DishCollection } from '../../models/dish.model';

@Component({
  selector: 'app-import-export',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.css']
})
export class ImportExportComponent {
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showDefaultConfirm = false;

  constructor(
    private storageService: StorageService,
    private dishService: DishService,
    private http: HttpClient
  ) {}

  exportCollection(): void {
    this.storageService.exportToJson();
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;

    try {
      const collection = await this.storageService.importFromJson(file);
      this.storageService.saveCollection(collection);
      this.reloadDishes(collection.dishes);
      this.successMessage = 'Collection imported successfully!';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to import file';
    } finally {
      // Reset the file input so the same file can be re-imported
      input.value = '';
    }
  }

  private reloadDishes(importedDishes: Dish[]): void {
    // Remove all existing dishes
    const currentDishes = this.dishService.getDishes();
    for (const dish of currentDishes) {
      this.dishService.removeDish(dish.id);
    }
    // Add imported dishes (addDish generates new IDs, which is acceptable)
    for (const dish of importedDishes) {
      this.dishService.addDish(dish);
    }
  }

  promptLoadDefaults(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.showDefaultConfirm = true;
  }

  cancelLoadDefaults(): void {
    this.showDefaultConfirm = false;
  }

  confirmLoadDefaults(): void {
    this.showDefaultConfirm = false;
    this.http.get<DishCollection>('assets/data/default-dishes.json').subscribe({
      next: (collection) => {
        this.storageService.saveCollection(collection);
        this.reloadDishes(collection.dishes);
        this.successMessage = 'Default dishes loaded successfully!';
      },
      error: () => {
        this.errorMessage = 'Failed to load default dishes.';
      }
    });
  }
}
