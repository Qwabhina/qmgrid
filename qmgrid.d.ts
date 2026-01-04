/**
 * QMGrid TypeScript Definitions
 * 
 * @fileoverview Type definitions for QMGrid data table component with server-side processing support
 * @author Qwabhina McFynn
 * @version 2.0.0
 * @license MIT
 */

declare module 'qmgrid' {
  /**
   * Server-side AJAX configuration interface
   * @interface AjaxConfig
   */
  export interface AjaxConfig {
    /** Server endpoint URL */
    url: string;
    /** HTTP method */
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
    /** Request headers */
    headers?: Record<string, string>;
    /** Request timeout in milliseconds */
    timeout?: number;
    /** Number of retry attempts on failure */
    retryAttempts?: number;
    /** Delay between retry attempts in milliseconds */
    retryDelay?: number;
    /** Function to transform request parameters */
    data?: (params: ServerRequestParams) => any;
    /** Function called before sending request */
    beforeSend?: (data: any, params: ServerRequestParams) => boolean | void;
    /** Function called after request completion */
    complete?: () => void;
    /** Function called on request error */
    error?: (error: Error, page: number, search: string) => void;
  }

  /**
   * Server response configuration interface
   * @interface ServerResponseConfig
   */
  export interface ServerResponseConfig {
    /** Path to data array in response */
    data?: string;
    /** Path to total records count in response */
    totalRecords?: string;
    /** Path to error message in response */
    error?: string;
    /** Path to request identifier in response */
    draw?: string;
  }

  /**
   * Server request parameters interface
   * @interface ServerRequestParams
   */
  export interface ServerRequestParams {
    /** Current page number */
    page: number;
    /** Number of items per page */
    pageSize: number;
    /** Search term */
    search: string;
    /** Sort column key */
    sortBy: string | null;
    /** Sort direction */
    sortDir: 'asc' | 'desc';
    /** Request identifier */
    draw?: number;
  }
  /**
   * Column configuration interface
   * @interface Column
   */
  export interface Column {
    /** Column data key (supports dot notation for nested properties) */
    key: string;
    /** Column header title */
    title: string;
    /** Column width (CSS value) */
    width?: string;
    /** Whether column is sortable */
    sortable?: boolean;
    /** Data type for formatting */
    type?: 'text' | 'date' | 'currency' | 'number';
    /** CSS class name for column cells */
    className?: string;
    /** Custom render function for cell content */
    render?: (value: any, row: any, index: number) => string | number;
  }

  /**
   * QMGrid configuration interface
   * @interface QMGridConfig
   */
  export interface QMGridConfig {
    /** Array of data objects */
    data?: any[];
    /** Array of column configurations */
    columns: Column[];
    /** Enable pagination */
    pagination?: boolean;
    /** Number of rows per page */
    pageSize?: number;
    /** Enable column sorting */
    sortable?: boolean;
    /** Enable filtering */
    filterable?: boolean;
    /** Enable search functionality */
    searchable?: boolean;
    /** Enable row selection */
    selectable?: boolean;
    /** Allow multiple row selection */
    multiSelect?: boolean;
    /** Enable responsive design */
    responsive?: boolean;
    /** Enable striped rows */
    striped?: boolean;
    /** Enable table borders */
    bordered?: boolean;
    /** Enable hover effects */
    hover?: boolean;
    /** Show loading state */
    loading?: boolean;
    /** Message when no data available */
    emptyMessage?: string;
    /** Enable server-side processing */
    serverSide?: boolean;
    /** Server-side AJAX configuration */
    ajax?: AjaxConfig;
    /** Server response structure configuration */
    serverResponse?: ServerResponseConfig;
    /** Enable export functionality */
    exportable?: boolean;
    /** Theme setting ('light' or 'dark') */
    theme?: 'light' | 'dark';
    /** Export configuration options */
    exportOptions?: {
      /** Default export filename */
      filename?: string;
      /** Include column headers in export */
      includeHeaders?: boolean;
      /** Export only selected rows */
      selectedOnly?: boolean;
      /** Export only visible rows */
      visibleOnly?: boolean;
      /** Date format for exports */
      dateFormat?: string;
      /** CSV field separator */
      csvSeparator?: string;
      /** PDF page orientation */
      pdfOrientation?: 'portrait' | 'landscape';
      /** PDF page size */
      pdfPageSize?: string;
      /** Excel worksheet name */
      excelSheetName?: string;
    };
    /** Localization strings */
    language?: {
      /** Search label */
      search?: string;
      /** Length menu template */
      lengthMenu?: string;
      /** Info template */
      info?: string;
      /** Empty info template */
      infoEmpty?: string;
      /** Filtered info template */
      infoFiltered?: string;
      /** Pagination labels */
      paginate?: {
        first?: string;
        previous?: string;
        next?: string;
        last?: string;
      };
      /** Export labels */
      export?: {
        csv?: string;
        excel?: string;
        pdf?: string;
        print?: string;
      };
    };
  }

  /**
   * Event data interface
   * @interface EventData
   */
  export interface EventData {
    [key: string]: any;
  }

  /**
   * Event callback function type
   * @callback EventCallback
   */
  export type EventCallback = (data: EventData) => void;

  /**
   * QMGrid main class
   * @class QMGrid
   */
  export class QMGrid {
    /** Container element */
    container: HTMLElement | null;
    /** Grid configuration */
    config: QMGridConfig;
    /** Current page number */
    currentPage: number;
    /** Current sort column */
    sortColumn: string | null;
    /** Current sort direction */
    sortDirection: 'asc' | 'desc';
    /** Current search term */
    searchTerm: string;
    /** Set of selected row indices */
    selectedRows: Set<number>;
    /** Filtered data array */
    filteredData: any[];
    /** Original data array */
    originalData: any[];
    /** Server-side total records count */
    totalRecords: number;
    /** Current server request loading state */
    isLoading: boolean;

    /**
     * Create a new QMGrid instance
     * @param selector CSS selector string or DOM element
     * @param options Configuration options
     */
    constructor(selector: string | HTMLElement, options?: QMGridConfig);

    // Core methods
    /**
     * Initialize the grid
     */
    init(): void;
    
    /**
     * Render the grid
     */
    render(): void;
    
    /**
     * Clean up and remove the grid
     */
    destroy(): void;

    // Data management (with method chaining)
    /**
     * Set new data for the grid
     * @param data Array of data objects
     * @returns Returns this for method chaining
     */
    setData(data: any[]): QMGrid;
    
    /**
     * Add a new row to the grid
     * @param row Row data object
     * @returns Returns this for method chaining
     */
    addRow(row: any): QMGrid;
    
    /**
     * Remove a row from the grid
     * @param index Row index to remove
     * @returns Returns this for method chaining
     */
    removeRow(index: number): QMGrid;
    
    /**
     * Update an existing row
     * @param index Row index to update
     * @param newData New data to merge with existing row
     * @returns Returns this for method chaining
     */
    updateRow(index: number, newData: any): QMGrid;

    // Search and filtering (with method chaining)
    /**
     * Search through grid data
     * @param term Search term
     * @returns Returns this for method chaining
     */
    search(term: string): QMGrid;
    
    /**
     * Sort grid by column
     * @param column Column key to sort by
     * @param direction Sort direction
     * @returns Returns this for method chaining
     */
    sort(column: string, direction?: 'asc' | 'desc'): QMGrid;

    // Pagination
    /**
     * Navigate to specific page
     * @param page Page number
     */
    goToPage(page: number): void;
    
    /**
     * Change rows per page
     * @param size Number of rows per page
     */
    setPageSize(size: number): void;

    // Selection
    /**
     * Select or deselect a row
     * @param index Row index
     * @param selected Whether to select or deselect
     */
    selectRow(index: number, selected: boolean): void;
    
    /**
     * Select or deselect all rows
     * @param selected Whether to select or deselect all
     */
    selectAll(selected: boolean): void;
    
    /**
     * Get array of selected row data
     * @returns Array of selected rows
     */
    getSelectedRows(): any[];
    
    /**
     * Clear all row selections
     */
    clearSelection(): void;

    // UI state
    /**
     * Show loading overlay
     */
    showLoading(): void;
    
    /**
     * Hide loading overlay
     */
    hideLoading(): void;

    // Theme management
    /**
     * Set the theme for the grid
     * @param theme Theme name ('light' or 'dark')
     */
    setTheme(theme: 'light' | 'dark'): void;
    
    /**
     * Get the current theme
     * @returns Current theme ('light' or 'dark')
     */
    getTheme(): 'light' | 'dark';
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme(): void;

    /**
     * Refresh data (reload from server or reapply filters)
     * @returns Promise that resolves to this for method chaining
     */
    refresh(): Promise<QMGrid>;

    // Export functionality
    /**
     * Export grid data to various formats
     * @param format Export format ('csv', 'excel', 'pdf', 'print')
     * @param options Export options
     * @returns Returns this for method chaining
     */
    exportData(format: 'csv' | 'excel' | 'pdf' | 'print', options?: {
      filename?: string;
      includeHeaders?: boolean;
      selectedOnly?: boolean;
      visibleOnly?: boolean;
      dateFormat?: string;
      csvSeparator?: string;
      pdfOrientation?: 'portrait' | 'landscape';
      pdfPageSize?: string;
      excelSheetName?: string;
    }): QMGrid;

    // Events
    /**
     * Add event listener
     * @param event Event name
     * @param callback Event callback function
     */
    on(event: string, callback: EventCallback): void;
    
    /**
     * Remove event listener
     * @param event Event name
     * @param callback Event callback function
     */
    off(event: string, callback: EventCallback): void;
    
    /**
     * Emit event
     * @param event Event name
     * @param data Event data
     */
    emit(event: string, data: EventData): void;

    // Helper methods
    /**
     * Get cell value from row data
     * @param row Row data object
     * @param key Property key (supports dot notation)
     * @returns Cell value
     */
    getCellValue(row: any, key: string): any;
    
    /**
     * Apply current filters to data
     */
    applyFilters(): void;
  }

  export default QMGrid;
}

declare global {
  interface Window {
    QMGrid: typeof import('qmgrid').QMGrid;
  }
}