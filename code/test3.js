
const XLSX = require('xlsx');

// Define the path to the Excel file
const excelFilePath = 'C:/Users/senethg/Downloads/all submition/imags/studentdetails.xlsx';

// Read the Excel file
try {
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
 
    // Convert the worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
 
    // Extract the desired data
    const filteredData = jsonData.map(row => {
      const parentNICNumber = row[7];
      const studentNameParts = row[4].split('. ');
      const studentName = studentNameParts.length > 1 ? studentNameParts[1] : studentNameParts[0];
      const lastData = row[row.length - 1];
 
      return {
        'Parent NIC Number': parentNICNumber,
        'Student Name': studentName,
        'Last Data': lastData
      };
    });
 
    // Display the filtered data
    console.log(filteredData);
 
    // Display success message
    console.log('Excel file read successfully!');
 } catch (error) {
    // Display error message if reading the file fails
    console.error('Error occurred while reading the Excel file:', error);
 }