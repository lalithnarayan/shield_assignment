Here is a sample README structure for your React application that includes both a Calendar and a Table Page component, as described in your assignment. This README will guide users through setting up, running the application, and understanding its features.

---

# React Calendar and Table Application

This React application showcases two main features: a customizable calendar and a dynamic table with sorting, searching, and filtering capabilities. Designed to demonstrate handling date selections with timezone adjustments and displaying tabular data with interactive functionalities.

## Features

### Calendar
- **Date Selection**: Users can select a date with restrictions, such as not being able to select dates past 90 days from the current date.
- **Timezone Support**: The calendar displays the selected date and time according to the specified timezone. Users can choose from predefined timezones.
- **Maximum Date Range**: Limits the user to select a maximum of 10 days. Attempts to select more will trigger a tooltip notification.
- **Date Messages and Restrictions**: Some dates come with predefined messages and can be disabled or enabled. Hovering over these dates will display the messages.

### Table Page
- **Data Display**: Displays data in a table format with columns such as Name, Date, Amount, and Status.
- **Sorting**: Users can sort data in ascending or descending order based on any column.
- **Search/Filter**: Includes a search functionality that allows filtering the table based on the values in specific columns.
- **Responsive Design**: Styled for clear readability and interaction across various devices and screen sizes.

## Technologies Used
- **React.js**: For building the user interface.
- **date-fns**: For date calculations and timezone adjustments.
- **Axios/Fetch API**: For making API calls to fetch table data.
- **CSS/SCSS**: For styling components.

## Setup and Installation
1. **Clone the repository**:
   ```
   git clone [(https://github.com/lalithnarayan/shield_assignment.git)]
   cd shield_assignment
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```
   This command runs the app in the development mode. Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

## Configuration
- **Timezone selection**: Modify the list of timezones by editing the `timezones` array in the `Calendar` component.
- **Max Days Allowed**: Adjust the maximum number of selectable days in the `Calendar` component configuration.

## Usage
- **Selecting Dates**: Click on the date to select a range. Hover over dates to see messages or restrictions.
- **Changing Timezone**: Use the dropdown in the calendar to select different timezones, which updates how dates are displayed.
- **Sorting and Searching Table**: Click on column headers to sort data. Use the search bar to filter results based on specific columns.


This README provides a comprehensive guide to help users understand and navigate your application effectively. Adjust paths, URLs, and specific instructions based on your actual repository and deployment setup.
