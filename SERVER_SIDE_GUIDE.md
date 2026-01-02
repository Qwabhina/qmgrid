# QMGrid Server-Side Processing Guide

This guide provides comprehensive information on implementing server-side processing with QMGrid v2.0+.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Configuration Options](#configuration-options)
3. [Request Format](#request-format)
4. [Response Format](#response-format)
5. [Server Implementation Examples](#server-implementation-examples)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)

## Quick Start

### Basic Setup

```javascript
const table = new QMGrid('#my-table', {
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

### Minimal Server Response

```json
{
    "data": [
        {"id": 1, "name": "John", "email": "john@example.com"}
    ],
    "total": 100
}
```

## Configuration Options

### AJAX Configuration

```javascript
ajax: {
    url: '/api/employees',           // Required: Server endpoint
    method: 'POST',                  // HTTP method (GET, POST, PUT, PATCH)
    headers: {                       // Custom headers
        'Authorization': 'Bearer token',
        'Content-Type': 'application/json'
    },
    timeout: 30000,                  // Request timeout (ms)
    retryAttempts: 3,                // Number of retry attempts
    retryDelay: 1000,                // Delay between retries (ms)
    
    // Transform request parameters
    data: function(params) {
        return {
            page: params.page,
            size: params.pageSize,
            search: params.search,
            sort: params.sortBy,
            direction: params.sortDir
        };
    },
    
    // Lifecycle callbacks
    beforeSend: function(data, params) {
        console.log('Sending request:', data);
        return true; // Return false to cancel
    },
    
    complete: function() {
        console.log('Request completed');
    },
    
    error: function(error, page, search) {
        console.error('Request failed:', error);
    }
}
```

### Server Response Configuration

```javascript
serverResponse: {
    data: 'items',              // Path to data array (default: 'data')
    totalRecords: 'totalCount', // Path to total count (default: 'total')
    error: 'errorMessage',      // Path to error message (default: 'error')
    draw: 'requestId'           // Path to request ID (default: 'draw')
}
```

## Request Format

QMGrid sends the following parameters to your server:

### Default Parameters

```javascript
{
    page: 1,                    // Current page number (1-based)
    pageSize: 10,               // Number of items per page
    search: "john",             // Search term (empty string if no search)
    sortBy: "name",             // Column key to sort by (null if no sort)
    sortDir: "asc",             // Sort direction ("asc" or "desc")
    draw: 123                   // Request identifier for tracking
}
```

### Custom Parameter Transformation

```javascript
ajax: {
    data: function(params) {
        // Transform to match your API
        return {
            offset: (params.page - 1) * params.pageSize,
            limit: params.pageSize,
            q: params.search,
            order_by: params.sortBy,
            order_dir: params.sortDir,
            request_id: params.draw
        };
    }
}
```

## Response Format

### Standard Response

```json
{
    "data": [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "department": "Engineering",
            "salary": 75000
        }
    ],
    "total": 1250,
    "draw": 123,
    "error": null
}
```

### Error Response

```json
{
    "data": [],
    "total": 0,
    "draw": 123,
    "error": "Database connection failed"
}
```

### Custom Response Structure

If your API returns data in a different format, configure the response mapping:

```javascript
// Your API returns:
{
    "items": [...],
    "totalCount": 1250,
    "requestId": 123,
    "errorMessage": null
}

// Configure mapping:
serverResponse: {
    data: 'items',
    totalRecords: 'totalCount',
    error: 'errorMessage',
    draw: 'requestId'
}
```

## Server Implementation Examples

### Node.js with Express and MongoDB

```javascript
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

app.post('/api/employees', async (req, res) => {
    try {
        const { page, pageSize, search, sortBy, sortDir, draw } = req.body;
        
        // Build query
        let query = Employee.find();
        
        // Apply search filter
        if (search) {
            query = query.where({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } }
                ]
            });
        }
        
        // Get total count before pagination
        const total = await Employee.countDocuments(query.getQuery());
        
        // Apply sorting
        if (sortBy) {
            const sortOrder = sortDir === 'desc' ? -1 : 1;
            query = query.sort({ [sortBy]: sortOrder });
        }
        
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
        console.error('Database error:', error);
        res.status(500).json({
            data: [],
            total: 0,
            draw: req.body.draw,
            error: error.message
        });
    }
});
```

### PHP with MySQL

```php
<?php
header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $page = $input['page'] ?? 1;
    $pageSize = $input['pageSize'] ?? 10;
    $search = $input['search'] ?? '';
    $sortBy = $input['sortBy'] ?? 'id';
    $sortDir = $input['sortDir'] ?? 'asc';
    $draw = $input['draw'] ?? 1;
    
    $pdo = new PDO('mysql:host=localhost;dbname=mydb', $username, $password);
    
    // Build WHERE clause for search
    $whereClause = '';
    $params = [];
    if (!empty($search)) {
        $whereClause = 'WHERE name LIKE ? OR email LIKE ? OR department LIKE ?';
        $searchTerm = "%$search%";
        $params = [$searchTerm, $searchTerm, $searchTerm];
    }
    
    // Get total count
    $countSql = "SELECT COUNT(*) FROM employees $whereClause";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();
    
    // Build main query
    $orderClause = "ORDER BY $sortBy $sortDir";
    $offset = ($page - 1) * $pageSize;
    $limitClause = "LIMIT $pageSize OFFSET $offset";
    
    $sql = "SELECT * FROM employees $whereClause $orderClause $limitClause";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'data' => $data,
        'total' => (int)$total,
        'draw' => $draw,
        'error' => null
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'data' => [],
        'total' => 0,
        'draw' => $input['draw'] ?? 1,
        'error' => $e->getMessage()
    ]);
}
?>
```

### Python with Flask and SQLAlchemy

```python
from flask import Flask, request, jsonify
from sqlalchemy import or_, func
from models import Employee, db

app = Flask(__name__)

@app.route('/api/employees', methods=['POST'])
def get_employees():
    try:
        data = request.get_json()
        
        page = data.get('page', 1)
        page_size = data.get('pageSize', 10)
        search = data.get('search', '')
        sort_by = data.get('sortBy', 'id')
        sort_dir = data.get('sortDir', 'asc')
        draw = data.get('draw', 1)
        
        # Build query
        query = Employee.query
        
        # Apply search filter
        if search:
            query = query.filter(or_(
                Employee.name.ilike(f'%{search}%'),
                Employee.email.ilike(f'%{search}%'),
                Employee.department.ilike(f'%{search}%')
            ))
        
        # Get total count
        total = query.count()
        
        # Apply sorting
        if hasattr(Employee, sort_by):
            column = getattr(Employee, sort_by)
            if sort_dir == 'desc':
                query = query.order_by(column.desc())
            else:
                query = query.order_by(column.asc())
        
        # Apply pagination
        offset = (page - 1) * page_size
        employees = query.offset(offset).limit(page_size).all()
        
        # Convert to dict
        data = [emp.to_dict() for emp in employees]
        
        return jsonify({
            'data': data,
            'total': total,
            'draw': draw,
            'error': None
        })
        
    except Exception as e:
        return jsonify({
            'data': [],
            'total': 0,
            'draw': data.get('draw', 1),
            'error': str(e)
        }), 500
```

## Error Handling

### Client-Side Error Handling

```javascript
const table = new QMGrid('#table', {
    serverSide: true,
    ajax: {
        url: '/api/data',
        error: function(error, page, search) {
            // Custom error handling
            showNotification('Failed to load data: ' + error.message, 'error');
        }
    }
});

// Listen for server errors
table.on('serverError', (data) => {
    console.error('Server error:', data.error);
    showErrorModal(data.error);
});
```

### Server-Side Error Responses

Always return proper error responses:

```javascript
// Good: Structured error response
res.status(500).json({
    data: [],
    total: 0,
    draw: requestDraw,
    error: 'Database connection failed'
});

// Bad: Generic error
res.status(500).send('Internal Server Error');
```

## Performance Optimization

### Database Optimization

1. **Add indexes** on searchable and sortable columns:
```sql
CREATE INDEX idx_employees_name ON employees(name);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department);
```

2. **Use database-level pagination** instead of loading all data:
```sql
-- Good: Database pagination
SELECT * FROM employees LIMIT 10 OFFSET 20;

-- Bad: Application-level pagination
SELECT * FROM employees; -- Then slice in application
```

3. **Optimize search queries**:
```sql
-- Use full-text search for better performance
SELECT * FROM employees 
WHERE MATCH(name, email) AGAINST('search term' IN BOOLEAN MODE);
```

### Caching Strategies

```javascript
// Server-side caching example (Node.js with Redis)
const redis = require('redis');
const client = redis.createClient();

app.post('/api/employees', async (req, res) => {
    const cacheKey = `employees:${JSON.stringify(req.body)}`;
    
    // Try cache first
    const cached = await client.get(cacheKey);
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    
    // Query database
    const result = await queryDatabase(req.body);
    
    // Cache for 5 minutes
    await client.setex(cacheKey, 300, JSON.stringify(result));
    
    res.json(result);
});
```

### Client-Side Optimization

```javascript
// Debounce search to reduce server requests
const table = new QMGrid('#table', {
    serverSide: true,
    ajax: {
        url: '/api/data',
        // Built-in debouncing is already implemented
        // Search requests are automatically debounced by 300ms
    }
});
```

## Security Considerations

### Input Validation

```javascript
// Server-side validation example
app.post('/api/employees', (req, res) => {
    const { page, pageSize, search, sortBy, sortDir } = req.body;
    
    // Validate page number
    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({ error: 'Invalid page number' });
    }
    
    // Validate page size
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
        return res.status(400).json({ error: 'Invalid page size' });
    }
    
    // Validate sort column (whitelist approach)
    const allowedSortColumns = ['id', 'name', 'email', 'department', 'salary'];
    if (sortBy && !allowedSortColumns.includes(sortBy)) {
        return res.status(400).json({ error: 'Invalid sort column' });
    }
    
    // Validate sort direction
    if (sortDir && !['asc', 'desc'].includes(sortDir)) {
        return res.status(400).json({ error: 'Invalid sort direction' });
    }
    
    // Sanitize search input
    const sanitizedSearch = search ? search.replace(/[<>]/g, '') : '';
    
    // Continue with query...
});
```

### SQL Injection Prevention

```javascript
// Use parameterized queries
const query = `
    SELECT * FROM employees 
    WHERE name LIKE ? OR email LIKE ? 
    ORDER BY ${allowedColumn} ${allowedDirection}
    LIMIT ? OFFSET ?
`;

const params = [`%${search}%`, `%${search}%`, pageSize, offset];
const results = await db.query(query, params);
```

### Authentication & Authorization

```javascript
// Add authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

app.post('/api/employees', authenticateToken, async (req, res) => {
    // Check user permissions
    if (!req.user.permissions.includes('read_employees')) {
        return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    // Continue with query...
});
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
```javascript
// Server-side CORS configuration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
```

#### 2. Request Timeout
```javascript
// Increase timeout for slow queries
const table = new QMGrid('#table', {
    serverSide: true,
    ajax: {
        url: '/api/data',
        timeout: 60000 // 60 seconds
    }
});
```

#### 3. Stale Data Issues
```javascript
// The library automatically handles request cancellation
// But you can also manually refresh:
table.refresh();
```

### Debug Mode

```javascript
// Enable detailed logging
const table = new QMGrid('#table', {
    serverSide: true,
    ajax: {
        url: '/api/data',
        beforeSend: function(data, params) {
            console.log('Request params:', params);
            console.log('Request data:', data);
            return true;
        },
        complete: function() {
            console.log('Request completed');
        }
    }
});

// Listen to all server events
table.on('serverRequestStart', (data) => console.log('Request started:', data));
table.on('serverDataLoaded', (data) => console.log('Data loaded:', data));
table.on('serverError', (data) => console.log('Server error:', data));
```

### Testing Server Endpoints

Use the included `server-side-demo.html` file to test your server implementation:

1. Open `server-side-demo.html` in your browser
2. Configure your server URL and settings
3. Monitor the event log for request/response details
4. Test different scenarios (search, sort, pagination, errors)

## Best Practices Summary

1. **Always validate and sanitize input** on the server side
2. **Use parameterized queries** to prevent SQL injection
3. **Implement proper error handling** with structured responses
4. **Add database indexes** on searchable/sortable columns
5. **Use caching** for frequently accessed data
6. **Implement authentication and authorization**
7. **Set reasonable timeout values** based on your data size
8. **Monitor server performance** and optimize slow queries
9. **Use the draw parameter** to handle concurrent requests
10. **Test thoroughly** with the provided demo tools

For more examples and advanced usage, see the `server-side-demo.html` file included with QMGrid.