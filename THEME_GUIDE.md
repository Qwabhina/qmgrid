# QMGrid Theme Guide

QMGrid now supports customizable themes with CSS variables, making it easy to create light and dark themes or completely custom color schemes.

## Default Behavior

- **Light theme is the default** - The table will always use light theme regardless of system preferences
- **No automatic dark mode** - Dark theme must be explicitly enabled via JavaScript configuration

## Theme Configuration

### Setting Initial Theme

```javascript
// Light theme (default)
const grid = new QMGrid('#table', {
    data: myData,
    columns: myColumns,
    theme: 'light' // Optional, this is the default
});

// Dark theme
const grid = new QMGrid('#table', {
    data: myData,
    columns: myColumns,
    theme: 'dark'
});
```

### Programmatic Theme Control

```javascript
// Switch to dark theme
grid.setTheme('dark');

// Switch to light theme
grid.setTheme('light');

// Toggle between themes
grid.toggleTheme();

// Get current theme
const currentTheme = grid.getTheme(); // Returns 'light' or 'dark'
```

## CSS Variables

All colors are now defined as CSS variables, making customization easy:

### Light Theme Variables (Default)
```css
:root {
    --qmgrid-bg-primary: #fff;
    --qmgrid-bg-secondary: #f8f9fa;
    --qmgrid-bg-tertiary: #e9ecef;
    --qmgrid-bg-hover: #e9ecef;
    --qmgrid-bg-striped: #f8f9fa;
    --qmgrid-bg-selected: #e3f2fd;
    --qmgrid-bg-loading: rgba(255, 255, 255, 0.8);
    
    --qmgrid-text-primary: #333;
    --qmgrid-text-secondary: #495057;
    --qmgrid-text-muted: #6c757d;
    --qmgrid-text-light: #e2e8f0;
    
    --qmgrid-border-primary: #dee2e6;
    --qmgrid-border-secondary: #ced4da;
    --qmgrid-border-focus: #007bff;
    
    --qmgrid-accent-primary: #007bff;
    --qmgrid-accent-hover: #0056b3;
    --qmgrid-accent-light: rgba(0, 123, 255, 0.25);
    
    --qmgrid-shadow-light: rgba(0, 0, 0, 0.1);
    --qmgrid-shadow-medium: rgba(0, 0, 0, 0.15);
    --qmgrid-shadow-dark: rgba(0, 0, 0, 0.3);
}
```

### Dark Theme Variables
```css
.qmgrid-dark {
    --qmgrid-bg-primary: #2d3748;
    --qmgrid-bg-secondary: #4a5568;
    --qmgrid-bg-tertiary: #718096;
    --qmgrid-bg-hover: #718096;
    --qmgrid-bg-striped: #4a5568;
    --qmgrid-bg-selected: #2c5282;
    --qmgrid-bg-loading: rgba(45, 55, 72, 0.8);
    
    --qmgrid-text-primary: #e2e8f0;
    --qmgrid-text-secondary: #e2e8f0;
    --qmgrid-text-muted: #a0aec0;
    --qmgrid-text-light: #e2e8f0;
    
    --qmgrid-border-primary: #718096;
    --qmgrid-border-secondary: #718096;
    --qmgrid-border-focus: #63b3ed;
    
    --qmgrid-accent-primary: #63b3ed;
    --qmgrid-accent-hover: #3182ce;
    --qmgrid-accent-light: rgba(99, 179, 237, 0.25);
    
    --qmgrid-shadow-light: rgba(0, 0, 0, 0.2);
    --qmgrid-shadow-medium: rgba(0, 0, 0, 0.25);
    --qmgrid-shadow-dark: rgba(0, 0, 0, 0.4);
}
```

## Custom Themes

You can create completely custom themes by overriding the CSS variables:

```css
/* Custom blue theme */
.qmgrid-container.custom-blue {
    --qmgrid-bg-primary: #f0f8ff;
    --qmgrid-bg-secondary: #e6f3ff;
    --qmgrid-accent-primary: #0066cc;
    --qmgrid-accent-hover: #0052a3;
    /* Override other variables as needed */
}
```

Then apply the custom class:
```javascript
const container = document.querySelector('.qmgrid-container');
container.classList.add('custom-blue');
```

## Migration from Previous Versions

If you were relying on automatic dark mode based on system preferences:

**Before:**
```css
@media (prefers-color-scheme: dark) {
    /* Automatic dark mode */
}
```

**After:**
```javascript
// Explicitly control theme
const grid = new QMGrid('#table', {
    theme: 'dark' // or 'light'
});

// Or detect system preference and set accordingly
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const grid = new QMGrid('#table', {
    theme: prefersDark ? 'dark' : 'light'
});
```

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="qmgrid.css">
</head>
<body>
    <div id="my-table"></div>
    <button onclick="toggleTheme()">Toggle Theme</button>
    
    <script src="qmgrid.js"></script>
    <script>
        const grid = new QMGrid('#my-table', {
            data: myData,
            columns: myColumns,
            theme: 'light' // Start with light theme
        });
        
        function toggleTheme() {
            grid.toggleTheme();
        }
    </script>
</body>
</html>
```

## Benefits

1. **Predictable behavior** - Always starts with light theme
2. **Full control** - Theme switching via JavaScript API
3. **Customizable** - Easy to create custom themes with CSS variables
4. **Accessible** - Maintains proper contrast ratios in both themes
5. **Performance** - No media query overhead for automatic detection