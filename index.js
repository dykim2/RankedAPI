const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

// routes 

const gameRoute = require('./routes/gameRoute');
const charRoute = require('./routes/characterRoute')
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/gameAPI', gameRoute);
app.use('/charAPI', charRoute);

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to the mongodb database");
    app.listen(PORT, () => console.log(`alive on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });

/*
 request structure:
 {
    players: []

 }

 notes: 
 for consistency, use the same player name
*/