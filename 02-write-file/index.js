const fs = require('fs');
const path = require('path');

const textPath = path.join(__dirname, 'text.txt');
const { stdin, stdout, exit } = process;
const writeStream = fs.createWriteStream(textPath);

const greet = 'HEllo!! Enter your text here...\n';
const byeMsg = 'Good bye!!'

stdout.write(greet);

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    stdout.write(byeMsg);
    exit();
  }
  writeStream.write(data)
})

process.on('SIGINT', () => {
  stdout.write(byeMsg);
  exit();
})

