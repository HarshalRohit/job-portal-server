var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const passport = require('passport');

const jobRouter = require('./routes/jobs');

const { loginHandler } = require('./auth/index')

const { connectToDb } = require('./services/db');

const app = express();

try {
  connectToDb();
} catch (error) {
  console.log('app.js dbConnect'); 
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

app.get('/status', (req, res) => {
  res.status(200).json({message: 'All Good!'}).end();
});
app.head('/status', (req, res) => {
  res.status(200).json({message: 'All Good!'}).end();
});

app.get('/login', loginHandler);

app.get('/protected',
  passport.authenticate('jwt', {session: false}),
  function(req, res){
    res.sendStatus(400);
  }
);

// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// It shows the real origin IP in the heroku or Cloudwatch logs
app.enable('trust proxy');

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

const corsOptions = {
  // origin: 'http://localhost:3000',
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) chok
};

app.use(cors(corsOptions));

app.use('/api/jobs', jobRouter);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

/// error handlers
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
    },
  });
});


module.exports = app;
