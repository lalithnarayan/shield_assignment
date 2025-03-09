import React, { useState, useEffect, useMemo } from 'react'
import { FaSortUp, FaSortDown, FaSort } from 'react-icons/fa'

export interface TableColumn {
  id: string
  label: string
  sortable: boolean
  searchable: boolean
  render?: (value: any, row: any) => React.ReactNode
}

export interface TableProps {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
}

type SortDirection = 'asc' | 'desc' | null

const Table: React.FC<TableProps> = ({ columns, data, loading = false }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: SortDirection
  }>({
    key: '',
    direction: null,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [searchColumn, setSearchColumn] = useState(columns.find((col) => col.searchable)?.id || '')

  const handleSort = (key: string) => {
    const column = columns.find((col) => col.id === key)
    if (!column || !column.sortable) return

    let direction: SortDirection = 'asc'

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'
      } else if (sortConfig.direction === 'desc') {
        direction = null
      }
    }

    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    let sortableData = [...data]

    // First apply search filtering
    if (searchTerm && searchColumn) {
      sortableData = sortableData.filter((item) => {
        const value = item[searchColumn]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase())
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchTerm)
        }
        return false
      })
    }

    // Then apply sorting
    if (sortConfig.key && sortConfig.direction) {
      sortableData.sort((a, b) => {
        const valueA = a[sortConfig.key]
        const valueB = b[sortConfig.key]

        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return sortableData
  }, [data, sortConfig, searchTerm, searchColumn])

  const renderSortIcon = (column: TableColumn) => {
    if (!column.sortable) return null

    if (sortConfig.key === column.id) {
      if (sortConfig.direction === 'asc') {
        return <FaSortUp className="inline ml-1" />
      } else if (sortConfig.direction === 'desc') {
        return <FaSortDown className="inline ml-1" />
      }
    }

    return <FaSort className="inline ml-1 text-gray-400" />
  }

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchColumn(e.target.value)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-48">
          <select
            value={searchColumn}
            onChange={handleSearchColumnChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {columns
              .filter((col) => col.searchable)
              .map((col) => (
                <option key={col.id} value={col.id}>
                  {col.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleSort(column.id)}
                >
                  <span className="flex items-center">
                    {column.label}
                    {renderSortIcon(column)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {column.render ? column.render(row[column.id], row) : row[column.id]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
