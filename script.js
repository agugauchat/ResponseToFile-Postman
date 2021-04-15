const express = require('express'),
  app = express(),
  fs = require('fs'),
  shell = require('shelljs'),

   // Modify the folder path in which responses need to be stored
  folderPath = './Responses/',
  defaultFileExtension = 'json',
  bodyParser = require('body-parser'),
  DEFAULT_MODE = 'writeFile',
  path = require('path');

// Create the folder path in case it doesn't exist
shell.mkdir('-p', folderPath);

 // Change the limits according to your response size
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); 

app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.post('/write', (req, res) => {
  let extension = req.body.fileExtension || defaultFileExtension,
    fsMode = req.body.mode || DEFAULT_MODE,
    filename = `${req.body.requestName}${req.body.identifier || ''}`,
    filePath = `${path.join(folderPath, filename)}.${extension}`,
    options = req.body.options || undefined;

  if (extension == 'pdf') {
    fs.writeFile(filePath, req.body.responseData, {encoding: 'base64'}, function(err) {
      console.log('File created');
      res.send('Success');
  });
  } else {
    fs[fsMode](filePath, req.body.responseData, options, (err) => {
      if (err) {
        console.log(err);
        res.send('Error');
      }
      else {
        res.send('Success');
      }
    });
  }
});

app.listen(3000, () => {
  console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
});