# QMGrid - Export Features Documentation

**Author: Qwabhina McFynn**

## 🎉 **Comprehensive Export Functionality**

QMGrid now includes powerful export capabilities that allow users to export table data in multiple formats with extensive customization options.

## 📤 **Supported Export Formats**

### 1. **CSV Export**
- **Format**: Comma-separated values
- **Features**: 
  - Customizable separators (comma, semicolon, tab)
  - Proper CSV escaping for special characters
  - Date formatting options
  - Header inclusion control

### 2. **Excel Export**
- **Format**: Microsoft Excel (.xls)
- **Features**:
  - Native Excel format with styling
  - Custom sheet naming
  - Proper data type handling
  - Formatted headers with styling

### 3. **PDF Export**
- **Format**: Portable Document Format
- **Features**:
  - Print-optimized layout
  - Portrait/landscape orientation
  - Multiple page sizes (A4, A3, Letter)
  - Professional styling with headers

### 4. **Print Functionality**
- **Format**: Browser-native printing
- **Features**:
  - Optimized print layout
  - Clean, professional appearance
  - Automatic page breaks
  - Print preview support

## ⚙️ **Configuration Options**

### Basic Configuration
```javascript
const table = new QMGrid('#table', {
    exportable: true,  // Enable export functionality
    exportOptions: {
        filename: 'my-export',        // Default filename
        includeHeaders: true,         // Include column headers
        selectedOnly: false,          // Export only selected rows
        visibleOnly: false,           // Export only visible rows
        dateFormat: 'YYYY-MM-DD',     // Date format
        csvSeparator: ',',            // CSV separator
        pdfOrientation: 'portrait',   // PDF orientation
        pdfPageSize: 'A4',           // PDF page size
        excelSheetName: 'Data'       // Excel sheet name
    }
});
```

### Export Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `filename` | String | `'qmgrid-export'` | Base filename for exports |
| `includeHeaders` | Boolean | `true` | Include column headers in export |
| `selectedOnly` | Boolean | `false` | Export only selected rows |
| `visibleOnly` | Boolean | `false` | Export only currently visible rows |
| `dateFormat` | String | `'YYYY-MM-DD'` | Date format (`'YYYY-MM-DD'`, `'MM/DD/YYYY'`, `'DD/MM/YYYY'`) |
| `csvSeparator` | String | `','` | CSV field separator |
| `pdfOrientation` | String | `'portrait'` | PDF orientation (`'portrait'`, `'landscape'`) |
| `pdfPageSize` | String | `'A4'` | PDF page size (`'A4'`, `'A3'`, `'letter'`) |
| `excelSheetName` | String | `'Data'` | Excel worksheet name |

## 🔧 **API Methods**

### Basic Export
```javascript
// Export all data
table.exportData('csv');
table.exportData('excel');
table.exportData('pdf');
table.exportData('print');
```

### Export with Custom Options
```javascript
// Export selected rows only
table.exportData('csv', {
    filename: 'selected-employees',
    selectedOnly: true,
    dateFormat: 'MM/DD/YYYY'
});

// Export current page as Excel
table.exportData('excel', {
    filename: 'current-page',
    visibleOnly: true,
    excelSheetName: 'Current Page'
});

// Export as landscape PDF
table.exportData('pdf', {
    filename: 'report',
    pdfOrientation: 'landscape',
    pdfPageSize: 'A3'
});
```

### Method Chaining
```javascript
// Export supports method chaining
table
    .search('active')
    .exportData('csv', { filename: 'active-users' })
    .search(''); // Clear search
```

## 🎨 **User Interface**

### Built-in Export Dropdown
When `exportable: true`, the table automatically includes:
- Export button with dropdown menu
- Four export options (CSV, Excel, PDF, Print)
- Responsive design for mobile devices
- Keyboard navigation support
- Customizable labels via language options

### Customizing Export Labels
```javascript
const table = new QMGrid('#table', {
    exportable: true,
    language: {
        export: {
            csv: 'Download CSV',
            excel: 'Download Excel',
            pdf: 'Download PDF',
            print: 'Print Data'
        }
    }
});
```

## 📡 **Events**

### Export Event
```javascript
table.on('export', (data) => {
    console.log('Export Details:');
    console.log('- Format:', data.format);
    console.log('- Rows exported:', data.data.length);
    console.log('- Filename:', data.options.filename);
    console.log('- Options:', data.options);
});
```

### Event Data Structure
```javascript
{
    format: 'csv',           // Export format
    data: [...],             // Exported data array
    options: {               // Export options used
        filename: 'export',
        includeHeaders: true,
        selectedOnly: false,
        // ... other options
    }
}
```

## 🔍 **Data Selection Options**

### Export All Data
```javascript
table.exportData('csv'); // Exports all filtered data
```

### Export Selected Rows Only
```javascript
// First select some rows, then export
table.selectRow(0, true);
table.selectRow(2, true);
table.exportData('excel', { selectedOnly: true });
```

### Export Visible Rows Only
```javascript
// Export only the current page
table.exportData('pdf', { visibleOnly: true });
```

## 🎯 **Advanced Features**

### Custom Date Formatting
```javascript
table.exportData('csv', {
    dateFormat: 'MM/DD/YYYY'  // US format
});

table.exportData('excel', {
    dateFormat: 'DD/MM/YYYY'  // European format
});
```

### CSV Customization
```javascript
table.exportData('csv', {
    csvSeparator: ';',        // Use semicolon separator
    filename: 'data-eu'       // European CSV format
});
```

### PDF Customization
```javascript
table.exportData('pdf', {
    pdfOrientation: 'landscape',
    pdfPageSize: 'A3',
    filename: 'large-report'
});
```

## 🌐 **Browser Compatibility**

Export functionality works in all modern browsers:
- **Chrome 60+**: Full support for all formats
- **Firefox 55+**: Full support for all formats  
- **Safari 12+**: Full support for all formats
- **Edge 79+**: Full support for all formats

### Technical Implementation
- **CSV**: Uses Blob API for file generation
- **Excel**: HTML table method with Excel-specific markup
- **PDF**: Print-optimized HTML with window.print()
- **Print**: Native browser printing with optimized CSS

## 🔒 **Security Considerations**

- All export data is processed client-side
- No data is sent to external servers
- File downloads use secure Blob URLs
- Proper HTML escaping prevents XSS in exports

## 📱 **Mobile Support**

- Responsive export dropdown for mobile devices
- Touch-friendly export buttons
- Mobile-optimized print layouts
- Proper file download handling on mobile browsers

## 🎨 **Styling & Theming**

### CSS Classes
- `.export-dropdown` - Export dropdown container
- `.export-btn` - Export button
- `.export-menu` - Dropdown menu
- `.export-option` - Individual export options

### Dark Mode Support
Export UI automatically adapts to dark mode preferences via CSS media queries.

### High Contrast Mode
Enhanced contrast for accessibility compliance.

## 🚀 **Performance**

- **Efficient Processing**: Optimized for large datasets
- **Memory Management**: Proper cleanup of temporary resources
- **Lazy Loading**: Export processing only when needed
- **Browser Optimization**: Uses native browser APIs for best performance

## 📋 **Examples**

### Complete Export Demo
See `export-demo.html` for a comprehensive demonstration of all export features with:
- Interactive export options
- Real-time configuration
- Event logging
- Multiple data selection modes

### Basic Integration
```javascript
// Minimal setup with export
const table = new QMGrid('#table', {
    data: myData,
    columns: myColumns,
    exportable: true
});

// Users can now click the export button to download data
```

### Advanced Integration
```javascript
// Full-featured export setup
const table = new QMGrid('#table', {
    data: myData,
    columns: myColumns,
    exportable: true,
    exportOptions: {
        filename: 'company-data',
        dateFormat: 'MM/DD/YYYY',
        pdfOrientation: 'landscape'
    }
});

// Listen for export events
table.on('export', (data) => {
    // Track export usage
    analytics.track('table_export', {
        format: data.format,
        rows: data.data.length
    });
});
```

---

**The export functionality makes QMGrid a complete solution for data presentation and sharing, enabling users to easily extract and share table data in their preferred format.**