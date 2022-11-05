const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');


const folderPath = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

fs.exists(newFolder, (exists) => {
  if (exists) {
    console.log(`Drectory 'files-copy' already exists`);
    rimraf(newFolder, () => {
      console.log(`Existing directory 'files-copy' was succsessfully deleted!`);
      createNewFolder()
    })
  }
  else {
    createNewFolder()
  }
})

function createNewFolder() {
  fs.mkdir(newFolder, {recursive: true}, err => {
    if (err) throw err;
    console.log(`New directory "files-copy" has been created!`);
    newFolderContent()
  })
}

function newFolderContent() {
  fs.readdir(folderPath, {withFileTypes: true}, (err, files) => {
    if (err) throw err;
    else {
      for (let file of files) {
        if (!file.isDirectory()) {
          const p = new Promise((resolve, reject) => {
            const currentFilePath = path.join(folderPath, file.name);
            const creatingFile = path.join(newFolder, file.name)
            const readStream = fs.createReadStream(currentFilePath)
            const writeStream = fs.createWriteStream(creatingFile);
            console.log(`Copying ${file.name}...`);
            readStream.on('readable', function() {
              const data = readStream.read();
              if (data != null) {
                writeStream.write(data)
              }
            })
          })
        }
      }
      console.log('All files are copied!')
    }
  })
}



