const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint to save HTML content to a file
app.post('/save', (req, res) => {
  const { html } = req.body;
  const date = new Date();
  const fileName = `save_${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}.html`;

  fs.writeFile(fileName, html, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving HTML content');
    } else {
      res.send('HTML content saved successfully');
    }
  });
});

// GET endpoint to retrieve the content of the file
app.get('/get', (req, res) => {
  fs.readFile('saved.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving HTML content');
    } else {
      res.send(data);
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});