const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
