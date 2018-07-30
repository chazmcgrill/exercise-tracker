const express = require('express');
const app = express();
const mongoose = require('mongoose');

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

// create a new user route
app.post('/exercise/new-user', (req, res) => {
  User.findOne({username: req.body.username}, (err, found) => {
    if (found) return res.json({error: "Username already exists"});

    const newUser = new User({username: req.body.username});
    newUser.save((err, data) => {
      if (err) return res.json({error: "Error Saving Username"});
      res.json(data);
    });
  })
});

// add exercises route
app.post('/exercise/add', (req, res) => {
  const { username, description, duration, date } = req.body;
  User.findOne({username: username}, (err, data) => {
    if (err) return res.json({error: "User Not Found"});
    const newExercise = new Exercise({
      username, description, duration, date
    });
    newExercise.save((err, data) => {
      if (err) return res.json({ error: "Error Saving Exercise" });
      res.json(data);
    });
  });
});

// get the exercises route
app.get('/exercise/log', (req, res) => {
  const {username} = req.query; 
  if (username) {
    User.findOne({ username }, (err, data) => {
      if (err) return res.json({error: "Invalid Username"});

      if (data) {
        let query = {username: req.query.username};
        if (req.query.from && req.query.to) {
          query.date = { $gte: new Date(req.query.from), $lte: new Date(req.query.to) } 
        } else if (req.query.from) {
          query.date = { $gte: new Date(req.query.from) }
        } else if (req.query.to) {
          query.date = { $lte: new Date(req.query.to) }
        }
  
        let limit = req.query.limit;
        if (req.query.limit) limit = Number(limit);
        
        Exercise.find(query).limit(limit).exec((err, data) => {
          if (err) return res.json({error: "error finding exercises"});
          res.json(data);
        });
      } else {
        return res.json({ error: "Invalid Username" });
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