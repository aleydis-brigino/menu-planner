# Changelog

## [Session 4] - 2026-04-23

### Summary
Complete UI overhaul to Bold & Playful theme, added default dishes feature, and quality-of-life improvements.

### UI/Theme
- Replaced all styling with Bold & Playful theme: vibrant gradients (coral, purple, teal), large rounded cards, pill-shaped buttons, and colorful category badges
- Switched font to DM Sans (Google Fonts) with oversized bold headings
- Added micro-animations throughout: fadeInUp, popIn, wiggle, pulse, shimmer keyframes
- Buttons lift and scale on hover, cards slide on interaction, empty states pulse
- Gradient text headings on all page titles
- Custom scrollbar and selection styling

### Features
- Added "Load Default Dishes" button on Import/Export page with confirmation prompt
- Added pre-built default dishes collection (15 Filipino dishes) at `assets/data/default-dishes.json`
- Added "Delete All" button on Dishes page with confirmation warning
- Empty state on Dishes page now links to Import/Export page for importing or loading defaults
- Success messages on Import/Export page now include a "Go to Dishes →" link
- Success messages no longer auto-dismiss — they stay visible until you navigate away

### Bug Fixes
- Fixed Enter key in ingredient name field accidentally submitting the form — now moves focus to the ingredient's Category dropdown instead

### Data Cleanup
- Standardized ingredient data in default dishes: consistent casing (Soy sauce, Red onion), unified categories (Garlic → Fruits and Vegetables), normalized units (Carrots → pcs)

---

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
