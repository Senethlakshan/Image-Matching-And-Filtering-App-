const fs = require('fs');
const path = require('path');

const imageDirectory = 'C:\\Users\\senethg\\Downloads\\all submition\\photos';


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
    imageFiles.forEach((file, index) => {
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
        console.log('Parent NIC Number:', imageDetails.parentNIC);
        console.log('Student Name:', imageDetails.studentName);
        console.log('-----------------------------');

        // Check if it's the last image read
        if (index === imageFiles.length - 1) {
          console.log('Last image count:', index + 1);
        }
      });
    });
  } else {
    console.log('No image files found in the folder.');
  }
});

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