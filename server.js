const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`App listening on port ${app.get('port')}`);
});
