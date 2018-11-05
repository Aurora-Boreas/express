var express = require('express');
var app = express();

app.get('/catalog', function (req, res) {
  res.send('Hello world');
})

app.listen(8079, function () {
  console.log('api app started');
})
