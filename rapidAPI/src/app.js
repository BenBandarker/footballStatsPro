const express = require('express');
const { fetchData } = require('./services/apiService');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.get('/data', async (req, res) => {
  try {
    const data = await fetchData('example-endpoint'); //have to replace 'example-endpoint' with the actual endpoint
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
