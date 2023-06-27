const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Define the path to the Excel file
const excelFilePath = 'C:/Users/senethg/Downloads/all submition/imags/bigstudent.xlsx';

// Define the image directory and the filtered image directory
const pdfDirectory = 'C:\\Users\\senethg\\Downloads\\all submition\\\pdfdata';
const filteredPdfDirectory = 'C:\Users\senethg\Downloads\art';



// Read the Excel file
try {
  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the worksheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Read the contents of the PDF directory
  const files = fs.readdirSync(pdfDirectory);

  // Filter the PDF files based on the Excel data
  const filteredPdfFiles = files.filter(file => {
    const extension = path.extname(file).toLowerCase();
    return extension === '.pdf';
  }).filter(file => {
    const pdfDetails = getPdfDetails(file);
    const parentNICNumber = pdfDetails.parentNIC;
    const studentName = pdfDetails.studentName;

    return jsonData.some(row => {
      return row[7] === parentNICNumber && row[4] === studentName;
    });
  });

  if (filteredPdfFiles.length > 0) {
    console.log('Matching PDF files:');

    // Create the filtered PDF directory if it doesn't exist
    if (!fs.existsSync(filteredPdfDirectory)) {
      fs.mkdirSync(filteredPdfDirectory);
    }

    filteredPdfFiles.forEach((file, index) => {
      const pdfPath = path.join(pdfDirectory, file);
      console.log('PDF File:', file);
      console.log('-----------------------------');
      const pdfDetails = getPdfDetails(file);
      console.log('Parent NIC Number:', pdfDetails.parentNIC);
      console.log('Student Name:', pdfDetails.studentName);
      console.log('*****************************************************');

      // Copy the filtered PDF to the filtered PDF directory
      const sourcePath = path.join(pdfDirectory, file);
      const destinationPath = path.join(filteredPdfDirectory, file);
      fs.copyFileSync(sourcePath, destinationPath);

      // Check if it's the last PDF file read
      if (index === filteredPdfFiles.length - 1) {
        console.log('Last PDF file count:', index + 1);
      }
    });
  } else {
    console.log('No matching PDF files found.');
  }
} catch (error) {
  // Display error message if reading the file fails
  console.error('Error occurred while reading the Excel file:', error);
}

// Function to extract Parent NIC Number and Student Name from the PDF filename
function getPdfDetails(filename) {
  const regex = /^\d+-(.+)\.pdf$/;
  const match = filename.match(regex);
  if (match && match.length === 2) {
    const fullName = match[1];
    const parts = fullName.split('-');
    const parentNIC = parts[0];
    const studentName = parts.slice(1).join(' ');
    return {
      parentNIC: parentNIC,
      studentName: studentName
    };
  } else {
    return {
      parentNIC: '',
      studentName: ''
    };
  }
}
