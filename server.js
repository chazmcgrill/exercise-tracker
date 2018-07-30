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

const ExerciseSchema = new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now }
})

const User = mongoose.model('User', UserSchema);
const Exercise = mongoose.model('Exercise', ExerciseSchema);

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// create a new user
app.post('/exercise/new-user', (req, res) => {
  const newUser = new User({username: req.body.username});
  newUser.save((err, data) => {
    if (err) return res.json({error: "Error Saving Username"});
    res.json(data);
  });
});

// add exercises
app.post('/exercise/add', (req, res) => {
  const { username, description, duration, date } = req.body;
  User.findOne({username: username}, (err, data) => {
    if (err) return res.json({error: "User Not Found"});
    const newExercise = new Exercise({
      username: username, description: description, duration: duration, date: date
    });
    newExercise.save((err, data) => {
      if (err) return res.json({ error: "Error Saving Exercise" });
      res.json(data);
    });
  });
});

// get the exercises for user
app.get('/exercise/log', (req, res) => {
  if (req.query.username) {
    User.findOne({username: req.query.username}, (err, data) => {
      if (err) return res.json({error: "Invalid Username"});

      if (req.query.from || req.query.to) {
        let query = {username: req.query.username};
        if (req.query.from && req.query.to) {
          query.date = { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } 
        } else if (req.query.from) {
          query.date = { $gte: new Date(req.query.from) }
        } else {
          query.date = { $lte: new Date(req.query.to) }
        }

        limit = req.query.limit;
        if (req.query.limit) limit = Number(limit);
        
        Exercise.find(query).limit(limit).exec((err, data) => {
          if (err) return res.json({error: "date error"});
          res.json(data);
        });
      }
    });
  } else {
    res.json({error: "Username not provided"})
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});