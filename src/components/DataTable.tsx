import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './DataTable.css';

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: Column[];
  data: any[];
  loading?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ title, columns, data, loading = false }) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp size={16} /> : 
        <ChevronDown size={16} />;
    }
    return null;
  };

  return (
    <div className="data-table-card">
      <div className="data-table-header">
        <h3 className="data-table-title">{title}</h3>
      </div>
      
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={`data-table-th ${column.sortable ? 'sortable' : ''}`}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <span className="data-table-th-content">
                    {column.title}
                    {column.sortable && getSortIcon(column.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="data-table-loading">
                  Loading...
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table-empty">
                  No data available
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => (
                <tr key={index} className="data-table-row">
                  {columns.map((column) => (
                    <td key={column.key} className="data-table-td">
                      {column.render ? 
                        column.render(record[column.key], record) : 
                        record[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
