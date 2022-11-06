const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');

fs.exists(newFolder, (exists) => {
  if (exists) {
    console.log(`Drectory 'files-copy' already exists`);
    fs.promises.rm(newFolder, {recursive:true})
    .then(()=> {
      console.log(`Existing folder 'filse-copy' has been deleted`)
      createNewFolder()
    })
  }
  else {
    createNewFolder()
  }
})

function createNewFolder() {
  console.log('Start copying....')
  fs.mkdir(newFolder, {recursive: true}, err => {
    if (err) throw err;
    console.log('New folder has been created')
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
      console.log(`All files (${files.length}) have been copied in 'files-copy'!`)
    }
  })
}



