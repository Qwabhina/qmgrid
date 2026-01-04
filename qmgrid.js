/**
 * QMGrid - A lightweight, feature-rich data table library
 * 
 * @fileoverview QMGrid is a comprehensive data table solution built with vanilla JavaScript.
 * It provides advanced features including sorting, filtering, pagination, row selection,
 * comprehensive export functionality (CSV, Excel, PDF, Print), and native server-side processing
 * support with zero dependencies.
 * 
 * @version 2.0.1
 * @author Qwabhina McFynn
 * @license MIT
 * @since 1.0.0
 * 
 * @example
 * // Basic usage
 * const grid = new QMGrid('#my-table', {
 *     data: myData,
 *     columns: [
 *         { key: 'name', title: 'Name' },
 *         { key: 'email', title: 'Email' }
 *     ]
 * });
 * 
 * @example
 * // Server-side processing
 * const grid = new QMGrid('#server-table', {
 *     columns: myColumns,
 *     serverSide: true,
 *     ajax: {
 *         url: '/api/data',
 *         method: 'POST'
 *     }
 * });
 * 
 * @example
 * // Advanced usage with export
 * const grid = new QMGrid('#advanced-table', {
 *     data: myData,
 *     columns: myColumns,
 *     exportable: true,
 *     selectable: true,
 *     searchable: true
 * });
 */

/**
 * Default configuration constants for QMGrid
 * @namespace
 * @readonly
 */
const DEFAULTS = {
    /** @type {number} Default number of rows per page */
    PAGE_SIZE: 10,
    /** @type {number} Search debounce delay in milliseconds */
    SEARCH_DEBOUNCE_DELAY: 300,
    /** @type {number} Number of pages around current page in pagination */
    PAGINATION_DELTA: 2,
    /** @type {number} Maximum visible page numbers in pagination */
    MAX_VISIBLE_PAGES: 7,
    /** @type {number} Server request timeout in milliseconds */
    SERVER_TIMEOUT: 30000,
    /** @type {number} Maximum retry attempts for failed requests */
    MAX_RETRY_ATTEMPTS: 3,
    /** @type {number} Retry delay in milliseconds */
    RETRY_DELAY: 1000
};

/**
 * CSS class names used throughout QMGrid
 * @namespace
 * @readonly
 */
const CSS_CLASSES = {
    /** @type {string} Main container class */
    CONTAINER: 'qmgrid-container',
    /** @type {string} Table element class */
    TABLE: 'qmgrid-table',
    /** @type {string} Table header class */
    HEADER: 'qmgrid-head',
    /** @type {string} Table body class */
    BODY: 'qmgrid-body',
    /** @type {string} Table row class */
    ROW: 'qmgrid-row',
    /** @type {string} Table cell class */
    CELL: 'qmgrid-cell',
    /** @type {string} Sortable column class */
    SORTABLE: 'sortable',
    /** @type {string} Selected row class */
    SELECTED: 'selected',
    /** @type {string} Loading overlay class */
    LOADING: 'qmgrid-loading',
    /** @type {string} Empty state class */
    EMPTY: 'qmgrid-empty'
};

/**
 * Event names emitted by QMGrid
 * @namespace
 * @readonly
 */
const EVENTS = {
    /** @type {string} Fired when search is performed */
    SEARCH: 'search',
    /** @type {string} Fired when column is sorted */
    SORT: 'sort',
    /** @type {string} Fired when page is changed */
    PAGE_CHANGE: 'pageChange',
    /** @type {string} Fired when row is selected/deselected */
    ROW_SELECT: 'rowSelect',
    /** @type {string} Fired when data is changed */
    DATA_CHANGE: 'dataChange',
    /** @type {string} Fired when row is added */
    ROW_ADD: 'rowAdd',
    /** @type {string} Fired when row is removed */
    ROW_REMOVE: 'rowRemove',
    /** @type {string} Fired when row is updated */
    ROW_UPDATE: 'rowUpdate',
    /** @type {string} Fired when data is exported */
    EXPORT: 'export',
    /** @type {string} Fired when server request starts */
    SERVER_REQUEST_START: 'serverRequestStart',
    /** @type {string} Fired when server request completes */
    SERVER_REQUEST_END: 'serverRequestEnd',
    /** @type {string} Fired when server request fails */
    SERVER_ERROR: 'serverError',
    /** @type {string} Fired when server data is loaded */
    SERVER_DATA_LOADED: 'serverDataLoaded'
};

/**
 * Supported export formats
 * @namespace
 * @readonly
 */
const EXPORT_FORMATS = {
    /** @type {string} Comma-separated values format */
    CSV: 'csv',
    /** @type {string} Microsoft Excel format */
    EXCEL: 'excel',
    /** @type {string} Portable Document Format */
    PDF: 'pdf',
    /** @type {string} Browser print format */
    PRINT: 'print'
};

/**
 * QMGrid - Advanced Data Table Component
 * 
 * @class QMGrid
 * @classdesc A comprehensive data table solution with advanced features including
 * sorting, filtering, pagination, row selection, export functionality, and native
 * server-side processing support. Built with vanilla JavaScript and zero dependencies.
 * 
 * @author Qwabhina McFynn
 * @version 2.0.0
 * @since 1.0.0
 */
class QMGrid {
    /**
     * Create a new QMGrid instance
     * 
     * @constructor
     * @param {string|HTMLElement} selector - CSS selector string or DOM element to contain the grid
     * @param {QMGridConfig} [options={}] - Configuration options for the grid
     * 
     * @throws {Error} When selector is invalid or container element not found
     * @throws {Error} When options is not an object
     * @throws {Error} When columns is not an array
     * @throws {Error} When data is not an array
     * 
     * @example
     * // Basic initialization
     * const grid = new QMGrid('#my-grid', {
     *     data: [
     *         { id: 1, name: 'John', email: 'john@example.com' },
     *         { id: 2, name: 'Jane', email: 'jane@example.com' }
     *     ],
     *     columns: [
     *         { key: 'id', title: 'ID' },
     *         { key: 'name', title: 'Name' },
     *         { key: 'email', title: 'Email' }
     *     ]
     * });
     * 
     * @example
     * // Advanced initialization with all features
     * const grid = new QMGrid('#advanced-grid', {
     *     data: myData,
     *     columns: myColumns,
     *     pagination: true,
     *     pageSize: 25,
     *     sortable: true,
     *     searchable: true,
     *     selectable: true,
     *     multiSelect: true,
     *     exportable: true,
     *     exportOptions: {
     *         filename: 'my-export',
     *         dateFormat: 'MM/DD/YYYY'
     *     }
     * });
     * 
     * @example
     * // Advanced initialization with server-side processing
     * const grid = new QMGrid('#server-grid', {
     *     columns: myColumns,
     *     serverSide: true,
     *     ajax: {
     *         url: '/api/data',
     *         method: 'POST',
     *         headers: { 'Authorization': 'Bearer token' },
     *         data: function(params) {
     *             return {
     *                 page: params.page,
     *                 size: params.pageSize,
     *                 search: params.search,
     *                 sort: params.sortBy,
     *                 direction: params.sortDir
     *             };
     *         }
     *     },
     *     serverResponse: {
     *         data: 'items',
     *         totalRecords: 'totalCount',
     *         error: 'errorMessage'
     *     }
     * });
     * 
     * @since 1.0.0
     */
    constructor(selector, options = {}) {
        // Input validation
        if (!selector) {
            throw new Error('Selector is required');
        }
        
        this.container = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!this.container) {
            throw new Error(`Container element not found: ${selector}`);
        }
        
        // Default configuration
        this.config = {
            data: [],
            columns: [],
            pagination: true,
            pageSize: DEFAULTS.PAGE_SIZE,
            sortable: true,
            filterable: true,
            searchable: true,
            selectable: false,
            multiSelect: false,
            responsive: true,
            striped: true,
            bordered: true,
            hover: true,
            loading: false,
            emptyMessage: 'No data available',
            exportable: true,
            theme: 'light', // 'light' or 'dark'
            // Server-side processing configuration
            serverSide: false,
            ajax: {
                url: null,
                method: 'GET',
                headers: {},
                timeout: DEFAULTS.SERVER_TIMEOUT,
                retryAttempts: DEFAULTS.MAX_RETRY_ATTEMPTS,
                retryDelay: DEFAULTS.RETRY_DELAY,
                data: null, // Function to transform request parameters
                beforeSend: null, // Function called before request
                complete: null, // Function called after request (success or error)
                error: null // Function called on request error
            },
            serverResponse: {
                data: 'data', // Path to data array in response
                totalRecords: 'total', // Path to total records count
                error: 'error', // Path to error message
                draw: 'draw' // Path to request identifier (optional)
            },
            exportOptions: {
                filename: 'qmgrid-export',
                includeHeaders: true,
                selectedOnly: false,
                visibleOnly: false,
                dateFormat: 'YYYY-MM-DD',
                csvSeparator: ',',
                pdfOrientation: 'portrait', // 'portrait' or 'landscape'
                pdfPageSize: 'A4', // 'A4', 'A3', 'letter', etc.
                excelSheetName: 'Data'
            },
            language: {
                search: 'Search:',
                lengthMenu: 'Show _MENU_ entries',
                info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                infoEmpty: 'Showing 0 to 0 of 0 entries',
                infoFiltered: '(filtered from _MAX_ total entries)',
                paginate: {
                    first: 'First',
                    previous: 'Previous',
                    next: 'Next',
                    last: 'Last'
                },
                export: {
                    csv: 'Export CSV',
                    excel: 'Export Excel',
                    pdf: 'Export PDF',
                    print: 'Print Table'
                }
            },
            ...options
        };

        // Internal state
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.selectedRows = new Set();
        this.filteredData = [];
        this.originalData = [];
        this.searchTimeout = null;
        this.eventListeners = new Map();
        this.events = {};
        
        // Server-side state
        this.totalRecords = 0;
        this.isLoading = false;
        this.currentRequest = null;
        this.requestId = 0;
        this.retryCount = 0;

        this.init();
    }

    init() {
        // Validate server-side configuration
        if (this.config.serverSide) {
            if (!this.config.ajax.url) {
                throw new Error('Server-side processing enabled but no URL provided in ajax.url');
            }
            // For server-side, we don't initialize with data
            this.originalData = [];
            this.filteredData = [];
            this.totalRecords = 0;
        } else {
            // Client-side initialization
            this.originalData = [...this.config.data];
            this.filteredData = [...this.config.data];
        }
        
        this.createStructure();
        
        if (this.config.serverSide) {
            // Load initial server data
            this.loadServerData();
        } else {
            this.render();
        }
        
        this.attachEvents();
    }

    createStructure() {
        this.container.className = CSS_CLASSES.CONTAINER;
        
        // Initialize theme
        this.setTheme(this.config.theme);
        
        this.container.innerHTML = `
            <div class="qmgrid-header">
                <div class="qmgrid-controls">
                    <div class="qmgrid-length">
                        <label>
                            ${this.config.language.lengthMenu.replace('_MENU_', `
                                <select class="page-size-select">
                                    <option value="5">5</option>
                                    <option value="10" ${this.config.pageSize === 10 ? 'selected' : ''}>10</option>
                                    <option value="25" ${this.config.pageSize === 25 ? 'selected' : ''}>25</option>
                                    <option value="50" ${this.config.pageSize === 50 ? 'selected' : ''}>50</option>
                                    <option value="100" ${this.config.pageSize === 100 ? 'selected' : ''}>100</option>
                                </select>
                            `)}
                        </label>
                    </div>
                    ${this.config.searchable ? `
                        <div class="qmgrid-search">
                            <label>
                                ${this.config.language.search}
                                <input type="search" class="search-input" placeholder="Search..." 
                                       aria-label="Search table data" autocomplete="off">
                            </label>
                        </div>
                    ` : ''}
                    ${this.config.exportable ? `
                        <div class="qmgrid-export">
                            <div class="export-dropdown">
                                <button class="export-btn" aria-label="Export options">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                    Export
                                </button>
                                <div class="export-menu">
                                    <button class="export-option" data-format="csv">${this.config.language.export.csv}</button>
                                    <button class="export-option" data-format="excel">${this.config.language.export.excel}</button>
                                    <button class="export-option" data-format="pdf">${this.config.language.export.pdf}</button>
                                    <button class="export-option" data-format="print">${this.config.language.export.print}</button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="qmgrid-wrapper">
                <table class="qmgrid-table ${this.getTableClasses()}" role="table" aria-label="Data table">
                    <thead class="qmgrid-head" role="rowgroup"></thead>
                    <tbody class="qmgrid-body" role="rowgroup"></tbody>
                </table>
                <div class="qmgrid-loading" style="display: none;" role="status" aria-live="polite">
                    <div class="loading-spinner"></div>
                    <span>Loading...</span>
                </div>
                <div class="qmgrid-empty" style="display: none;" role="status" aria-live="polite">
                    ${this.config.emptyMessage}
                </div>
            </div>
            ${this.config.pagination ? `
                <div class="qmgrid-footer">
                    <div class="qmgrid-info"></div>
                    <div class="qmgrid-pagination">
                        <button class="page-btn first-page" title="${this.config.language.paginate.first}">&laquo;</button>
                        <button class="page-btn prev-page" title="${this.config.language.paginate.previous}">&lsaquo;</button>
                        <div class="page-numbers"></div>
                        <button class="page-btn next-page" title="${this.config.language.paginate.next}">&rsaquo;</button>
                        <button class="page-btn last-page" title="${this.config.language.paginate.last}">&raquo;</button>
                    </div>
                </div>
            ` : ''}
        `;
    }

    getTableClasses() {
        const classes = [];
        if (this.config.striped) classes.push('table-striped');
        if (this.config.bordered) classes.push('table-bordered');
        if (this.config.hover) classes.push('table-hover');
        if (this.config.responsive) classes.push('table-responsive');
        return classes.join(' ');
    }

    /**
     * Set the theme for the grid
     * @param {string} theme - Theme name ('light' or 'dark')
     * @public
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.warn(`QMGrid: Invalid theme '${theme}'. Using 'light' theme.`);
            theme = 'light';
        }
        
        this.config.theme = theme;
        
        if (theme === 'dark') {
            this.container.classList.add('qmgrid-dark');
        } else {
            this.container.classList.remove('qmgrid-dark');
        }
    }

    /**
     * Get the current theme
     * @returns {string} Current theme ('light' or 'dark')
     * @public
     */
    getTheme() {
        return this.config.theme;
    }

    /**
     * Toggle between light and dark themes
     * @public
     */
    toggleTheme() {
        const newTheme = this.config.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    render() {
        this.renderHeader();
        this.renderBody();
        if (this.config.pagination) {
            this.renderPagination();
            this.renderInfo();
        }
    }

    renderHeader() {
        const thead = this.container.querySelector('.qmgrid-head');
        const headerRow = document.createElement('tr');

        if (this.config.selectable) {
            const selectAllCell = document.createElement('th');
            selectAllCell.className = 'select-column';
            if (this.config.multiSelect) {
                selectAllCell.innerHTML = '<input type="checkbox" class="select-all-checkbox">';
            }
            headerRow.appendChild(selectAllCell);
        }

        this.config.columns.forEach(column => {
            const th = document.createElement('th');
            th.className = 'qmgrid-header-cell';
            th.textContent = column.title;
            
            if (column.width) {
                th.style.width = column.width;
            }
            
            if (this.config.sortable && column.sortable !== false) {
                th.classList.add('sortable');
                th.dataset.column = column.key;
                th.setAttribute('tabindex', '0');
                th.setAttribute('role', 'button');
                th.setAttribute('aria-sort', 'none');
            }
            
            headerRow.appendChild(th);
        });

        thead.innerHTML = '';
        thead.appendChild(headerRow);
    }

    renderBody() {
        const tbody = this.container.querySelector('.qmgrid-body');
        const emptyDiv = this.container.querySelector('.qmgrid-empty');
        
        if (this.filteredData.length === 0) {
            tbody.innerHTML = '';
            emptyDiv.style.display = 'block';
            return;
        }

        emptyDiv.style.display = 'none';
        
        // For server-side processing, filteredData already contains the correct page data
        // For client-side processing, we need to slice the data for pagination
        let pageData;
        let startIndex;
        
        if (this.config.serverSide) {
            // Server already sent the correct page data
            pageData = this.filteredData;
            startIndex = (this.currentPage - 1) * this.config.pageSize;
            console.log('Server-side renderBody:', {
                currentPage: this.currentPage,
                pageSize: this.config.pageSize,
                filteredDataLength: this.filteredData.length,
                startIndex: startIndex,
                pageDataLength: pageData.length
            });
        } else {
            // Client-side pagination - slice the data
            startIndex = this.config.pagination ? (this.currentPage - 1) * this.config.pageSize : 0;
            const endIndex = this.config.pagination ? startIndex + this.config.pageSize : this.filteredData.length;
            pageData = this.filteredData.slice(startIndex, endIndex);
        }

        tbody.innerHTML = '';
        
        pageData.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.className = 'qmgrid-row';
            tr.dataset.index = startIndex + index;

            if (this.selectedRows.has(startIndex + index)) {
                tr.classList.add('selected');
            }

            if (this.config.selectable) {
                const selectCell = document.createElement('td');
                selectCell.className = 'select-column';
                const checkbox = document.createElement('input');
                checkbox.type = this.config.multiSelect ? 'checkbox' : 'radio';
                checkbox.name = this.config.multiSelect ? '' : 'row-select';
                checkbox.className = 'row-select-checkbox';
                checkbox.checked = this.selectedRows.has(startIndex + index);
                selectCell.appendChild(checkbox);
                tr.appendChild(selectCell);
            }

            this.config.columns.forEach(column => {
                const td = document.createElement('td');
                td.className = 'qmgrid-cell';
                
                let cellValue = this.getCellValue(row, column.key);
                
                if (column.render && typeof column.render === 'function') {
                    cellValue = this.safeRender(column.render, cellValue, row, startIndex + index);
                } else if (column.type === 'date' && cellValue) {
                    try {
                        cellValue = new Date(cellValue).toLocaleDateString();
                    } catch (error) {
                        console.warn('Invalid date value:', cellValue);
                        cellValue = String(cellValue);
                    }
                } else if (column.type === 'currency' && cellValue !== null && cellValue !== undefined) {
                    try {
                        const numValue = parseFloat(cellValue);
                        if (isNaN(numValue)) {
                            cellValue = String(cellValue);
                        } else {
                            cellValue = new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'GHS'
                            }).format(numValue);
                        }
                    } catch (error) {
                        console.warn('Invalid currency value:', cellValue);
                        cellValue = String(cellValue);
                    }
                }

                td.innerHTML = cellValue || '';
                
                if (column.className) {
                    td.className += ' ' + column.className;
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });
    }

    getCellValue(row, key) {
        if (!row || typeof row !== 'object') {
            return '';
        }
        
        if (!key) {
            return '';
        }
        
        // Handle nested properties with dot notation (e.g., 'user.name')
        if (key.includes('.')) {
            return key.split('.').reduce((obj, prop) => {
                return obj && obj[prop] !== undefined ? obj[prop] : '';
            }, row);
        }
        
        return row[key] !== undefined && row[key] !== null ? row[key] : '';
    }

    safeRender(renderFn, value, row, index) {
        try {
            const result = renderFn(value, row, index);
            if (typeof result !== 'string' && typeof result !== 'number') {
                console.warn('Render function should return string or number, got:', typeof result);
                return String(result || '');
            }
            return result;
        } catch (error) {
            console.error('Error in custom render function:', error);
            return String(value || '');
        }
    }

    renderPagination() {
        const totalPages = this.config.serverSide 
            ? Math.ceil(this.totalRecords / this.config.pageSize)
            : Math.ceil(this.filteredData.length / this.config.pageSize);
            
        const paginationContainer = this.container.querySelector('.qmgrid-pagination');
        
        if (!paginationContainer) return;
        
        const pageNumbers = paginationContainer.querySelector('.page-numbers');
        const firstBtn = paginationContainer.querySelector('.first-page');
        const prevBtn = paginationContainer.querySelector('.prev-page');
        const nextBtn = paginationContainer.querySelector('.next-page');
        const lastBtn = paginationContainer.querySelector('.last-page');

        // Update button states
        if (firstBtn) firstBtn.disabled = this.currentPage === 1;
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        if (lastBtn) lastBtn.disabled = this.currentPage === totalPages || totalPages === 0;

        // Render page numbers
        if (pageNumbers) {
            pageNumbers.innerHTML = '';
            
            if (totalPages <= DEFAULTS.MAX_VISIBLE_PAGES) {
                // Show all pages
                for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.appendChild(this.createPageButton(i));
                }
            } else {
                // Show first page
                pageNumbers.appendChild(this.createPageButton(1));
                
                if (this.currentPage > 4) {
                    pageNumbers.appendChild(this.createEllipsis());
                }
                
                // Show pages around current page
                const start = Math.max(2, this.currentPage - DEFAULTS.PAGINATION_DELTA);
                const end = Math.min(totalPages - 1, this.currentPage + DEFAULTS.PAGINATION_DELTA);
                
                for (let i = start; i <= end; i++) {
                    pageNumbers.appendChild(this.createPageButton(i));
                }
                
                if (this.currentPage < totalPages - 3) {
                    pageNumbers.appendChild(this.createEllipsis());
                }
                
                // Show last page
                if (totalPages > 1) {
                    pageNumbers.appendChild(this.createPageButton(totalPages));
                }
            }
        }
    }

    createPageButton(pageNum) {
        const button = document.createElement('button');
        button.className = 'page-btn page-number';
        button.textContent = pageNum;
        button.dataset.page = pageNum;
        
        if (pageNum === this.currentPage) {
            button.classList.add('active');
        }
        
        return button;
    }

    createEllipsis() {
        const span = document.createElement('span');
        span.className = 'page-ellipsis';
        span.textContent = '...';
        return span;
    }

    renderInfo() {
        const infoContainer = this.container.querySelector('.qmgrid-info');
        if (!infoContainer) return;
        
        if (this.config.serverSide) {
            const start = this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.config.pageSize + 1;
            const end = Math.min(this.currentPage * this.config.pageSize, this.totalRecords);
            const total = this.totalRecords;

            let infoText;
            if (total === 0) {
                infoText = this.config.language.infoEmpty;
            } else {
                infoText = this.config.language.info
                    .replace('_START_', start)
                    .replace('_END_', end)
                    .replace('_TOTAL_', total);
                
                if (this.searchTerm) {
                    infoText += ' ' + this.config.language.infoFiltered.replace('_MAX_', total);
                }
            }

            infoContainer.textContent = infoText;
        } else {
            // Client-side info rendering (existing logic)
            const start = this.filteredData.length === 0 ? 0 : (this.currentPage - 1) * this.config.pageSize + 1;
            const end = Math.min(this.currentPage * this.config.pageSize, this.filteredData.length);
            const total = this.filteredData.length;
            const max = this.originalData.length;

            let infoText;
            if (total === 0) {
                infoText = this.config.language.infoEmpty;
            } else {
                infoText = this.config.language.info
                    .replace('_START_', start)
                    .replace('_END_', end)
                    .replace('_TOTAL_', total);
                
                if (total !== max) {
                    infoText += ' ' + this.config.language.infoFiltered.replace('_MAX_', max);
                }
            }

            infoContainer.textContent = infoText;
        }
    }

    attachEvents() {
        // Search functionality with debouncing
        if (this.config.searchable) {
            const searchInput = this.container.querySelector('.search-input');
            if (searchInput) {
                const debouncedSearch = this.debounce((e) => {
                    this.search(e.target.value);
                }, DEFAULTS.SEARCH_DEBOUNCE_DELAY);
                
                searchInput.addEventListener('input', debouncedSearch);
                this.eventListeners.set('search-input', { element: searchInput, event: 'input', handler: debouncedSearch });
            }
        }

        // Page size change
        const pageSizeSelect = this.container.querySelector('.page-size-select');
        if (pageSizeSelect) {
            const pageSizeHandler = (e) => {
                this.setPageSize(parseInt(e.target.value));
            };
            pageSizeSelect.addEventListener('change', pageSizeHandler);
            this.eventListeners.set('page-size', { element: pageSizeSelect, event: 'change', handler: pageSizeHandler });
        }

        // Sorting
        if (this.config.sortable) {
            const sortHandler = (e) => {
                const headerCell = e.target.closest('.sortable');
                if (headerCell) {
                    const column = headerCell.dataset.column;
                    this.sort(column);
                }
            };
            this.container.addEventListener('click', sortHandler);
            this.eventListeners.set('sort', { element: this.container, event: 'click', handler: sortHandler });
        }

        // Row selection
        if (this.config.selectable) {
            const selectionHandler = (e) => {
                if (e.target.classList.contains('select-all-checkbox')) {
                    this.selectAll(e.target.checked);
                } else if (e.target.classList.contains('row-select-checkbox')) {
                    const row = e.target.closest('tr');
                    if (row) {
                        const index = parseInt(row.dataset.index);
                        if (!isNaN(index)) {
                            this.selectRow(index, e.target.checked);
                        }
                    }
                }
            };
            this.container.addEventListener('change', selectionHandler);
            this.eventListeners.set('selection', { element: this.container, event: 'change', handler: selectionHandler });
        }

        // Pagination
        if (this.config.pagination) {
            const paginationHandler = (e) => {
                const totalPages = this.config.serverSide 
                    ? Math.ceil(this.totalRecords / this.config.pageSize)
                    : Math.ceil(this.filteredData.length / this.config.pageSize);
                
                // Debug logging for server-side
                if (this.config.serverSide && e.target.classList.contains('page-number')) {
                    console.log('Server-side pagination:', {
                        totalRecords: this.totalRecords,
                        pageSize: this.config.pageSize,
                        totalPages: totalPages,
                        clickedPage: parseInt(e.target.dataset.page)
                    });
                }
                
                if (e.target.classList.contains('first-page')) {
                    this.goToPage(1);
                } else if (e.target.classList.contains('prev-page')) {
                    this.goToPage(Math.max(1, this.currentPage - 1));
                } else if (e.target.classList.contains('next-page')) {
                    this.goToPage(Math.min(totalPages, this.currentPage + 1));
                } else if (e.target.classList.contains('last-page')) {
                    this.goToPage(totalPages);
                } else if (e.target.classList.contains('page-number')) {
                    const page = parseInt(e.target.dataset.page);
                    if (!isNaN(page) && page >= 1 && page <= totalPages) {
                        this.goToPage(page);
                    } else {
                        console.warn('Invalid page number:', page, 'Total pages:', totalPages);
                    }
                }
            };
            this.container.addEventListener('click', paginationHandler);
            this.eventListeners.set('pagination', { element: this.container, event: 'click', handler: paginationHandler });
        }

        // Export functionality
        if (this.config.exportable) {
            const exportHandler = (e) => {
                if (e.target.classList.contains('export-btn')) {
                    e.preventDefault();
                    const dropdown = e.target.nextElementSibling;
                    dropdown.classList.toggle('show');
                } else if (e.target.classList.contains('export-option')) {
                    e.preventDefault();
                    const format = e.target.dataset.format;
                    this.exportData(format);
                    
                    // Hide dropdown
                    const dropdown = e.target.closest('.export-menu');
                    dropdown.classList.remove('show');
                }
            };
            this.container.addEventListener('click', exportHandler);
            this.eventListeners.set('export', { element: this.container, event: 'click', handler: exportHandler });

            // Close dropdown when clicking outside
            const outsideClickHandler = (e) => {
                if (!e.target.closest('.export-dropdown')) {
                    const dropdowns = this.container.querySelectorAll('.export-menu');
                    dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
                }
            };
            document.addEventListener('click', outsideClickHandler);
            this.eventListeners.set('export-outside', { element: document, event: 'click', handler: outsideClickHandler });
        }
    }

    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    search(term) {
        if (typeof term !== 'string') {
            term = String(term || '');
        }
        
        this.searchTerm = term.toLowerCase();
        
        if (this.config.serverSide) {
            this.currentPage = 1; // Reset to first page on search
            this.loadServerData();
        } else {
            this.applyFilters();
            this.currentPage = 1;
            this.render();
        }
        
        this.emit(EVENTS.SEARCH, { term });
        return this;
    }

    applyFilters() {
        this.filteredData = this.originalData.filter(row => {
            if (!this.searchTerm) return true;
            
            return this.config.columns.some(column => {
                const value = this.getCellValue(row, column.key);
                return value && value.toString().toLowerCase().includes(this.searchTerm);
            });
        });
    }

    setData(data) {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }
        
        if (this.config.serverSide) {
            console.warn('setData() called with server-side processing enabled. This will switch to client-side mode for this data.');
            // Temporarily switch to client-side for this data
            this.config.serverSide = false;
        }
        
        this.originalData = [...data];
        this.config.data = data;
        this.applyFilters();
        this.currentPage = 1;
        this.selectedRows.clear();
        this.render();
        this.emit(EVENTS.DATA_CHANGE, { data });
        return this;
    }

    addRow(row) {
        if (!row || typeof row !== 'object') {
            throw new Error('Row must be an object');
        }
        
        if (this.config.serverSide) {
            console.warn('addRow() not supported in server-side mode. Use server API to add data.');
            return this;
        }
        
        this.originalData.push(row);
        this.config.data.push(row);
        this.applyFilters();
        this.render();
        this.emit(EVENTS.ROW_ADD, { row });
        return this;
    }

    removeRow(index) {
        if (typeof index !== 'number' || index < 0 || index >= this.originalData.length) {
            console.warn(`Invalid row index: ${index}`);
            return this;
        }
        
        if (this.config.serverSide) {
            console.warn('removeRow() not supported in server-side mode. Use server API to remove data.');
            return this;
        }
        
        const removedRow = this.originalData.splice(index, 1)[0];
        this.config.data.splice(index, 1);
        this.selectedRows.delete(index);
        
        // Update selected row indices after removal
        const newSelectedRows = new Set();
        this.selectedRows.forEach(selectedIndex => {
            if (selectedIndex > index) {
                newSelectedRows.add(selectedIndex - 1);
            } else if (selectedIndex < index) {
                newSelectedRows.add(selectedIndex);
            }
        });
        this.selectedRows = newSelectedRows;
        
        this.applyFilters();
        this.render();
        this.emit(EVENTS.ROW_REMOVE, { row: removedRow, index });
        return this;
    }

    updateRow(index, newData) {
        if (typeof index !== 'number' || index < 0 || index >= this.originalData.length) {
            console.warn(`Invalid row index: ${index}`);
            return this;
        }
        
        if (!newData || typeof newData !== 'object') {
            throw new Error('New data must be an object');
        }
        
        if (this.config.serverSide) {
            console.warn('updateRow() not supported in server-side mode. Use server API to update data.');
            return this;
        }
        
        this.originalData[index] = { ...this.originalData[index], ...newData };
        this.config.data[index] = { ...this.config.data[index], ...newData };
        this.applyFilters();
        this.render();
        this.emit(EVENTS.ROW_UPDATE, { row: this.originalData[index], index });
        return this;
    }

    sort(column, direction = null) {
        if (!column || typeof column !== 'string') {
            console.warn('Sort column must be a non-empty string');
            return this;
        }
        
        // Validate column exists
        const columnExists = this.config.columns.some(col => col.key === column);
        if (!columnExists) {
            console.warn(`Column '${column}' does not exist`);
            return this;
        }
        
        if (direction && !['asc', 'desc'].includes(direction)) {
            console.warn('Sort direction must be "asc" or "desc"');
            direction = null;
        }

        if (this.sortColumn === column && direction === null) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = direction || 'asc';
        }

        if (this.config.serverSide) {
            this.currentPage = 1; // Reset to first page on sort
            this.loadServerData();
        } else {
            this.filteredData.sort((a, b) => {
                const aVal = this.getCellValue(a, column);
                const bVal = this.getCellValue(b, column);
                
                let result = 0;
                if (aVal < bVal) result = -1;
                else if (aVal > bVal) result = 1;
                
                return this.sortDirection === 'desc' ? -result : result;
            });
            this.render();
        }

        this.emit(EVENTS.SORT, { column, direction: this.sortDirection });
        return this;
    }

    goToPage(page) {
        if (this.config.serverSide) {
            const totalPages = Math.ceil(this.totalRecords / this.config.pageSize);
            if (page >= 1 && page <= totalPages) {
                this.currentPage = page;
                this.loadServerData();
                this.emit(EVENTS.PAGE_CHANGE, { page });
            }
        } else {
            const totalPages = Math.ceil(this.filteredData.length / this.config.pageSize);
            if (page >= 1 && page <= totalPages) {
                this.currentPage = page;
                this.render();
                this.emit(EVENTS.PAGE_CHANGE, { page });
            }
        }
        return this;
    }

    setPageSize(size) {
        if (typeof size !== 'number' || size < 1) {
            console.warn('Page size must be a positive number');
            return this;
        }
        
        this.config.pageSize = size;
        this.currentPage = 1;
        
        if (this.config.serverSide) {
            this.loadServerData();
        } else {
            this.render();
        }
        
        this.emit('pageSizeChange', { pageSize: size });
        return this;
    }

    selectRow(index, selected) {
        if (!this.config.multiSelect) {
            this.selectedRows.clear();
        }
        
        if (selected) {
            this.selectedRows.add(index);
        } else {
            this.selectedRows.delete(index);
        }
        
        this.render();
        this.emit(EVENTS.ROW_SELECT, { index, selected, selectedRows: Array.from(this.selectedRows) });
        return this;
    }

    selectAll(selected) {
        if (selected) {
            this.filteredData.forEach((_, index) => {
                this.selectedRows.add(index);
            });
        } else {
            this.selectedRows.clear();
        }
        
        this.render();
        this.emit('selectAll', { selected, selectedRows: Array.from(this.selectedRows) });
        return this;
    }

    getSelectedRows() {
        return Array.from(this.selectedRows).map(index => this.filteredData[index]).filter(Boolean);
    }

    clearSelection() {
        this.selectedRows.clear();
        this.render();
        this.emit('selectionClear');
        return this;
    }

    showLoading() {
        const loadingDiv = this.container.querySelector('.qmgrid-loading');
        const wrapper = this.container.querySelector('.qmgrid-wrapper table');
        if (loadingDiv) loadingDiv.style.display = 'flex';
        if (wrapper) wrapper.style.opacity = '0.5';
        return this;
    }

    hideLoading() {
        const loadingDiv = this.container.querySelector('.qmgrid-loading');
        const wrapper = this.container.querySelector('.qmgrid-wrapper table');
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (wrapper) wrapper.style.opacity = '1';
        return this;
    }

    /**
     * Load data from server
     * @returns {Promise<void>}
     * @private
     */
    async loadServerData() {
        if (!this.config.ajax.url) {
            console.error('Server-side processing enabled but no URL provided');
            return;
        }

        // Cancel any existing request
        if (this.currentRequest) {
            this.currentRequest.abort();
        }

        // Prevent concurrent requests
        if (this.isLoading) {
            return;
        }

        this.isLoading = true;
        this.showLoading();
        this.emit(EVENTS.SERVER_REQUEST_START, { 
            page: this.currentPage,
            search: this.searchTerm,
            sort: this.sortColumn,
            direction: this.sortDirection
        });

        try {
            const requestId = ++this.requestId;
            const params = {
                page: this.currentPage,
                pageSize: this.config.pageSize,
                search: this.searchTerm,
                sortBy: this.sortColumn,
                sortDir: this.sortDirection,
                draw: requestId // Request identifier for tracking
            };

            // Allow custom data transformation
            const requestData = this.config.ajax.data 
                ? this.config.ajax.data(params) 
                : params;

            // Call beforeSend callback if provided
            if (this.config.ajax.beforeSend && typeof this.config.ajax.beforeSend === 'function') {
                const shouldContinue = this.config.ajax.beforeSend(requestData, params);
                if (shouldContinue === false) {
                    this.isLoading = false;
                    this.hideLoading();
                    return;
                }
            }

            const controller = new AbortController();
            this.currentRequest = controller;

            const requestOptions = {
                method: this.config.ajax.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...this.config.ajax.headers
                },
                signal: controller.signal
            };

            // Set timeout
            const timeoutId = setTimeout(() => {
                controller.abort();
            }, this.config.ajax.timeout);

            if (this.config.ajax.method !== 'GET') {
                requestOptions.body = JSON.stringify(requestData);
            }

            const url = this.config.ajax.method === 'GET' 
                ? `${this.config.ajax.url}?${new URLSearchParams(this.flattenObject(requestData))}`
                : this.config.ajax.url;

            const response = await fetch(url, requestOptions);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();

            // Validate response draw/request ID if provided
            const responseDraw = this.getNestedValue(result, this.config.serverResponse.draw);
            if (responseDraw && responseDraw !== requestId) {
                console.warn('Response draw ID mismatch, ignoring stale response');
                return;
            }

            // Handle server response structure
            const data = this.getNestedValue(result, this.config.serverResponse.data);
            const total = this.getNestedValue(result, this.config.serverResponse.totalRecords);
            const error = this.getNestedValue(result, this.config.serverResponse.error);

            if (error) {
                throw new Error(error);
            }

            if (!Array.isArray(data)) {
                throw new Error('Server response data is not an array');
            }

            // Update internal state
            this.originalData = [...data];
            this.filteredData = [...data];
            this.totalRecords = typeof total === 'number' ? total : data.length;
            this.retryCount = 0; // Reset retry count on success
            
            // Debug logging for server-side data loading
            console.log('Server data loaded:', {
                dataLength: data.length,
                totalRecords: this.totalRecords,
                currentPage: this.currentPage,
                pageSize: this.config.pageSize
            });
            
            this.render();
            this.emit(EVENTS.SERVER_DATA_LOADED, { 
                data, 
                total: this.totalRecords,
                page: this.currentPage,
                search: this.searchTerm,
                sort: this.sortColumn,
                direction: this.sortDirection
            });

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request was cancelled');
                return;
            }

            console.error('Failed to load server data:', error);
            
            // Retry logic
            if (this.retryCount < this.config.ajax.retryAttempts) {
                this.retryCount++;
                console.log(`Retrying request (${this.retryCount}/${this.config.ajax.retryAttempts})...`);
                
                setTimeout(() => {
                    this.loadServerData();
                }, this.config.ajax.retryDelay * this.retryCount);
                return;
            }

            // Call error callback if provided
            if (this.config.ajax.error && typeof this.config.ajax.error === 'function') {
                this.config.ajax.error(error, this.currentPage, this.searchTerm);
            }

            this.emit(EVENTS.SERVER_ERROR, { 
                error: error.message,
                page: this.currentPage,
                search: this.searchTerm,
                sort: this.sortColumn,
                direction: this.sortDirection
            });

        } finally {
            this.isLoading = false;
            this.hideLoading();
            this.currentRequest = null;
            
            // Call complete callback if provided
            if (this.config.ajax.complete && typeof this.config.ajax.complete === 'function') {
                this.config.ajax.complete();
            }
            
            this.emit(EVENTS.SERVER_REQUEST_END, {
                page: this.currentPage,
                search: this.searchTerm,
                sort: this.sortColumn,
                direction: this.sortDirection
            });
        }
    }

    /**
     * Helper method to get nested values from server response
     * @param {Object} obj - Object to search in
     * @param {string} path - Dot-separated path to value
     * @returns {*} Value at path or null
     * @private
     */
    getNestedValue(obj, path) {
        if (!path || !obj) return obj;
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    /**
     * Helper method to flatten nested objects for URL parameters
     * @param {Object} obj - Object to flatten
     * @param {string} prefix - Prefix for keys
     * @returns {Object} Flattened object
     * @private
     */
    flattenObject(obj, prefix = '') {
        const flattened = {};
        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const newKey = prefix ? `${prefix}.${key}` : key;
                
                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    Object.assign(flattened, this.flattenObject(value, newKey));
                } else {
                    flattened[newKey] = value;
                }
            }
        }
        
        return flattened;
    }

    /**
     * Refresh server data (reload current page with current filters)
     * @returns {Promise<QMGrid>} Returns this for method chaining
     */
    async refresh() {
        if (this.config.serverSide) {
            await this.loadServerData();
        } else {
            this.applyFilters();
            this.render();
        }
        return this;
    }

    // Export functionality
    /**
     * Export table data to various formats
     * @param {string} format - Export format ('csv', 'excel', 'pdf', 'print')
     * @param {Object} options - Export options
     * @returns {QMGrid} Returns this for method chaining
     */
    exportData(format, options = {}) {
        const exportOptions = { ...this.config.exportOptions, ...options };
        const data = this.getExportData(exportOptions);
        
        switch (format.toLowerCase()) {
            case EXPORT_FORMATS.CSV:
                this.exportToCSV(data, exportOptions);
                break;
            case EXPORT_FORMATS.EXCEL:
                this.exportToExcel(data, exportOptions);
                break;
            case EXPORT_FORMATS.PDF:
                this.exportToPDF(data, exportOptions);
                break;
            case EXPORT_FORMATS.PRINT:
                this.printTable(data, exportOptions);
                break;
            default:
                console.warn(`Unsupported export format: ${format}`);
                return this;
        }
        
        this.emit(EVENTS.EXPORT, { format, options: exportOptions, data });
        return this;
    }

    /**
     * Get data for export based on options
     * @param {Object} options - Export options
     * @returns {Array} Export data
     * @private
     */
    getExportData(options) {
        let data;
        
        if (options.selectedOnly && this.selectedRows.size > 0) {
            // Export only selected rows
            data = Array.from(this.selectedRows).map(index => this.filteredData[index]).filter(Boolean);
        } else if (options.visibleOnly) {
            // Export only currently visible rows (current page)
            const startIndex = (this.currentPage - 1) * this.config.pageSize;
            const endIndex = startIndex + this.config.pageSize;
            data = this.filteredData.slice(startIndex, endIndex);
        } else {
            // Export all filtered data
            data = [...this.filteredData];
        }
        
        return data;
    }

    /**
     * Export to CSV format
     * @param {Array} data - Data to export
     * @param {Object} options - Export options
     * @private
     */
    exportToCSV(data, options) {
        const separator = options.csvSeparator || ',';
        const headers = this.config.columns.map(col => col.title);
        const rows = data.map(row => 
            this.config.columns.map(col => {
                let value = this.getCellValue(row, col.key);
                
                // Handle different data types
                if (col.type === 'date' && value) {
                    value = this.formatDateForExport(value, options.dateFormat);
                } else if (col.type === 'currency' && value !== null && value !== undefined) {
                    value = parseFloat(value) || 0;
                }
                
                // Escape CSV values
                value = String(value || '');
                if (value.includes(separator) || value.includes('"') || value.includes('\n')) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                
                return value;
            })
        );
        
        let csvContent = '';
        if (options.includeHeaders) {
            csvContent += headers.join(separator) + '\n';
        }
        csvContent += rows.map(row => row.join(separator)).join('\n');
        
        this.downloadFile(csvContent, `${options.filename}.csv`, 'text/csv');
    }

    /**
     * Export to Excel format (using HTML table method)
     * @param {Array} data - Data to export
     * @param {Object} options - Export options
     * @private
     */
    exportToExcel(data, options) {
        const headers = this.config.columns.map(col => col.title);
        const rows = data.map(row => 
            this.config.columns.map(col => {
                let value = this.getCellValue(row, col.key);
                
                if (col.type === 'date' && value) {
                    value = this.formatDateForExport(value, options.dateFormat);
                } else if (col.type === 'currency' && value !== null && value !== undefined) {
                    value = parseFloat(value) || 0;
                }
                
                return value || '';
            })
        );
        
        let excelContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <meta name="ProgId" content="Excel.Sheet">
                <meta name="Generator" content="QMGrid">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>${options.excelSheetName}</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                </style>
            </head>
            <body>
                <table>`;
        
        if (options.includeHeaders) {
            excelContent += '<thead><tr>';
            headers.forEach(header => {
                excelContent += `<th>${this.escapeHtml(header)}</th>`;
            });
            excelContent += '</tr></thead>';
        }
        
        excelContent += '<tbody>';
        rows.forEach(row => {
            excelContent += '<tr>';
            row.forEach(cell => {
                excelContent += `<td>${this.escapeHtml(String(cell))}</td>`;
            });
            excelContent += '</tr>';
        });
        excelContent += '</tbody></table></body></html>';
        
        this.downloadFile(excelContent, `${options.filename}.xls`, 'application/vnd.ms-excel');
    }

    /**
     * Export to PDF format (using HTML and print styles)
     * @param {Array} data - Data to export
     * @param {Object} options - Export options
     * @private
     */
    exportToPDF(data, options) {
        const headers = this.config.columns.map(col => col.title);
        const rows = data.map(row => 
            this.config.columns.map(col => {
                let value = this.getCellValue(row, col.key);
                
                if (col.type === 'date' && value) {
                    value = this.formatDateForExport(value, options.dateFormat);
                } else if (col.type === 'currency' && value !== null && value !== undefined) {
                    value = parseFloat(value) || 0;
                }
                
                return this.escapeHtml(String(value || ''));
            })
        );
        
        const pdfWindow = window.open('', '_blank');
        let pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${options.filename}</title>
                <style>
                    @page {
                        size: ${options.pdfPageSize} ${options.pdfOrientation};
                        margin: 1cm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        margin: 0;
                        padding: 0;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 20px;
                        font-size: 18px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 0 auto;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                        word-wrap: break-word;
                    }
                    th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    @media print {
                        body { print-color-adjust: exact; }
                        table { page-break-inside: auto; }
                        tr { page-break-inside: avoid; page-break-after: auto; }
                        th { page-break-after: avoid; }
                    }
                </style>
            </head>
            <body>
                <h1>${options.filename}</h1>
                <table>`;
        
        if (options.includeHeaders) {
            pdfContent += '<thead><tr>';
            headers.forEach(header => {
                pdfContent += `<th>${header}</th>`;
            });
            pdfContent += '</tr></thead>';
        }
        
        pdfContent += '<tbody>';
        rows.forEach(row => {
            pdfContent += '<tr>';
            row.forEach(cell => {
                pdfContent += `<td>${cell}</td>`;
            });
            pdfContent += '</tr>';
        });
        pdfContent += `
                </tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(() => window.close(), 1000);
                    };
                </script>
            </body>
            </html>`;
        
        pdfWindow.document.write(pdfContent);
        pdfWindow.document.close();
    }

    /**
     * Print table data
     * @param {Array} data - Data to print
     * @param {Object} options - Print options
     * @private
     */
    printTable(data, options) {
        const headers = this.config.columns.map(col => col.title);
        const rows = data.map(row => 
            this.config.columns.map(col => {
                let value = this.getCellValue(row, col.key);
                
                if (col.type === 'date' && value) {
                    value = this.formatDateForExport(value, options.dateFormat);
                } else if (col.type === 'currency' && value !== null && value !== undefined) {
                    value = parseFloat(value) || 0;
                }
                
                return this.escapeHtml(String(value || ''));
            })
        );
        
        const printWindow = window.open('', '_blank');
        let printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Print - ${options.filename}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        font-size: 12px;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 20px;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 0 auto;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    @media print {
                        body { margin: 0; }
                        table { page-break-inside: auto; }
                        tr { page-break-inside: avoid; page-break-after: auto; }
                        th { page-break-after: avoid; }
                    }
                </style>
            </head>
            <body>
                <h1>${options.filename}</h1>
                <table>`;
        
        if (options.includeHeaders) {
            printContent += '<thead><tr>';
            headers.forEach(header => {
                printContent += `<th>${header}</th>`;
            });
            printContent += '</tr></thead>';
        }
        
        printContent += '<tbody>';
        rows.forEach(row => {
            printContent += '<tr>';
            row.forEach(cell => {
                printContent += `<td>${cell}</td>`;
            });
            printContent += '</tr>';
        });
        printContent += `
                </tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>`;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
    }

    /**
     * Helper method to download file
     * @param {string} content - File content
     * @param {string} filename - File name
     * @param {string} mimeType - MIME type
     * @private
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    /**
     * Format date for export
     * @param {*} value - Date value
     * @param {string} format - Date format
     * @returns {string} Formatted date
     * @private
     */
    formatDateForExport(value, format) {
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return String(value);
            
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            switch (format) {
                case 'YYYY-MM-DD':
                    return `${year}-${month}-${day}`;
                case 'MM/DD/YYYY':
                    return `${month}/${day}/${year}`;
                case 'DD/MM/YYYY':
                    return `${day}/${month}/${year}`;
                default:
                    return date.toLocaleDateString();
            }
        } catch (error) {
            return String(value);
        }
    }

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     * @private
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Event system
    on(event, callback) {
        if (!this.events) this.events = {};
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (!this.events || !this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }

    emit(event, data) {
        if (!this.events || !this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }

    destroy() {
        // Cancel any pending server request
        if (this.currentRequest) {
            this.currentRequest.abort();
            this.currentRequest = null;
        }
        
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
        
        this.eventListeners.forEach(({ element, event, handler }) => {
            if (element && element.removeEventListener) {
                element.removeEventListener(event, handler);
            }
        });
        this.eventListeners.clear();
        
        this.originalData = [];
        this.filteredData = [];
        this.selectedRows.clear();
        this.events = {};
        this.isLoading = false;
        this.totalRecords = 0;
        this.retryCount = 0;
        
        if (this.container) {
            this.container.innerHTML = '';
            this.container.className = this.container.className.replace(/qmgrid-container/g, '').trim();
        }
        
        this.container = null;
        this.config = null;
    }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QMGrid;
} else if (typeof define === 'function' && define.amd) {
    define([], function() { return QMGrid; });
} else {
    window.QMGrid = QMGrid;
}