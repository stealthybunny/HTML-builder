const path = require('path');
const fs = require('fs');


const pathToFile = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(pathToFile, {encoding: 'utf-8'});

stream.on('readable', function() {
  const data = stream.read();
  if (data != null) {
    const output = data.toString().trim()
    console.log(output)
  }
})