const game = require('../models/gameModel.js')
const asyncHandler = require("express-async-handler");
const character = require('../models/characterModel.js');

const postGames = asyncHandler(async (req, res) => {
  try {
    const gameResult = await game.create(req.body);
    res.status(200).json(gameResult);
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});

const getGames = asyncHandler(async (req, res) => {
  try {
    const gameResult = await game.find({});
    // check if gameResult is empty
    res.status(200).json(gameResult); // gets all the games available on the database
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});

const findGame = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const gameResult = await game.findById(id);
    if(!gameResult){
       res.status(404);
       throw new Error(`unable to locate a game with id ${id}`);
    }
    res.status(200).json(gameResult);
  } catch (err) {
    if (res.statusCode == 200) { // if an error happened, can't return the OK status code
      res.status(500);
    }
    throw new Error(err.message);
  }
});

const updateGame = asyncHandler(async (req, res) => { // to update games, must submit id
  try {
    const { id } = req.params;
    // verify body is not empty
    let updatedBody = req.body;
    let newSchema = [];
    if(typeof req.body.bans != "undefined"){
      // verify characters
      for(let i = 0; i < req.body.bans.length; i++){
        // find a way to convert id to name
        const charInfo = await character.findById(req.body.bans[i]); // must be in the form of an id - characters will be placed in order
        if(!charInfo){
          res.status(404);
          throw new Error(
            `unable to locate a character with id ${req.body.bans[i]}`
          );
        }
        newSchema.push(charInfo);
      }
    }
    if (newSchema.length != 0) {
      updatedBody.bans = newSchema;
      newSchema = [];
    }
    if(typeof req.body.pickst1  != "undefined"){
      for (let i = 0; i < req.body.pickst1.length; i++) {
        const charInfo = await character.findById(req.body.pickst1[i]);
        if (!charInfo) {
          res.status(404);
          throw new Error(
            `unable to locate a character with id ${req.body.pickst1[i]}`
          );
        }
        newSchema.push(charInfo);
      }
    }
    if (newSchema.length != 0) {
      updatedBody.pickst1 = newSchema;
      newSchema = [];
    }
    if (typeof req.body.pickst2 != "undefined") {
      for (let i = 0; i < req.body.pickst2.length; i++) {
        const charInfo = await character.findById(req.body.pickst2[i]);
        if (!charInfo) {
          res.status(404);
          throw new Error(
            `unable to locate a character with id ${req.body.pickst2[i]}`
          );
        }
        newSchema.push(charInfo);
      }
    }
    if (newSchema.length != 0) {
      updatedBody.pickst2 = newSchema;
      newSchema = [];
    }
    const result = await game.findByIdAndUpdate(id, updatedBody);
    if (!result) {
      res.status(404);
      throw new Error(`unable to locate a game with id ${id}`);
    }
    res.status(200).json({message: "Game updated successfully!"});
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message, err.stack);
  }
});

// update one boss' time per call
// will deprecate and remove soon, replace the code with more organized code
const updateTimes = asyncHandler(async(req, res) => {
    try {
      const {id} = req.params;
      const body = req.body;
      let index = 0;
      const gameResult = await game.findById(id);
      if(!gameResult){
          res.status(404);
          throw new Error(`unable to locate a game with id ${id}`);
      }
      let result = null;
      let request = "";
      // simplify this code down
      if(typeof body.timest1 !== "undefined"){
        if(body.timest1.length != 2){
          res.status(400);
          throw new Error("Unable to process request. Please ensure your array size is accurate.")
        }
        if(Number.isInteger(body.timest1[0]) == false){
          res.status(400);
          throw new Error(
            "Unable to process request. Please ensure your boss choice is accurate."
          );
        }
          index = body.timest1[1];
          result = gameResult.timest1;
          if(result.length <= index){
            res.status(400);
            throw new Error(
              "Unable to process request. Please ensure your boss choices are accurate."
            );
          }
          result[index] = body.timest1[0];
          request = JSON.stringify({
              timest1: result
          })
        await game.findByIdAndUpdate(id, request)
        res.status(200).json({message: "Times updated successfully."});
      }
      else if(typeof body.timest2 !== "undefined"){
        if (body.timest2.length != 2) {
          res.status(400);
          throw new Error(
            "Unable to process request. Please ensure your array size is accurate."
          );
        }
        if (Number.isInteger(body.timest2[0]) == false) {
          res.status(400);
          throw new Error(
            "Unable to process request. Please ensure your boss choice is accurate."
          );
        }
          index = body.timest2[1];
          result = gameResult.timest2;
          if (result.length <= index) {
            res.status(400);
            throw new Error(
              "Unable to process request. Please ensure your boss choices are accurate."
            );
          }
          result[index] = body.timest2[0];
          request = JSON.stringify({
              timest2: result,
          });
          await game.findByIdAndUpdate(id, request);
          res.status(200).json({ message: "Times updated successfully." });
      }
      else{
          res.status(400).json({message: "Please choose either team 1 or team 2 to update."})
      }
        
        // 
    } catch (err) {
        if (!res.statusCode) {
          res.status(500);
        }
        throw new Error(err.message);
    }
});

const deleteGame = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await game.findByIdAndDelete(id);
    if (!deletedGame) {
      res.status(404);
      throw new Error(`unable to locate a game with id ${id}`);
    }
    res.status(200).json([deletedGame, { message: "deletion successful" }]);
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});

module.exports = {
    getGames,
    postGames,
    findGame,
    updateGame,
    updateTimes,
    deleteGame
}