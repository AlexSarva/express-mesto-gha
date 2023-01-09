const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use('/films', require('./routes/users'));
// app.use('/directors', require('./routes/cards'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {

});
