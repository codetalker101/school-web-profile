const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const pool = require('./services/database/db')
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const methodOverride = require('method-override');

const app = express();

dotenv.config({ path: 'config.env' });

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(
  session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true, // Automatically creates the session table if it doesn't exist
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Add user to res.locals
  next();
});

// load assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + "/assets"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// load router
app.use("/", require("./services/routes/router"))

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// path to config.env
dotenv.config({ path: 'config.env' });

// listening to port
const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server connected to port ${PORT}`)
})

