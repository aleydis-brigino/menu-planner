# Changelog

## [Session 3] - 2026-04-21

### Summary
Added categories for dishes and ingredients, standardized unit input, and improved shopping list consolidation.

### Changes
- Added dish categories (Pork, Beef, Chicken, Seafood, Vegetables, Others) with dropdown in add/edit form
- Dish list now groups dishes by category in framed sections
- Added ingredient categories (Fruits and Vegetables, Meats, Seafood, Dairy and Eggs, Condiments and Spices, Preserved Food, Pasta and Grains, Others)
- Shopping list now groups items by ingredient category in framed sections
- Replaced free-text unit input with grouped dropdown (Volume, Weight, Count/Other)
- Shopping list consolidates same-name ingredients: sums when units match, shows per-dish breakdown when units differ
- Copy as Text output reflects the grouped format
- Backward compatible — existing dishes without categories default to "Others"

---

## [Session 2] - 2026-04-20

### Summary
Project setup on GitHub and documentation.

### Changes
- Set up GitHub repo and pushed initial codebase
- Added spec documentation (requirements, design, tasks) to docs/
- Created changelog for session tracking

---

## [Session 1] - 2026-04-19

### Summary
Initial MVP release.

### Changes
- Dish management (add, edit, delete)
- Ingredient tracking with name, quantity, and unit
- Shopping list generation with duplicate consolidation
- Check-off items while shopping
- JSON export/import for backup
- Mobile-friendly layout with print support
- Pushed to GitHub
