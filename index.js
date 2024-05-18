const express = require('express');
require("dotenv").config();
const mongoose = require("mongoose");
const errorMiddleware = require('./middleware/errorMiddleware')
const cors = require('cors');

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

// routes 

const gameRoute = require('./routes/gameRoute');
const charRoute = require('./routes/characterRoute')
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use('/gameAPI', gameRoute);
app.use('/charAPI', charRoute);
app.get('/', (req, res, next) => {
  try{
    res.send("Welcome to RankedAPI! If you need help, documentation is available.")
  }
  catch(err){
    next(err);
  }
})
app.use(errorMiddleware);
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to the mongodb database");
    app.listen(PORT, () => console.log(`alive on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });

