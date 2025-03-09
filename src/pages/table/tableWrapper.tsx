import React, { useEffect, useState } from 'react'
import Table, { TableColumn } from '@/components/table/table'
import { fetchTableData } from '@/utils/apiUtils'
import RangeSelect from '@/components/ui/calendar/calender'
import { format, getDate } from 'date-fns'
import { DateInfo } from '@/components/ui/calendar/useCalendar'

const App: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>()
  const [endDate, setEndDate] = useState<Date | null>()

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const [timezone, setTimezone] = useState<string>('UTC')
  const [tableData, setTableData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Define table columns
  const columns: TableColumn[] = [
    {
      id: 'id',
      label: 'ID',
      sortable: true,
      searchable: false,
    },
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      searchable: true,
    },
    {
      id: 'date',
      label: 'Date',
      sortable: true,
      searchable: true,
      render: (value) => format(new Date(value), 'dd-MM-yyyy HH:mm'),
    },
    {
      id: 'amount',
      label: 'Amount',
      sortable: true,
      searchable: false,
      render: (value) => `$${value}`,
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      searchable: true,
      render: (value) => {
        const statusColors: Record<string, string> = {
          Pending: 'bg-yellow-100 text-yellow-800',
          Completed: 'bg-green-100 text-green-800',
          Cancelled: 'bg-red-100 text-red-800',
          'In Progress': 'bg-blue-100 text-blue-800',
        }

        const colorClass = statusColors[value] || 'bg-gray-100 text-gray-800'

        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{value}</span>
      },
    },
  ]

  const handleRangeSelect = (
    start: Date,
    end: Date,
    daysSelected: number,
    disabledCount: number,
    tz: string
  ) => {
    // Create an array with all dates in the selected range.
    const range: Date[] = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      range.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDates(range);
    setTimezone(tz);
  };

  const disabledDates: DateInfo[] = [
    {
      date: new Date(new Date().getFullYear(), 2, 8), // Maha Shivratri
      message: "Maha Shivratri",
      disabled: true,
    },
    {
      date: new Date(new Date().getFullYear(), 2, 25), // Holi
      message: "Holi",
      disabled: true,
    },
    {
      date: new Date(new Date().getFullYear(), 2, 29), // Good Friday
      message: "Good Friday",
      disabled: true,
    },
  ];


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await fetchTableData()
        setTableData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setTableData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate, timezone])


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Data Dashboard</h1>

      <div className="mb-6">
        <h2 className="text-md font-semibold mb-3">Date Selection</h2>
        {JSON.stringify(selectedDates)}
        <RangeSelect
          dateInfo={disabledDates}
          numberOfMonths={1} disableWeekends
          onRangeSelect={handleRangeSelect}
          maxRangeDays={7}
          selected={selectedDates} 
          />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">Data Table</h2>
        <Table columns={columns} data={tableData} loading={loading} />
      </div>
    </div>
  )
}

export default App
