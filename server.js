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

const User = mongoose.model('User', UserSchema);

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
})

// POST /api/exercise/new-user
app.post('/exercise/new-user', (req, res) => {
  const newUser = new User({username: req.body.username});
  newUser.save((err, data) => {
    if (err) return res.json({error: "Error Saving Username"});
    res.json(data);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});