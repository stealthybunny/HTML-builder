const path = require('path');
const fs = require('fs');
const {stdin, stdout} = process;

const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist', 'bundle.css');

const bundleStream = fs.createWriteStream(projectDir)

fs.readdir(stylesDir, {withFileTypes: true}, (err, files) => {
  if (err) {
    throw err;
  }
  for (let file of files) {
    if (file.isFile && file.name.split('.')[1] === 'css') {
      console.log(file.name)
      new Promise((resolve, reject) => {
       const readStream =  fs.createReadStream((path.join(stylesDir, file.name)), {encoding: 'utf-8'});
       const bundleStream = fs.createWriteStream(projectDir,{flags:'a'})
        // fs.createWriteStream()
        readStream.on('data', data => {
          // console.log(data)
          bundleStream.write(data);
        })
      })
     
    }
  }
})
