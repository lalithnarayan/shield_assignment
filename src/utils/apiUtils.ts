import { faker } from "@faker-js/faker"

export interface ApiParams {
  startDate: Date | null
  endDate: Date | null
  timezone: string
}

export interface TableData {
  id: string;
  name: string;
  date: string;
  amount: number;
  status: string;
  email: string;
  userID: string;
  score: number;
}

// Function to fetch data based on date range
export const fetchTableData = async (): Promise<TableData[]> => {
  try {

    // In a real implementation, you'd send a request with these parameters
    // For this demo, simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Return mock data
    return generateMockData()
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

// Function to format date with timezone
function formatDateWithTimezone(date: Date, timezone: string): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: timezone,
      hour12: false,
    }

    return new Intl.DateTimeFormat('en-US', options).format(date)
  } catch (error) {
    // Fallback if the timezone is not supported
    return date.toISOString()
  }
}

let currentId=1;
function generateFakeData() {
  return {
    name: faker.person.fullName(),
    date: faker.date.past().toISOString(),
    amount: faker.finance.amount({ min: 10, max: 1000, dec: 2 }),
    status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'failed']),
    email: faker.internet.email(),
    userID: faker.string.uuid(),
    score: faker.number.int({ min: 0, max: 100 }),
    id:currentId++,
  };
}
export const fakedata = faker.helpers.multiple(generateFakeData, {
  count: 50,
});


// Function to generate mock data
function generateMockData(): TableData[] {
  return fakedata
}

// Helper function for date formatting
function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
    2,
    '0',
  )}`
}
