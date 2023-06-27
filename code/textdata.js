
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = 'C:/Users/senethg/Downloads/all submition/imags/studentdetails.xlsx';
const imageDirectory = 'C:\\Users\\senethg\\Downloads\\all submition\\photos';


// Read the Excel file
try {
   const workbook = XLSX.readFile(excelFilePath);
   const sheetName = workbook.SheetNames[0];
   const worksheet = workbook.Sheets[sheetName];

   // Convert the worksheet to JSON
   const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

   
  // Display the JSON data
  console.log(jsonData);

   // Read the contents of the directory
   fs.readdir(imageDirectory, (err, files) => {
     if (err) {
       console.error('Error reading directory:', err);
       return;
     }

     // Check if there are any image files in the directory
     const imageFiles = files.filter(file => {
       const extension = path.extname(file).toLowerCase();
       return extension === '.jpg' || extension === '.png' || extension === '.jpeg';
     });

     if (imageFiles.length > 0) {
       console.log('Successfully read image folder!');
       const filteredImages = [];

       imageFiles.forEach(file => {
         const imagePath = path.join(imageDirectory, file);
         fs.readFile(imagePath, (err, data) => {
           if (err) {
             console.error('Error reading image:', file, err);
             return;
           }

           // Image data (Buffer) is available in the `data` variable
           console.log('Image:', file);
           console.log('-----------------------------');
          

           const imageDetails = getImageDetails(file);

           // Check if the image details match any entry in the Excel data
           const matchingEntry = jsonData.find(entry => {
             const parentNIC = entry[0];
             const studentName = entry[2];
             return parentNIC === imageDetails.parentNIC && studentName === imageDetails.studentName;
           });

           if (matchingEntry) {
             filteredImages.push(file);
           }
         });
       });

       if (filteredImages.length > 0) {
         console.log('Filtered images:');
         filteredImages.forEach(imageName => {
           console.log(imageName);
         });
       } else {
         console.log('No matching images found.');
         console.log('******************************');
       }
     } else {
       console.log('No image files found in the folder.');
     }
   });

   // Display success message
   console.log('Excel file read successfully!');
} catch (error) {
   // Display error message if reading the file fails
   console.error('Error occurred while reading the Excel file:', error);
}

// Function to extract parent NIC and student name from the image filename
function getImageDetails(filename) {
  const regex = /^([0-9]+)-(.+)/;
  const match = filename.match(regex);
  if (match && match.length === 3) {
    return {
      parentNIC: match[1],
      studentName: match[2]
    };
  } else {
    return {
      parentNIC: '',
      studentName: ''
    };
  }
}
