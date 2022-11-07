const fs = require('fs')
const path = require('path')

const templatePath = path.join(__dirname, 'template.html');
const projectDir = path.join(__dirname, 'project-dist');

fs.exists(projectDir, (exists) => {
  if (exists) {
    fs.promises.rm(projectDir, {recursive: true, force: true})
    .then(()=> {
      fs.promises.mkdir(projectDir, err => {
        if (err) throw err;
      })
      .then(()=>{
        HTMLcreator()
      })
    })
  }
  else {
    fs.mkdir(projectDir, err => {
      if (err) throw err;
      HTMLcreator()
    })
  }
})

function HTMLcreator() {
  fs.promises.readFile(templatePath, {encoding: 'utf-8'})
  .then((htmlTemplate) => {
    let templateContent = htmlTemplate;
    const re = /\{\{+[a-z]+\}\}/gi;
    const tagArr = htmlTemplate.match(re);
    for (let tag of tagArr) {
      const tagName = tag.slice(2,-2)
      const componentPath = path.join(__dirname, 'components', `${tagName}.html`);
      fs.promises.readFile(componentPath, {encoding: 'utf-8'})
      .then((component) => {
        templateContent = templateContent.replace(tag, component);
        fs.promises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), templateContent)
      })
    }
  })
  .then(() => {
    console.log('index.html has been created')
    mergeStyles();
    copyFolder();
  })
}



function mergeStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const projectDir = path.join(__dirname, 'project-dist', 'style.css');
  fs.readdir(stylesDir, {withFileTypes: true}, (err, files) => {
    if (err) {
      throw err;
    }
    for (let file of files) {
      if (file.isFile && file.name.split('.')[1] === 'css') {
          const readStream =  fs.createReadStream((path.join(stylesDir, file.name)), {encoding: 'utf-8'});
          const bundleStream = fs.createWriteStream(projectDir,{flags:'a'})
          readStream.on('data', data => {
            bundleStream.write(data);
        })
      }
    }
    console.log('style.css has been created')
  })
}



function copyFolder() {
  const folderPath = path.join(__dirname, 'assets');
  const newFolder = path.join(__dirname, 'project-dist', 'assets');

  fs.promises.rm(newFolder, {recursive:true, force: true})
  .then(() => {
    fs.promises.mkdir(newFolder, {recursive: true})
    .then(() => {
      copyFolderWithEntries(folderPath, newFolder);
    })
    .then(() => {
      console.log('assets have been copied');
      console.log('Page has been created')
    })
  })
}

function copyFolderWithEntries(oldPath, newPath) {
  const newFolder = newPath;
  const folderPath = oldPath;
  fs.promises.readdir(folderPath, {withFileTypes: true})
  .then((files) => {
    for (let file of files) {
      const currentFilePath = path.join(folderPath, file.name);
      const creatingFile = path.join(newFolder, file.name);
      if (!file.isDirectory()) {
        const readStream = fs.createReadStream(currentFilePath)
        const writeStream = fs.createWriteStream(creatingFile);
        // console.log(`Copying ${file.name}...`);
        readStream.on('readable', function() {
          const data = readStream.read();
          if (data != null) {
            writeStream.write(data)
          }
        })
      }
      else if (file.isDirectory()) {
        fs.mkdir(creatingFile, {recursive: true}, err => {
          if (err) throw err;
          copyFolderWithEntries(currentFilePath, creatingFile)
        })
      }
    }
  })
}
