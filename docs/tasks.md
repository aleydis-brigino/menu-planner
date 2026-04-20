# Implementation Plan: Menu Planner

## Overview

Build a client-side Angular application for managing a personal dish collection and generating consolidated shopping lists. The app uses localStorage for persistence, JSON export/import for portability, and is optimized for mobile/print use at the supermarket. Implementation uses Angular with TypeScript, Angular Reactive Forms, and fast-check for property-based testing.

## Tasks

- [x] 1. Scaffold Angular project and define core data models
  - [x] 1.1 Create a new Angular project (standalone components, routing enabled) and install fast-check as a dev dependency
    - Initialize with `ng new menu-planner --standalone --routing`
    - Install fast-check: `npm install --save-dev fast-check`
    - _Requirements: N/A (project setup)_
  - [x] 1.2 Create data model interfaces in `src/app/models/dish.model.ts` and `src/app/models/shopping-list.model.ts`
    - Define `Ingredient`, `Dish`, `DishCollection` interfaces in `dish.model.ts`
    - Define `ShoppingListItem` interface in `shopping-list.model.ts`
    - Define `ValidationResult` interface (can be in a shared `validation.model.ts` or alongside dish model)
    - _Requirements: 1.2, 2.1_

- [x] 2. Implement ValidationService
  - [x] 2.1 Create `src/app/services/validation.service.ts` with `validateDish()` and `validateIngredient()` methods
    - `validateDish` rejects dishes with empty/whitespace-only names or zero ingredients
    - `validateDish` accepts dishes with a non-empty name and at least one valid ingredient
    - `validateIngredient` rejects ingredients with empty/whitespace-only names or quantity <= 0
    - `validateIngredient` accepts ingredients with a non-empty name and quantity > 0
    - _Requirements: 1.5, 2.2_
  - [ ]* 2.2 Write property test: Validation rejects invalid dishes and ingredients
    - **Property 5: Validation rejects invalid dishes and ingredients**
    - **Validates: Requirements 1.5, 2.2**

- [x] 3. Implement StorageService
  - [x] 3.1 Create `src/app/services/storage.service.ts` with `loadCollection()`, `saveCollection()`, `exportToJson()`, and `importFromJson()` methods
    - `loadCollection` reads from localStorage key `menu-planner-dishes`, returns empty collection on missing/invalid data
    - `saveCollection` serializes and writes to localStorage
    - `exportToJson` triggers a JSON file download via a dynamically created anchor element
    - `importFromJson` reads an uploaded File, parses JSON, and validates structure
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ]* 3.2 Write property test: Persistence round-trip
    - **Property 8: Persistence round-trip**
    - **Validates: Requirements 6.1, 6.2**
  - [ ]* 3.3 Write property test: Invalid storage yields empty collection
    - **Property 9: Invalid storage yields empty collection**
    - **Validates: Requirements 6.3**

- [x] 4. Implement DishService
  - [x] 4.1 Create `src/app/services/dish.service.ts` with `dishes$` BehaviorSubject, `addDish()`, `updateDish()`, `removeDish()`, and `getDishes()` methods
    - Inject StorageService for persistence on every mutation
    - Inject ValidationService to validate before add/update
    - Generate UUID for new dishes (use `crypto.randomUUID()`)
    - Load initial state from StorageService on construction
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 4.2 Write property test: Dish add/retrieve round-trip
    - **Property 1: Dish add/retrieve round-trip**
    - **Validates: Requirements 1.2, 2.1**
  - [ ]* 4.3 Write property test: Dish and ingredient edit preserves changes
    - **Property 2: Dish and ingredient edit preserves changes**
    - **Validates: Requirements 1.3, 2.3**
  - [ ]* 4.4 Write property test: Dish removal reduces collection
    - **Property 3: Dish removal reduces collection**
    - **Validates: Requirements 1.4**
  - [ ]* 4.5 Write property test: Ingredient removal reduces dish ingredients
    - **Property 4: Ingredient removal reduces dish ingredients**
    - **Validates: Requirements 2.4**

- [x] 5. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement ShoppingListService
  - [x] 6.1 Create `src/app/services/shopping-list.service.ts` with `selectedDishIds$`, `toggleDishSelection()`, `clearSelection()`, and `generateShoppingList()` methods
    - Normalize ingredient names (trim, lowercase) for grouping; display uses original casing from first occurrence
    - Sum quantities for same name + same unit; keep separate entries for same name + different unit
    - Sort result alphabetically (case-insensitive) by ingredient name
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4_
  - [ ]* 6.2 Write property test: Shopping list consolidation correctness
    - **Property 6: Shopping list consolidation correctness**
    - **Validates: Requirements 4.1, 4.2**
  - [ ]* 6.3 Write property test: Shopping list alphabetical ordering
    - **Property 7: Shopping list alphabetical ordering**
    - **Validates: Requirements 4.3**

- [x] 7. Implement DishListComponent
  - [x] 7.1 Create `src/app/components/dish-list/` component displaying all dishes in a scrollable list
    - Show dish names with checkbox/toggle for selection
    - Include edit and delete action buttons per dish
    - Visually indicate selected dishes (e.g., highlighted background or checkmark)
    - Subscribe to `DishService.dishes$` and `ShoppingListService.selectedDishIds$`
    - _Requirements: 1.1, 3.1, 3.4_
  - [ ]* 7.2 Write unit tests for DishListComponent
    - Test that all dishes render in the list
    - Test selection toggle updates visual state
    - Test edit button navigates to edit form
    - Test delete button removes dish from collection
    - _Requirements: 1.1, 1.4, 3.1, 3.4_

- [x] 8. Implement DishFormComponent
  - [x] 8.1 Create `src/app/components/dish-form/` component with a reactive form for adding and editing dishes
    - Reactive form with dish name control and dynamic FormArray for ingredients (name, quantity, unit)
    - Add/remove ingredient buttons
    - Inline validation error messages for dish name and each ingredient field
    - On submit, call DishService.addDish() or DishService.updateDish() depending on mode
    - _Requirements: 1.2, 1.3, 1.5, 2.1, 2.2, 2.3, 2.4_
  - [ ]* 8.2 Write unit tests for DishFormComponent
    - Test form validation prevents submission of invalid data
    - Test adding/removing ingredient rows
    - Test form populates correctly in edit mode
    - _Requirements: 1.5, 2.2, 2.3, 2.4_

- [x] 9. Implement ShoppingListComponent
  - [x] 9.1 Create `src/app/components/shopping-list/` component displaying the consolidated shopping list
    - Display items alphabetically sorted with name, quantity, and unit
    - Checkbox per item for checking off while shopping
    - Checked-off items remain visible but visually distinguished (e.g., strikethrough, muted color)
    - Show "Select at least one dish" message when no dishes are selected
    - Include a print button that triggers `window.print()`
    - _Requirements: 4.1, 4.3, 4.4, 5.1, 5.3, 5.4_
  - [ ]* 9.2 Write unit tests for ShoppingListComponent
    - Test items render in alphabetical order
    - Test check-off toggle updates visual state
    - Test empty selection shows appropriate message
    - _Requirements: 4.3, 4.4, 5.3, 5.4_

- [x] 10. Implement ImportExportComponent
  - [x] 10.1 Create `src/app/components/import-export/` component with export and import controls
    - Export button calls StorageService.exportToJson() to download `dishes.json`
    - Import button with file picker calls StorageService.importFromJson() and reloads the collection
    - Display error message if imported file is invalid JSON or has wrong structure
    - _Requirements: 6.1, 6.2, 6.3_
  - [ ]* 10.2 Write unit tests for ImportExportComponent
    - Test export triggers file download
    - Test import with valid file loads collection
    - Test import with invalid file shows error
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 11. Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Wire routing, layout, and print styles
  - [x] 12.1 Configure routes in `src/app/app.routes.ts` and set up the root `AppComponent` layout
    - Define routes: dish list (home), dish form (add/edit), shopping list
    - AppComponent provides navigation links and a `<router-outlet>`
    - _Requirements: 1.1, 3.1_
  - [x] 12.2 Create an alphabetical sort pipe in `src/app/pipes/sort-alphabetical.pipe.ts`
    - Pipe sorts an array of ShoppingListItems alphabetically by name (case-insensitive)
    - _Requirements: 4.3_
  - [x] 12.3 Add responsive CSS and print stylesheet
    - Mobile-first layout: clean, readable format for small screens
    - Print stylesheet (`@media print`) hides navigation, uses single-column layout
    - _Requirements: 5.1, 5.2_

- [x] 13. Integration and final wiring
  - [x] 13.1 Wire all components together and verify end-to-end flows
    - Ensure dish add → appears in list → select → shopping list shows ingredients
    - Ensure edit/delete flows work through the UI
    - Ensure export/import round-trip works
    - Ensure localStorage persistence works across page reloads
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 4.1, 6.1, 6.2_
  - [ ]* 13.2 Write integration tests for key user flows
    - Test add dish → select → generate shopping list flow
    - Test edit dish → shopping list updates
    - Test export → import round-trip
    - _Requirements: 1.2, 4.1, 6.1, 6.2_

- [x] 14. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The app runs entirely in the browser with no backend — localStorage is the persistence layer
