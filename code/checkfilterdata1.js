const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Define the path to the Excel file
const excelFilePath = 'C:/Users/senethg/Downloads/all submition/imags/studentdetails.xlsx';

// Define the image directory and the filtered image directory
const imageDirectory = 'C:\\Users\\senethg\\Downloads\\all submition\\photos';
const filteredImageDirectory = 'C:\Users\senethg\Downloads\art';


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

    // Filter the image files based on the Excel data
    const filteredImages = files.filter(file => {
      const extension = path.extname(file).toLowerCase();
      return extension === '.jpg' || extension === '.png' || extension === '.jpeg';
    }).filter(file => {
      const imageDetails = getImageDetails(file);
      const parentNICNumber = imageDetails.parentNIC;
      const studentName = imageDetails.studentName;

      return jsonData.some(row => {
        return row[7] === parentNICNumber && row[4] === studentName;
      });
    });

    if (filteredImages.length > 0) {
      console.log('Matching images:');
      
      // Create the filtered image directory if it doesn't exist
      if (!fs.existsSync(filteredImageDirectory)) {
        fs.mkdirSync(filteredImageDirectory);
      }

      filteredImages.forEach((file, index) => {
        const imagePath = path.join(imageDirectory, file);
        console.log('Image:', file);
        console.log('-----------------------------');
        const imageDetails = getImageDetails(file);
        console.log('Parent NIC Number:', imageDetails.parentNIC);
        console.log('Student Name:', imageDetails.studentName);
        console.log('**************************************************');

        // Copy the filtered image to the filtered image directory
        const sourcePath = path.join(imageDirectory, file);
        const destinationPath = path.join(filteredImageDirectory, file);
        fs.copyFile(sourcePath, destinationPath, (err) => {
          if (err) {
            console.error('Error copying image:', file, err);
          }
        });

        // Check if it's the last image read
        if (index === filteredImages.length - 1) {
          console.log('Last image count:', index + 1);
        }
      });
    } else {
      console.log('No matching images found.');
    }
  });
} catch (error) {
  // Display error message if reading the file fails
  console.error('Error occurred while reading the Excel file:', error);
}

// Function to extract Parent NIC Number and Student Name from the image filename
function getImageDetails(filename) {
  const regex = /^\d+-(.+)\.jpg$/;
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
