const express = require('express');
const app = express();
const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://localhost:27017/exercise-tracker';

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

// POST /api/exercise/new-user
app.post('/exercise/new-user', (req, res) => {

});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});