# Changelog

All notable changes to QMGrid will be documented in this file.

**Author: Qwabhina McFynn**

## [2.1.0] - 2025-01-04

### 🎨 **Theme System Overhaul**

#### ✅ **CSS Variables for Full Customization**
- **Extracted all colors into CSS variables** for easy theming
- **Background variables**: `--qmgrid-bg-primary`, `--qmgrid-bg-secondary`, `--qmgrid-bg-tertiary`, `--qmgrid-bg-hover`, `--qmgrid-bg-striped`, `--qmgrid-bg-selected`, `--qmgrid-bg-loading`
- **Text variables**: `--qmgrid-text-primary`, `--qmgrid-text-secondary`, `--qmgrid-text-muted`, `--qmgrid-text-light`
- **Border variables**: `--qmgrid-border-primary`, `--qmgrid-border-secondary`, `--qmgrid-border-focus`
- **Accent variables**: `--qmgrid-accent-primary`, `--qmgrid-accent-hover`, `--qmgrid-accent-light`
- **Shadow variables**: `--qmgrid-shadow-light`, `--qmgrid-shadow-medium`, `--qmgrid-shadow-dark`

#### ✅ **Light Theme as Default**
- **Removed automatic dark mode** based on system preferences
- **Light theme is now always the default** regardless of user's system settings
- **Predictable behavior** across all environments

#### ✅ **Programmatic Theme Control**
- **New `theme` config option**: Set initial theme ('light' or 'dark')
- **New `setTheme(theme)` method**: Switch themes programmatically
- **New `getTheme()` method**: Get current theme
- **New `toggleTheme()` method**: Toggle between light and dark themes
- **`.qmgrid-dark` CSS class**: Applied automatically when dark theme is active

#### ✅ **TypeScript Support**
- **Updated type definitions** with theme option in `QMGridConfig`
- **Added method signatures** for `setTheme()`, `getTheme()`, and `toggleTheme()`
- **Proper type safety** for theme values ('light' | 'dark')

#### ✅ **New Documentation**
- **`THEME_GUIDE.md`**: Comprehensive guide for theme customization
- **`theme-demo.html`**: Interactive demo showcasing theme switching
- **CSS variable reference** with all available customization options
- **Custom theme examples** for creating branded themes

### 📝 **Usage Examples**

```javascript
// Set initial theme
const grid = new QMGrid('#table', {
    data: myData,
    columns: myColumns,
    theme: 'dark' // or 'light' (default)
});

// Switch themes programmatically
grid.setTheme('dark');
grid.setTheme('light');

// Toggle between themes
grid.toggleTheme();

// Get current theme
const currentTheme = grid.getTheme(); // 'light' or 'dark'
```

### 🎨 **Custom Theme Example**

```css
/* Create a custom branded theme */
.qmgrid-container.my-brand {
    --qmgrid-accent-primary: #10b981;
    --qmgrid-accent-hover: #059669;
    --qmgrid-bg-selected: #d1fae5;
}
```

### 🔄 **Migration Notes**
- **No breaking changes** - existing code continues to work
- **Dark mode users**: If you relied on automatic dark mode, you now need to explicitly set `theme: 'dark'` or detect system preference manually
- **Custom CSS**: If you had custom dark mode overrides, consider using the new CSS variables instead

---

## [2.0.0] - 2025-01-02

### 🆕 **Major New Feature: Native Server-Side Processing**

#### ✅ **Complete Server-Side Implementation**
- **Native server-side support** with automatic request handling
- **Configurable AJAX settings** with custom headers, timeout, and retry logic
- **Flexible request/response mapping** to work with any server API format
- **Built-in error handling** with automatic retry and graceful degradation
- **Request cancellation** to prevent race conditions and stale data
- **Server-side events** for comprehensive request lifecycle monitoring

#### ✅ **Enhanced Configuration Options**
- **`serverSide: true`** - Enable server-side processing mode
- **`ajax.url`** - Server endpoint URL configuration
- **`ajax.method`** - HTTP method selection (GET, POST, PUT, PATCH)
- **`ajax.headers`** - Custom request headers
- **`ajax.timeout`** - Configurable request timeout (default: 30s)
- **`ajax.retryAttempts`** - Automatic retry logic (default: 3 attempts)
- **`ajax.data`** - Custom request parameter transformation function
- **`serverResponse`** - Flexible response structure mapping

#### ✅ **New Methods and Properties**
- **`refresh()`** - Reload data from server or reapply client-side filters
- **`totalRecords`** - Server-side total record count property
- **`isLoading`** - Current loading state indicator
- **Enhanced `loadServerData()`** - Internal server communication method

#### ✅ **Enhanced Event System**
- **`serverRequestStart`** - Fired when server request begins
- **`serverRequestEnd`** - Fired when server request completes
- **`serverDataLoaded`** - Fired when server data is successfully loaded
- **`serverError`** - Fired when server request fails

#### ✅ **Backward Compatibility Maintained**
- **All existing client-side functionality preserved**
- **No breaking changes** to existing APIs
- **Automatic mode detection** - seamlessly works with both client and server data
- **Graceful fallbacks** for mixed-mode scenarios

#### ✅ **Enhanced Core Methods for Server-Side**
- **`search()`** - Now supports both client-side and server-side search
- **`sort()`** - Automatic server-side sorting with client-side fallback
- **`goToPage()`** - Server-side pagination with proper total record handling
- **`setPageSize()`** - Dynamic page size changes with automatic server reload

#### ✅ **New Demo and Documentation**
- **`server-side-demo.html`** - Comprehensive server-side processing demonstration
- **Mock server implementation** for testing and development
- **Real-time event logging** and status monitoring
- **Enhanced TypeScript definitions** with complete server-side type safety

#### ✅ **Performance and Reliability**
- **Request deduplication** to prevent unnecessary server calls
- **Intelligent request cancellation** for rapid user interactions
- **Memory leak prevention** with proper cleanup of server requests
- **Optimized DOM updates** for server-side data changes

---

## [1.3.0] - 2024-12-31

### 🎉 **Major Rebranding: VanillaDataTable → QMGrid**

#### ✅ **Complete Project Rebranding**
- **New Name**: Project renamed from VanillaDataTable to QMGrid
- **New Author**: Qwabhina McFynn credited as the author throughout all files
- **File Renaming**: All core files renamed with qmgrid prefix
  - `vanilla-datatable.js` → `qmgrid.js`
  - `vanilla-datatable.css` → `qmgrid.css`
  - `vanilla-datatable.d.ts` → `qmgrid.d.ts`

#### ✅ **Code Updates**
- **Class Name**: Main class renamed from `VanillaDataTable` to `QMGrid`
- **CSS Classes**: All CSS classes updated from `vanilla-datatable-*` to `qmgrid-*`
- **Global Export**: Window object now exports `QMGrid` instead of `VanillaDataTable`
- **Module Exports**: All module systems now export `QMGrid`

#### ✅ **Documentation Updates**
- **README.md**: Complete rebranding with QMGrid examples and author credit
- **CHANGELOG.md**: Updated with new branding and author information
- **Package.json**: Updated with new name, author, and file references
- **TypeScript Definitions**: Updated with QMGrid types and comprehensive JSDoc

#### ✅ **Demo Files Updated**
- **index.html**: Updated to use QMGrid class and new file names
- **export-demo.html**: Updated to use QMGrid class and new file names
- **All Examples**: Code examples updated to use new QMGrid syntax

#### ✅ **Comprehensive JSDoc Comments**
- **Complete Documentation**: Added comprehensive JSDoc comments throughout the codebase
- **Method Documentation**: All methods documented with parameters, return types, and examples
- **Type Definitions**: Enhanced TypeScript definitions with detailed JSDoc
- **Usage Examples**: Extensive examples in documentation comments

#### 🔄 **Migration Guide**
```javascript
// Old usage (no longer supported)
const table = new VanillaDataTable('#table', options);

// New usage
const table = new QMGrid('#table', options);
```

#### 📁 **File Structure Changes**
```
Old Files (removed):
- vanilla-datatable.js
- vanilla-datatable.css  
- vanilla-datatable.d.ts

New Files:
- qmgrid.js
- qmgrid.css
- qmgrid.d.ts
```

### 🔄 **Breaking Changes**
- **Class Name**: Must use `QMGrid` instead of `VanillaDataTable`
- **File Names**: Must reference new file names in HTML includes
- **CSS Classes**: Custom CSS targeting old class names needs updating

### 🎨 **Styling Updates**
- **CSS Class Prefix**: All classes now use `qmgrid-` prefix
- **Consistent Naming**: Improved CSS class naming convention
- **Better Organization**: Enhanced CSS structure and organization

---

## [1.2.0] - 2024-12-31

### 🎉 **Major New Feature: Comprehensive Export Functionality**

#### ✅ **Export Formats**
- **CSV Export**: Customizable separators, proper escaping, date formatting
- **Excel Export**: Native .xls format with styling and sheet naming
- **PDF Export**: Print-optimized layout with orientation and page size options
- **Print Functionality**: Browser-native printing with optimized styles

#### ✅ **Export Options**
- **Data Selection**: Export all data, visible rows only, or selected rows only
- **Customizable Filenames**: Dynamic filename generation
- **Header Control**: Include/exclude column headers
- **Date Formatting**: Multiple date format options (YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY)
- **CSV Customization**: Configurable separators (comma, semicolon, tab)
- **PDF Options**: Portrait/landscape orientation, multiple page sizes (A4, A3, Letter)

#### ✅ **User Interface**
- **Export Dropdown**: Built-in export button with dropdown menu
- **Responsive Design**: Mobile-optimized export controls
- **Accessibility**: Keyboard navigation and ARIA support
- **Customizable Labels**: Localization support for export options

#### ✅ **API Enhancements**
- **New Method**: `exportData(format, options)` with method chaining support
- **Export Event**: New 'export' event for tracking export operations
- **Configuration Options**: Comprehensive export configuration in table options
- **TypeScript Support**: Full type definitions for export functionality

#### ✅ **Technical Features**
- **Error Handling**: Graceful handling of export errors and edge cases
- **Memory Management**: Proper cleanup of temporary resources
- **Browser Compatibility**: Works across all modern browsers
- **Performance Optimized**: Efficient handling of large datasets

#### 🐛 **Bug Fixes**
- **Fixed const assignment errors** in PDF and Print export functions
- **Improved variable scoping** in export methods
- **Enhanced error handling** for export operations

### 🎨 **Styling Enhancements**
- Added export dropdown styles with dark mode support
- Responsive export controls for mobile devices
- High contrast mode support for accessibility
- Print-specific CSS optimizations

### 📝 **Documentation Updates**
- Added comprehensive export documentation to README
- Created export-demo.html for testing all export features
- Updated TypeScript definitions with export types
- Enhanced examples with export functionality

### 🔄 **Backward Compatibility**
- **100% backward compatible** - existing code continues to work
- Export functionality is opt-in via `exportable: true` option
- Default behavior unchanged for existing implementations

---

## [1.1.0] - 2024-12-31

### 🎉 Major Improvements & Enhancements

#### ✅ **Enhanced Error Handling**
- Added comprehensive input validation for all methods
- Implemented error boundaries for custom render functions
- Added graceful error recovery and meaningful error messages
- Enhanced parameter validation with type checking

#### ✅ **Performance Optimizations**
- Implemented debounced search (300ms delay, configurable)
- Added proper memory management and event cleanup
- Enhanced DOM update efficiency
- Optimized event delegation for dynamic elements

#### ✅ **Accessibility Improvements**
- Added ARIA labels and roles throughout
- Implemented keyboard navigation support
- Added focus management and indicators
- Enhanced screen reader compatibility
- Added high contrast mode support
- Implemented reduced motion support

#### ✅ **Developer Experience**
- Added comprehensive JSDoc documentation
- Implemented method chaining for fluent API
- Enhanced TypeScript definitions with better types
- Added constants for magic numbers and strings
- Improved code organization and structure

#### ✅ **New Features**
- **Nested Property Support**: Dot notation for accessing nested object properties
- **Method Chaining**: All methods return `this` for fluent API usage
- **Enhanced Event System**: More events and better event handling
- **Loading States**: Built-in loading overlay functionality
- **Smart Pagination**: Improved pagination with ellipsis for large page counts
- **Better Validation**: Input validation throughout the API

#### ✅ **Code Quality**
- Extracted constants for better maintainability
- Added proper event listener cleanup
- Implemented comprehensive error handling
- Enhanced memory management
- Added input validation throughout

### 🔧 **API Enhancements**

#### New Methods:
- `showLoading()` / `hideLoading()` - Loading state management
- `clearSelection()` - Clear all row selections
- `getSelectedRows()` - Get selected row data
- Enhanced `sort()` with column validation
- Enhanced `search()` with debouncing

#### Method Chaining Support:
```javascript
table
    .setData(newData)
    .search('john')
    .sort('name', 'asc')
    .goToPage(2);
```

#### Enhanced Error Handling:
```javascript
// Graceful error handling
table.sort('nonexistent-column'); // Warns and continues
table.removeRow(-1); // Validates and warns about invalid index

// Proper error throwing for critical issues
table.setData('invalid'); // Throws meaningful error
```

### 🎨 **Styling Improvements**
- Added focus styles for better accessibility
- Implemented high contrast mode support
- Added reduced motion support
- Enhanced dark mode compatibility
- Improved responsive design

### 📝 **Documentation**
- Completely rewritten README.md with comprehensive examples
- Added IMPROVEMENTS.md with detailed technical information
- Enhanced TypeScript definitions with JSDoc comments
- Added PROJECT_STRUCTURE.md for project overview
- Updated package.json with new keywords and metadata

### 🧹 **Project Cleanup**
- Removed test files and development artifacts
- Cleaned up project structure
- Organized files for production readiness
- Updated version to 1.1.0

### 🔄 **Backward Compatibility**
- **100% backward compatible** - all existing code continues to work
- Enhanced functionality is additive only
- No breaking changes to existing API
- Default behavior remains unchanged

---

## [1.0.0] - Initial Release

### Features
- Basic data table functionality
- Pagination, sorting, and search
- Row selection capabilities
- Responsive design
- Custom renderers
- Event system
- Zero dependencies

---

## Migration Guide

### From 1.2.0 to 1.3.0

**⚠️ BREAKING CHANGES - Migration Required**

This version includes a complete rebranding from VanillaDataTable to QMGrid.

**Required Changes:**

1. **Update HTML includes:**
```html
<!-- Old -->
<link rel="stylesheet" href="vanilla-datatable.css">
<script src="vanilla-datatable.js"></script>

<!-- New -->
<link rel="stylesheet" href="qmgrid.css">
<script src="qmgrid.js"></script>
```

2. **Update JavaScript class usage:**
```javascript
// Old
const table = new VanillaDataTable('#table', options);

// New  
const table = new QMGrid('#table', options);
```

3. **Update custom CSS (if any):**
```css
/* Old CSS classes */
.vanilla-datatable-container { }
.datatable-header { }

/* New CSS classes */
.qmgrid-container { }
.qmgrid-head { }
```

**All other functionality remains identical** - only the naming has changed.

### From 1.1.0 to 1.3.0

**⚠️ BREAKING CHANGES - See migration guide above for 1.2.0 to 1.3.0**

**New Export Features (from 1.2.0):**
```javascript
// Enable export functionality
const table = new QMGrid('#table', {
    exportable: true,  // Enable export dropdown
    exportOptions: {
        filename: 'my-data',
        dateFormat: 'MM/DD/YYYY'
    }
});
```

### From 1.0.0 to 1.3.0

**⚠️ BREAKING CHANGES - See migration guide above**

All improvements from versions 1.1.0 and 1.2.0 are included, plus the rebranding changes.

### Legacy Migration (Pre-1.3.0)

### From 1.1.0 to 1.2.0

**No migration required!** Version 1.2.0 is fully backward compatible.

**New Export Features:**
```javascript
// Enable export functionality
const table = new QMGrid('#table', {
    exportable: true,  // Enable export dropdown
    exportOptions: {
        filename: 'my-data',
        dateFormat: 'MM/DD/YYYY'
    }
});

// Use export methods
table.exportData('csv');
table.exportData('excel', { selectedOnly: true });
table.exportData('pdf', { pdfOrientation: 'landscape' });
table.exportData('print');

// Listen to export events
table.on('export', (data) => {
    console.log(`Exported ${data.data.length} rows as ${data.format}`);
});
```

### From 1.0.0 to 1.2.0

**No migration required!** Version 1.1.0 is fully backward compatible.

**Optional Enhancements:**
- Take advantage of method chaining for cleaner code
- Use new loading state methods for better UX
- Leverage enhanced error handling for more robust applications
- Utilize improved accessibility features

**Example of new capabilities:**
```javascript
// Old way (still works)
table.setData(newData);
table.search('john');
table.sort('name', 'asc');

// New way (method chaining)
table.setData(newData).search('john').sort('name', 'asc');

// New loading states
table.showLoading();
// ... async operation
table.hideLoading();
```