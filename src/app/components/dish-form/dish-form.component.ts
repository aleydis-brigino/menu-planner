import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DishService } from '../../services/dish.service';
import { Dish, DISH_CATEGORIES, DishCategory, INGREDIENT_CATEGORIES, IngredientCategory, UNIT_GROUPS } from '../../models/dish.model';

@Component({
  selector: 'app-dish-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css']
})
export class DishFormComponent implements OnInit {
  dishForm!: FormGroup;
  isEditMode = false;
  dishId: string | null = null;
  categories = DISH_CATEGORIES;
  ingredientCategories = INGREDIENT_CATEGORIES;
  unitGroups = UNIT_GROUPS;

  constructor(
    private fb: FormBuilder,
    private dishService: DishService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.dishId = this.route.snapshot.paramMap.get('id');
    if (this.dishId) {
      this.isEditMode = true;
      this.loadDish(this.dishId);
    }
  }

  private initForm(): void {
    this.dishForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      category: ['Others' as DishCategory, [Validators.required]],
      ingredients: this.fb.array([this.createIngredientGroup()])
    });
  }

  private createIngredientGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(0.01)]],
      unit: ['pcs', [Validators.required]],
      category: ['Others' as IngredientCategory, [Validators.required]]
    });
  }

  get ingredients(): FormArray {
    return this.dishForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  private loadDish(id: string): void {
    const dishes = this.dishService.getDishes();
    const dish = dishes.find(d => d.id === id);
    if (dish) {
      this.dishForm.patchValue({ name: dish.name, category: dish.category || 'Others' });

      // Clear default ingredient and populate with dish ingredients
      this.ingredients.clear();
      dish.ingredients.forEach(ingredient => {
        const group = this.fb.group({
          name: [ingredient.name, [Validators.required]],
          quantity: [ingredient.quantity, [Validators.required, Validators.min(0.01)]],
          unit: [ingredient.unit, [Validators.required]],
          category: [ingredient.category || 'Others', [Validators.required]]
        });
        this.ingredients.push(group);
      });
    }
  }

  onSubmit(): void {
    if (this.dishForm.invalid) {
      this.dishForm.markAllAsTouched();
      return;
    }

    const formValue = this.dishForm.value;
    const dishData = {
      name: formValue.name.trim(),
      category: formValue.category as DishCategory,
      ingredients: formValue.ingredients.map((ing: { name: string; quantity: number; unit: string; category: string }) => ({
        name: ing.name.trim(),
        quantity: ing.quantity,
        unit: ing.unit,
        category: ing.category as IngredientCategory
      }))
    };

    if (this.isEditMode && this.dishId) {
      this.dishService.updateDish(this.dishId, dishData);
    } else {
      this.dishService.addDish(dishData as Omit<Dish, 'id'>);
    }

    this.router.navigate(['/dishes']);
  }

  cancel(): void {
    this.router.navigate(['/dishes']);
  }

  focusIngredientCategory(index: number): void {
    const el = document.getElementById('ingredientCategory' + index);
    if (el) {
      el.focus();
    }
  }
}
