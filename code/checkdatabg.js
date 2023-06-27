const XLSX = require('xlsx');

// Define the path to the Excel file
const excelFilePath = 'C:/Users/senethg/Downloads/all submition/imags/bigstudent.xlsx';

// Read the Excel file
try {
  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the worksheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Display the JSON data
  console.log(jsonData);

  // Display success message
  console.log('Excel file read successfully!');
} catch (error) {
  // Display error message if reading the file fails
  console.error('Error occurred while reading the Excel file:', error);
}


