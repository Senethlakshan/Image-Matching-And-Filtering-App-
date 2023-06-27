const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Define the path to the Excel file
const excelFilePath = 'C:/Users/senethg/Downloads/all submition/imags/studentdetails.xlsx';

// Define the path to the image folder
const imageDirectory = 'C:\\Users\\senethg\\Downloads\\all submition\\photos';

// Read the Excel file
try {
  const workbook = XLSX.readFile(excelFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the worksheet to JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Read the contents of the image directory
  fs.readdir(imageDirectory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Filter the image files
    const imageFiles = files.filter(file => {
      const extension = path.extname(file).toLowerCase();
      return extension === '.jpg' || extension === '.png' || extension === '.jpeg';
    });

    if (imageFiles.length > 0) {
      console.log('Successfully read image folder!');
      imageFiles.forEach(file => {
        const imagePath = path.join(imageDirectory, file);
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            console.error('Error reading image:', file, err);
            return;
          }

          // Image data (Buffer) is available in the `data` variable
          const imageDetails = getImageDetails(file);
          const matchingRow = jsonData.find(row => {
            const parentNICNumber = String(row[7]); // Convert to string
            const studentNameParts = row[4].split('. ');
            const studentName = studentNameParts.length > 1 ? studentNameParts[1] : studentNameParts[0];
            return (
              parentNICNumber.toLowerCase() === imageDetails.parentNIC.toLowerCase() &&
              studentName.toLowerCase() === imageDetails.studentName.toLowerCase()
            );
          });

          if (matchingRow) {
            console.log('Image:', file);
            console.log('-----------------------------');
            console.log('Parent NIC Number:', imageDetails.parentNIC);
            console.log('Student Name:', imageDetails.studentName);
            console.log('-----------------------------');
          }
        });
      });
    } else {
      console.log('No image files found in the folder.');
    }
  });

  // Function to extract Parent NIC Number and Student Name from the image filename
  function getImageDetails(filename) {
    const regex = /^1-(.+)\.jpg$/;
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

  // Display success message
  console.log('Excel file read successfully!');
} catch (error) {
  // Display error message if reading the file fails
  console.error('Error occurred while reading the Excel file:', error);
}
