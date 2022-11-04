const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
  let output = [];
  if (err) throw err;
  else {
    for (let file of files) {
      if (!file.isDirectory()) {
        const p = new Promise((resolve, reject) => {
          const currentFilePath = path.join(folderPath, file.name);
          fs.stat(currentFilePath, (error, stats) => {
            if (error) throw error;
            const kylobytes = (stats.size / (2 ** 10)).toFixed(2);
            console.log(file.name,' -- ', file.name.split('.')[1],' -- ', `${kylobytes.toString()}kb`);
          })
        })
      }
    }
  }
})
