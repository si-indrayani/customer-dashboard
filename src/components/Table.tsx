import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Pagination from './Pagination';
import './Table.css';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  defaultSortKey?: string;
  defaultSortOrder?: 'asc' | 'desc';
  defaultItemsPerPage?: number;
  showPagination?: boolean;
  className?: string;
}

type SortOrder = 'asc' | 'desc' | null;

const Table = <T extends Record<string, any>>({
  columns,
  data,
  title,
  loading = false,
  emptyMessage = 'No data available',
  defaultSortKey,
  defaultSortOrder = 'asc',
  defaultItemsPerPage = 10,
  showPagination = true,
  className = '',
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey || null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortKey ? defaultSortOrder : null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey || !sortOrder) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortOrder === 'asc' ? result : -result;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const result = aValue - bValue;
        return sortOrder === 'asc' ? result : -result;
      }

      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        const result = aValue.getTime() - bValue.getTime();
        return sortOrder === 'asc' ? result : -result;
      }

      // Convert to string and compare
      const aStr = String(aValue);
      const bStr = String(bValue);
      const result = aStr.localeCompare(bStr);
      return sortOrder === 'asc' ? result : -result;
    });
  }, [data, sortKey, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = showPagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  const handleSort = (columnKey: string) => {
    if (!columns.find(col => col.key === columnKey)?.sortable) return;

    if (sortKey === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortKey(null);
        setSortOrder(null);
      } else {
        setSortOrder('asc');
      }
    } else {
      setSortKey(columnKey);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const getSortIcon = (columnKey: string) => {
    if (sortKey !== columnKey) {
      return <ArrowUpDown size={14} className="sort-icon" />;
    }
    return sortOrder === 'asc' ? 
      <ArrowUp size={14} className="sort-icon active" /> : 
      <ArrowDown size={14} className="sort-icon active" />;
  };

  const renderCell = (column: TableColumn<T>, row: T, rowIndex: number) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row, rowIndex);
    }
    
    return value;
  };

  if (loading) {
    return (
      <div className={`table-container ${className}`}>
        {title && <h3 className="table-title">{title}</h3>}
        <div className="table-loading">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      {title && <h3 className="table-title">{title}</h3>}
      
      {data.length === 0 ? (
        <div className="table-empty">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`table-header ${column.sortable ? 'sortable' : ''} ${
                        column.align ? `align-${column.align}` : 'align-left'
                      }`}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="table-header-content">
                        <span>{column.title}</span>
                        {column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="table-row">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`table-cell ${
                          column.align ? `align-${column.align}` : 'align-left'
                        }`}
                      >
                        {renderCell(column, row, rowIndex)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedData.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Table;
