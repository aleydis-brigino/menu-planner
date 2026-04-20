import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish.model';

@Component({
  selector: 'app-import-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.css']
})
export class ImportExportComponent {
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private storageService: StorageService,
    private dishService: DishService
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
      setTimeout(() => {
        this.successMessage = null;
      }, 3000);
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
}
