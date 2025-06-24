# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This is a static HTML pages repository containing personal bookmark collections and a simple homepage. The repository consists of:

- `index.html` - Simple homepage with greeting
- `bookmark.html` - Personal bookmark collection organized by categories (Estonian portals, e-applications, social networks, work, Linux, weather, blog/docs, Java, AI)
- `forex.html` - Investment and trading-related bookmarks (trading portals, forex info, news, crowdfunding, stocks, investment blogs, data sources)
- `README.md` - Basic repository description

## Architecture

The website uses a modern card-based layout system:
- **Responsive Grid**: CSS Grid layout that adapts to screen size
- **CSS Variables**: Theme system supporting light/dark modes
- **Component Structure**: Reusable category cards with consistent styling
- **Accessibility**: ARIA labels, focus management, and keyboard shortcuts

## Assets Structure

```
assets/
├── css/
│   ├── main.css           # Core styles, themes, components
│   └── responsive.css     # Mobile/tablet responsive styles
└── js/
    └── main.js           # Search, themes, collapse, shortcuts
```

## Key Features

- **Live Search**: Real-time bookmark filtering (Ctrl+K)
- **Dark/Light Theme**: Toggle with persistence (Ctrl+D)
- **Category Collapse**: Expandable/collapsible bookmark sections
- **Mobile Responsive**: Works on all device sizes
- **Keyboard Shortcuts**: Ctrl+K (search), Ctrl+D (theme)
- **Recently Used Tracking**: Local storage of frequently accessed links

## Common Tasks

- **Adding Bookmarks**: Add new `<a class="bookmark-link">` elements within category cards
- **New Categories**: Copy category card structure and update icon/title
- **Styling Changes**: Modify CSS variables in `main.css` for consistent theming
- **Search Functionality**: Handled automatically by JavaScript
- **Theme Customization**: Update CSS variables in `:root` and `[data-theme="dark"]`

## File Structure

- `index.html` - Welcome page with navigation and quick links
- `bookmark.html` - General bookmarks (Estonian content)  
- `forex.html` - Trading/investment bookmarks (English content)
- Each page includes the same header navigation and search functionality

## Notes

Personal bookmark management system with modern UX enhancements while maintaining the original content organization. All bookmarks open in new tabs with security attributes.