# Requirements Document

## Introduction

The Menu Planner is a personal application that allows the user to manage a collection of dishes they enjoy, select dishes for meal planning, and automatically generate a consolidated grocery shopping list from the selected dishes' ingredients. The shopping list is designed to be portable — suitable for printing or viewing on a mobile device at the supermarket.

## Glossary

- **Menu_Planner**: The application system that manages dishes, ingredients, and shopping lists
- **Dish**: A named meal or recipe stored in the user's collection, containing a list of ingredients
- **Ingredient**: A specific food item required to prepare a dish, including a name, quantity, and unit of measurement
- **Dish_Collection**: The complete set of dishes the user has added to the application
- **Shopping_List**: A consolidated list of ingredients generated from one or more selected dishes
- **Selection**: The set of dishes the user has chosen for generating a shopping list

## Requirements

### Requirement 1: Manage Dish Collection

**User Story:** As a user, I want to add, edit, and remove dishes from my collection, so that I can maintain an up-to-date list of meals I enjoy.

#### Acceptance Criteria

1. THE Menu_Planner SHALL display all dishes in the Dish_Collection as a browsable list
2. WHEN the user adds a new dish, THE Menu_Planner SHALL store the dish name and its associated ingredients in the Dish_Collection
3. WHEN the user edits an existing dish, THE Menu_Planner SHALL update the dish name and ingredients in the Dish_Collection
4. WHEN the user removes a dish, THE Menu_Planner SHALL delete the dish and its associated ingredients from the Dish_Collection
5. THE Menu_Planner SHALL require each dish to have a non-empty name and at least one ingredient

### Requirement 2: Manage Ingredients for a Dish

**User Story:** As a user, I want to define ingredients for each dish with name, quantity, and unit, so that my shopping list contains useful information for purchasing.

#### Acceptance Criteria

1. WHEN the user adds an ingredient to a dish, THE Menu_Planner SHALL store the ingredient name, quantity, and unit of measurement
2. THE Menu_Planner SHALL require each ingredient to have a non-empty name and a quantity greater than zero
3. WHEN the user edits an ingredient, THE Menu_Planner SHALL update the ingredient name, quantity, or unit in the associated dish
4. WHEN the user removes an ingredient from a dish, THE Menu_Planner SHALL delete that ingredient from the dish

### Requirement 3: Select Dishes for Shopping List

**User Story:** As a user, I want to select one or more dishes from my collection, so that I can generate a shopping list for those specific meals.

#### Acceptance Criteria

1. THE Menu_Planner SHALL allow the user to select one or more dishes from the Dish_Collection
2. WHEN the user selects a dish, THE Menu_Planner SHALL display the ingredients of the selected dish
3. WHEN the user deselects a dish, THE Menu_Planner SHALL remove that dish's ingredients from the displayed selection
4. THE Menu_Planner SHALL visually indicate which dishes are currently selected

### Requirement 4: Generate Consolidated Shopping List

**User Story:** As a user, I want a consolidated shopping list from my selected dishes, so that I have a single list of everything I need to buy.

#### Acceptance Criteria

1. WHEN the user requests a shopping list, THE Menu_Planner SHALL generate a Shopping_List containing all ingredients from the selected dishes
2. WHEN multiple selected dishes contain the same ingredient, THE Menu_Planner SHALL combine those ingredients into a single entry with summed quantities
3. THE Menu_Planner SHALL group Shopping_List items alphabetically by ingredient name
4. IF no dishes are selected, THEN THE Menu_Planner SHALL display a message indicating that at least one dish must be selected

### Requirement 5: Portable Shopping List for Supermarket Use

**User Story:** As a user, I want to bring my shopping list to the supermarket on my phone or as a printout, so that I can reference it while shopping.

#### Acceptance Criteria

1. THE Menu_Planner SHALL display the Shopping_List in a clean, readable format optimized for mobile screens
2. THE Menu_Planner SHALL provide a print-friendly view of the Shopping_List that removes navigation elements and uses a single-column layout
3. THE Menu_Planner SHALL allow the user to check off items on the Shopping_List while shopping
4. WHILE the user is viewing the Shopping_List, THE Menu_Planner SHALL keep checked-off items visible but visually distinguished from unchecked items

### Requirement 6: Persist Data Across Sessions

**User Story:** As a user, I want my dishes and ingredients to be saved between sessions, so that I do not lose my collection when I close the application.

#### Acceptance Criteria

1. WHEN the user adds, edits, or removes a dish, THE Menu_Planner SHALL persist the change to a JSON file on disk
2. WHEN the application is opened, THE Menu_Planner SHALL load the Dish_Collection from the JSON file
3. IF the JSON file is missing or contains invalid JSON, THEN THE Menu_Planner SHALL start with an empty Dish_Collection and display a warning message
