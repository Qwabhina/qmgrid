# QMGrid

A lightweight, feature-rich, and highly customizable data table library built with vanilla JavaScript. **Zero dependencies required!**

**Author: Qwabhina McFynn**

## ✨ Recent Improvements

This library has been significantly enhanced with:
- ✅ **Enhanced Error Handling** - Robust validation and graceful error recovery
- ✅ **Better Performance** - Debounced search and memory management  
- ✅ **Improved Accessibility** - ARIA support and keyboard navigation
- ✅ **Developer Experience** - JSDoc documentation and method chaining
- ✅ **Code Quality** - Constants, validation, and proper cleanup
- ✅ **Type Safety** - Enhanced TypeScript definitions
- 🆕 **Server-Side Processing** - Native support for server-side pagination, search, and sorting

*See [IMPROVEMENTS.md](IMPROVEMENTS.md) for detailed information about all enhancements.*

## 🚀 Features

- **Zero Dependencies** - Pure vanilla JavaScript
- **Responsive Design** - Works on all screen sizes
- **Search & Filter** - Built-in search functionality with debouncing
- **Sorting** - Click column headers to sort (with validation)
- **Pagination** - Smart pagination with configurable page sizes
- **Server-Side Processing** - Native support for server-side operations
- **Row Selection** - Single or multiple row selection
- **Customizable** - Extensive styling options and custom renderers
- **Dark Mode** - Automatic dark theme support
- **Performance** - Optimized for large datasets
- **Extensible** - Comprehensive event system
- **Mobile Friendly** - Touch-optimized interface
- **Accessible** - ARIA labels and keyboard navigation
- **Method Chaining** - Fluent API for better developer experience
- **Export Functionality** - CSV, Excel, PDF export and printing capabilities

## 📦 Quick Start

### 1. Include the files

```html
<link rel="stylesheet" href="qmgrid.css">
<script src="qmgrid.js"></script>
```

### 2. Create a container

```html
<div id="my-table"></div>
```

### 3. Initialize the table

```javascript
// Client-side table
const table = new QMGrid('#my-table', {
    data: [
        { id: 1, name: 'John Doe', email: 'john@example.com', age: 28 },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32 },
        // ... more data
    ],
    columns: [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
        { key: 'age', title: 'Age' }
    ]
});

// Server-side table
const serverTable = new QMGrid('#server-table', {
    columns: [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
        { key: 'age', title: 'Age' }
    ],
    serverSide: true,
    ajax: {
        url: '/api/data',
        method: 'POST'
    }
});
```

## 🔧 Configuration Options

### Basic Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `data` | Array | `[]` | Array of data objects |
| `columns` | Array | `[]` | Column configuration |
| `pagination` | Boolean | `true` | Enable pagination |
| `pageSize` | Number | `10` | Rows per page |
| `sortable` | Boolean | `true` | Enable sorting |
| `searchable` | Boolean | `true` | Enable search |
| `selectable` | Boolean | `false` | Enable row selection |
| `multiSelect` | Boolean | `false` | Allow multiple row selection |
| `exportable` | Boolean | `true` | Enable export functionality |
| `serverSide` | Boolean | `false` | Enable server-side processing |

### Server-Side Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ajax.url` | String | `null` | Server endpoint URL |
| `ajax.method` | String | `'GET'` | HTTP method ('GET', 'POST', 'PUT') |
| `ajax.headers` | Object | `{}` | Request headers |
| `ajax.timeout` | Number | `30000` | Request timeout in milliseconds |
| `ajax.data` | Function | `null` | Transform request parameters |
| `serverResponse.data` | String | `'data'` | Path to data array in response |
| `serverResponse.totalRecords` | String | `'total'` | Path to total count in response |
| `serverResponse.error` | String | `'error'` | Path to error message in response |

### Styling Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `striped` | Boolean | `true` | Alternating row colors |
| `bordered` | Boolean | `true` | Table borders |
| `hover` | Boolean | `true` | Row hover effects |
| `responsive` | Boolean | `true` | Responsive design |

### Column Configuration

```javascript
columns: [
    {
        key: 'name',           // Data property key (supports dot notation)
        title: 'Full Name',    // Column header text
        width: '200px',        // Column width
        sortable: true,        // Enable sorting (default: true)
        type: 'text',          // Data type: 'text', 'date', 'currency'
        className: 'text-bold', // CSS class for cells
        render: (value, row, index) => {
            // Custom cell renderer with error handling
            return `<strong>${value}</strong>`;
        }
    }
]
```

## 🔗 API Methods (with Method Chaining)

### Data Management

```javascript
// Method chaining support
table
    .setData(newData)
    .search('john')
    .sort('name', 'asc')
    .goToPage(2);

// Individual methods
table.setData(data);           // Set new data
table.addRow(row);             // Add new row
table.removeRow(index);        // Remove row by index
table.updateRow(index, data);  // Update row properties
```

### Search & Sort

```javascript
table.search(term);            // Filter data by search term (debounced)
table.sort(column, direction); // Sort by column ('asc' or 'desc')
```

### Pagination

```javascript
table.goToPage(page);          // Navigate to specific page
table.setPageSize(size);       // Change rows per page
```

### Selection

```javascript
table.selectRow(index, selected);  // Select/deselect row
table.selectAll(selected);         // Select/deselect all rows
table.getSelectedRows();           // Get array of selected row objects
table.clearSelection();            // Clear all selections
```

### UI State

```javascript
table.showLoading();           // Show loading overlay
table.hideLoading();           // Hide loading overlay
table.refresh();               // Refresh data (server-side or client-side)
table.destroy();               // Clean up and remove table
```

### Export & Print

```javascript
// Export data in various formats
table.exportData('csv');       // Export as CSV
table.exportData('excel');     // Export as Excel
table.exportData('pdf');       // Export as PDF
table.exportData('print');     // Print table

// Export with custom options
table.exportData('csv', {
    filename: 'my-data',
    selectedOnly: true,        // Export only selected rows
    visibleOnly: false,        // Export only visible rows
    includeHeaders: true,      // Include column headers
    dateFormat: 'MM/DD/YYYY',  // Date format
    csvSeparator: ','          // CSV separator
});

// PDF export options
table.exportData('pdf', {
    filename: 'report',
    pdfOrientation: 'landscape', // 'portrait' or 'landscape'
    pdfPageSize: 'A4'           // 'A4', 'A3', 'letter', etc.
});
```

## 📡 Event System

```javascript
// Listen to events
table.on('search', (data) => {
    console.log('Search term:', data.term);
});

table.on('sort', (data) => {
    console.log('Sorted by:', data.column, data.direction);
});

table.on('rowSelect', (data) => {
    console.log('Row selected:', data.index, data.selected);
});

table.on('dataChange', (data) => {
    console.log('Data updated:', data.data.length, 'rows');
});

table.on('export', (data) => {
    console.log('Exported:', data.format, 'with', data.data.length, 'rows');
});

// Remove event listener
table.off('search', callback);
```

## 🎨 Custom Renderers

```javascript
columns: [
    {
        key: 'status',
        title: 'Status',
        render: (value, row, index) => {
            const colors = { active: 'green', inactive: 'red' };
            return `<span style="color: ${colors[value]}">${value}</span>`;
        }
    },
    {
        key: 'user.profile.name', // Supports nested properties
        title: 'User Name'
    }
]
```

## 🌙 Dark Mode & Accessibility

The library automatically supports:
- **Dark mode** via CSS media queries
- **High contrast mode** for accessibility
- **Reduced motion** for users who prefer it
- **Keyboard navigation** with proper focus management
- **Screen reader support** with ARIA labels
- **Focus indicators** for better usability

## 🖥️ Server-Side Processing

QMGrid v2.0+ includes native server-side processing support for handling large datasets efficiently.

### Basic Server-Side Setup

```javascript
const table = new QMGrid('#server-table', {
    columns: [
        { key: 'id', title: 'ID' },
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' }
    ],
    serverSide: true,
    ajax: {
        url: '/api/data',
        method: 'POST'
    }
});
```

### Advanced Server-Side Configuration

```javascript
const table = new QMGrid('#advanced-server-table', {
    columns: columns,
    serverSide: true,
    ajax: {
        url: '/api/employees',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        timeout: 15000,
        retryAttempts: 3,
        retryDelay: 1000,
        data: function(params) {
            // Transform request parameters
            return {
                page: params.page,
                size: params.pageSize,
                search: params.search,
                sort: params.sortBy,
                direction: params.sortDir,
                filters: getActiveFilters()
            };
        },
        beforeSend: function(data, params) {
            console.log('Sending request:', data);
            return true; // Return false to cancel request
        },
        complete: function() {
            console.log('Request completed');
        },
        error: function(error, page, search) {
            console.error('Request failed:', error);
            showErrorNotification(error.message);
        }
    },
    serverResponse: {
        data: 'items',           // Path to data array
        totalRecords: 'totalCount', // Path to total records
        error: 'errorMessage',   // Path to error message
        draw: 'requestId'        // Path to request identifier
    }
});
```

### Server Request Format

QMGrid sends the following parameters to your server:

```javascript
{
    page: 1,              // Current page number
    pageSize: 10,         // Number of items per page
    search: "john",       // Search term
    sortBy: "name",       // Column to sort by
    sortDir: "asc",       // Sort direction
    draw: 123             // Request identifier
}
```

### Expected Server Response Format

Your server should return data in this format:

```javascript
{
    data: [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com"
        }
        // ... more records
    ],
    total: 1250,          // Total number of records
    draw: 123,            // Echo the request identifier
    error: null           // Error message if any
}
```

### Server-Side Events

```javascript
// Listen to server-side specific events
table.on('serverRequestStart', (data) => {
    console.log('Loading data from server...');
});

table.on('serverDataLoaded', (data) => {
    console.log(`Loaded ${data.data.length} of ${data.total} records`);
});

table.on('serverError', (data) => {
    console.error('Server error:', data.error);
    showErrorMessage(data.error);
});
```

### Server-Side Best Practices

1. **Implement proper error handling** on your server
2. **Use request identifiers** (draw parameter) to handle concurrent requests
3. **Implement request timeout** and retry logic
4. **Validate and sanitize** search and sort parameters
5. **Use database indexing** for optimal performance
6. **Implement caching** where appropriate

### Example Server Implementation (Node.js/Express)

```javascript
app.post('/api/employees', async (req, res) => {
    try {
        const { page, pageSize, search, sortBy, sortDir, draw } = req.body;
        
        // Build database query
        let query = Employee.find();
        
        // Apply search filter
        if (search) {
            query = query.where({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            });
        }
        
        // Apply sorting
        if (sortBy) {
            const sortOrder = sortDir === 'desc' ? -1 : 1;
            query = query.sort({ [sortBy]: sortOrder });
        }
        
        // Get total count
        const total = await Employee.countDocuments(query.getQuery());
        
        // Apply pagination
        const skip = (page - 1) * pageSize;
        const data = await query.skip(skip).limit(pageSize);
        
        res.json({
            data,
            total,
            draw,
            error: null
        });
        
    } catch (error) {
        res.status(500).json({
            data: [],
            total: 0,
            draw: req.body.draw,
            error: error.message
        });
    }
});
```

## 🚀 Performance Features

- **Debounced search** (300ms delay, configurable)
- **Efficient DOM updates** with minimal re-rendering
- **Memory management** with proper cleanup
- **Event delegation** for dynamic elements
- **Smart pagination** for large datasets

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 Files Included

- `qmgrid.js` - Main library (ES6 class) with server-side support
- `qmgrid.css` - Complete styling with responsive design
- `qmgrid.d.ts` - TypeScript definitions with server-side types
- `index.html` - Interactive demo with examples
- `server-side-demo.html` - Server-side processing demonstration
- `export-demo.html` - Export functionality showcase
- `README.md` - This documentation
- `IMPROVEMENTS.md` - Detailed improvement documentation

## 📤 Export Functionality

QMGrid includes comprehensive export capabilities:

### Supported Formats
- **CSV** - Comma-separated values with customizable separators
- **Excel** - Microsoft Excel format (.xls)
- **PDF** - Portable Document Format with print optimization
- **Print** - Direct browser printing with optimized layout

### Export Options
```javascript
const table = new QMGrid('#table', {
    exportable: true,
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

### Export Methods
```javascript
// Basic export
table.exportData('csv');
table.exportData('excel');
table.exportData('pdf');
table.exportData('print');

// Export with options
table.exportData('csv', {
    filename: 'selected-data',
    selectedOnly: true,
    dateFormat: 'MM/DD/YYYY'
});

// Export visible page only
table.exportData('excel', {
    visibleOnly: true,
    filename: 'current-page'
});
```

### Built-in Export UI
The table automatically includes an export dropdown when `exportable: true`:
- Click the export button to see available formats
- Supports keyboard navigation
- Responsive design for mobile devices
- Customizable labels via language options

## 🔧 Advanced Usage

```javascript
// Load data dynamically
table.on('pageChange', async (data) => {
    table.showLoading();
    const response = await fetch(`/api/data?page=${data.page}`);
    const newData = await response.json();
    table.setData(newData).hideLoading();
});

// Search with API
table.on('search', async (data) => {
    if (data.term.length > 2) {
        table.showLoading();
        const response = await fetch(`/api/search?q=${data.term}`);
        const results = await response.json();
        table.setData(results).hideLoading();
    }
});
```

### Error Handling

The library includes comprehensive error handling:

```javascript
try {
    table.setData('invalid'); // Will throw error
} catch (error) {
    console.error('Invalid data:', error.message);
}

// Graceful handling of invalid operations
table.sort('nonexistent-column'); // Warns and returns gracefully
table.removeRow(-1); // Warns about invalid index
```

## 📝 License

MIT License - feel free to use in personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! The codebase now includes:
- Comprehensive JSDoc documentation
- Input validation throughout
- Error boundaries for custom functions
- Proper event cleanup
- TypeScript definitions

---

**Made with ❤️ by Qwabhina McFynn using pure vanilla JavaScript - no dependencies required!**
table.setData(newData);

// Add a row
table.addRow({ id: 3, name: 'Bob Johnson' });

// Remove a row by index
table.removeRow(2);

// Update a row
table.updateRow(1, { name: 'John Updated' });
```

### Selection

```javascript
// Get selected rows
const selected = table.getSelectedRows();

// Select a row
table.selectRow(0, true);

// Clear selection
table.clearSelection();

// Select all rows
table.selectAll(true);
```

### Navigation

```javascript
// Go to specific page
table.goToPage(2);

// Change page size
table.setPageSize(25);

// Search
table.search('john');

// Sort by column
table.sort('name', 'desc');
```

### UI State

```javascript
// Show loading state
table.showLoading();

// Hide loading state
table.hideLoading();

// Destroy table
table.destroy();
```

## Events

Listen to table events using the `on` method:

```javascript
// Row selection
table.on('rowSelect', (data) => {
    console.log('Selected:', data.selectedRows);
});

// Search
table.on('search', (data) => {
    console.log('Search term:', data.term);
});

// Sorting
table.on('sort', (data) => {
    console.log('Sorted by:', data.column, data.direction);
});

// Pagination
table.on('pageChange', (data) => {
    console.log('Page:', data.page);
});

// Data changes
table.on('dataChange', (data) => {
    console.log('New data:', data.data);
});
```

## Custom Renderers

Create custom cell content with render functions:

```javascript
columns: [
    {
        key: 'status',
        title: 'Status',
        render: (value, row, index) => {
            const colors = {
                active: 'green',
                inactive: 'red',
                pending: 'orange'
            };
            return `<span style="color: ${colors[value]}">${value.toUpperCase()}</span>`;
        }
    },
    {
        key: 'actions',
        title: 'Actions',
        sortable: false,
        render: (value, row, index) => {
            return `
                <button onclick="editRow(${row.id})">Edit</button>
                <button onclick="deleteRow(${row.id})">Delete</button>
            `;
        }
    }
]
```

## Advanced Examples

### Server-Side Data Loading

```javascript
// Server-side table with automatic data loading
const table = new QMGrid('#table', {
    columns: columns,
    serverSide: true,
    ajax: {
        url: '/api/data',
        method: 'POST'
    },
    pagination: true,
    pageSize: 20
});

// The table automatically handles:
// - Initial data loading
// - Pagination requests
// - Search requests
// - Sort requests
// - Error handling and retries

// Manual refresh
table.refresh();

// Listen for server events
table.on('serverDataLoaded', (data) => {
    console.log(`Loaded ${data.data.length} records`);
});
```

### Dynamic Column Configuration

```javascript
// Add/remove columns dynamically
function toggleColumn(columnKey) {
    const currentColumns = table.config.columns;
    const columnIndex = currentColumns.findIndex(col => col.key === columnKey);
    
    if (columnIndex > -1) {
        currentColumns.splice(columnIndex, 1);
    } else {
        currentColumns.push({
            key: columnKey,
            title: columnKey.charAt(0).toUpperCase() + columnKey.slice(1)
        });
    }
    
    table.render();
}
```

## Styling Customization

### CSS Custom Properties

```css
.qmgrid-container {
    --primary-color: #007bff;
    --border-color: #dee2e6;
    --hover-color: #f8f9fa;
    --selected-color: #e3f2fd;
}
```

### Custom Themes

```css
/* Dark theme */
.dark-theme .qmgrid-container {
    background: #1a1a1a;
    color: #e0e0e0;
}

.dark-theme .qmgrid-head,
.dark-theme .qmgrid-footer {
    background: #2d2d2d;
    border-color: #404040;
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Tips

1. **Large Datasets**: Use server-side pagination for datasets > 1000 rows
2. **Custom Renderers**: Keep render functions simple to avoid performance issues
3. **DOM Updates**: Batch multiple operations when possible
4. **Memory**: Call `destroy()` when removing tables from DOM

## License

MIT License - feel free to use in personal and commercial projects.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- Core table functionality
- Pagination, sorting, searching
- Row selection
- Custom renderers
- Responsive design
- Event system