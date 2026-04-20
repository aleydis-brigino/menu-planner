import { Routes } from '@angular/router';
import { DishListComponent } from './components/dish-list/dish-list.component';
import { DishFormComponent } from './components/dish-form/dish-form.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { ImportExportComponent } from './components/import-export/import-export.component';

export const routes: Routes = [
  { path: 'dishes/add', component: DishFormComponent },
  { path: 'dishes/edit/:id', component: DishFormComponent },
  { path: 'dishes', component: DishListComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'import-export', component: ImportExportComponent },
  { path: '', redirectTo: '/dishes', pathMatch: 'full' },
];
