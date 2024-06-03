const game = require('../models/gameModel.js')
const asyncHandler = require("express-async-handler");
const character = require('../models/characterModel.js');
const boss = require('../models/bossModel.js');


const postGames = asyncHandler(async (req, res) => {
  // try to add the default pick / ban / boss

  try {
    // check for error
    let gameResult = {};
    if(req.body._id == -1){
      gameResult = -1; // specifically set gameResult to create a new game
    }
    else{
      gameResult = await game.findById(req.body._id);
    }
    if(gameResult){
      // will set id to be the next one
      let val = await latest();
      if(val != null){
        req.body._id = val._id + 1;
      }
      else{
        throw new Error("this should not happen. What are you doing that there is a game but no latest game?");
      }
    }
    
const defaultChar = await character.findById(-1);
const defaultBoss = await boss.findById(-1);
const aeonblight = await boss.findById(20);
    req.body.bosses = [
      aeonblight,
      defaultBoss,
      defaultBoss,
      defaultBoss,
      defaultBoss,
      defaultBoss,
      defaultBoss
    ];
    req.body.bans = [
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar
    ];
    req.body.pickst1 = [
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar
    ];
    req.body.pickst2 = [
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar,
      defaultChar
    ];
    const newGame = await game.create(req.body);
    if(typeof req.body.player != "undefined"){
      doUpdate(newGame, req, res);
      await newGame.save();
    }
    res.status(200).json([newGame, {message: "Game created successfully!"}]);
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(400);
    }
    throw new Error(err.message);
  }
});

const getGames = asyncHandler(async (req, res) => {
  try {
    const gameResult = await game.find({});
    // check if gameResult is empty
    res.status(200).json([gameResult, {message: "All games obtained successfully!"}]); // gets all the games available on the database
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
    const gameResult = await game.findById(id).lean();
    if(!gameResult){
       res.status(404);
       throw new Error(`unable to locate a game with id ${id}`);
    }
    res.status(200).json([gameResult, {message: `Game with id ${id} located successfully!`}]);
  } catch (err) {
    if (res.statusCode == 200) { // if an error happened, can't return the OK status code
      res.status(500);
    }
    throw new Error(err.message);
  }
});

const findActiveGames = asyncHandler(async (req, res) => {
  try{
    // find all games with the condition 
    const info = await game
      .find(
        {
          $or: [
            { result: "waiting" },
            { result: "Waiting" }, 
            { result: "setup" },
            { result: "progress" }
          ],
        },
        "_id result connected"
      )
      .exec();
    res.status(200).json([info, {message: "Active games successfully found!"}]);
  } 
  catch(err){
    if (res.statusCode == 200) {
      // if an error happened, can't return the OK status code
      res.status(500);
    }
    throw new Error(err.message);
  }
});

const findLatest = asyncHandler(async(req, res) => {
  try{
    const info = await latest();
    if(info == null){
      res.status(404).json({message: "There are no games currently available. Start with game 0!"})
    }
    else{
      res.status(200).json({id: info._id, message: "Search success!"});
    }
    
  }
  catch(err){
    if (res.statusCode == 200) {
      // if an error happened, can't return the OK status code
      res.status(500);
    }
    throw new Error(err.message);
  }
})

const latest = async() => {
  return await game.findOne().sort({ createdAt: -1 }).exec();
}

const updateGame = asyncHandler(async (req, res) => { // to update games, must submit id
  try {
    const { id } = req.params;
    /*
    // const resultGame = await game.updateMany({ $set: { longBoss: [false, false]} });
    // console.log(resultGame);
    // res.status(200).json({ message: "Game updated successfully!" });
    // return;
    */
    // verify body is not empty
    let updatedBody = req.body;
    let newSchema = [];
    if(typeof req.body.bosses != "undefined"){

    }
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

const doUpdate = (result, req, res) => {
  switch (req.body.player) {
    // verify the player count is valid
    // if it is not, returns a message saying it is invalid
    case "1":
      if (result.connected[0] >= 1) {
        // more than one person connected
        res
          .status(409)
          .json({
            error:
              "Someone else has already selected player 1! Please refresh and try again.",
          });
        return;
      }
      result.connected[0]++;
      break;
    case "2":
      if (result.connected[1] >= 1) {
        // more than one person connected
        res.status(409).json({
          message:
            "Someone else has already selected player 2! Please refresh and try again.",
        });
        return;
      }
      result.connected[1]++;
      break;
    case "ref":
      if (result.connected[2] >= 2) {
        // more than one person connected
        res.status(409).json({
          message:
            "Two people have already selected themselves to be refs! Please refresh and try again.",
        });
        return;
      }
      result.connected[2]++;
      break;
    default:
      res.status(400).json({ message: "Please enter a valid player!" });
      return;
  }
  return result;
}

const updatePlayers = asyncHandler(async(req, res)=> {
    // find a game, check the players, increment the existing values
  const {id} = req.params;
  const result = await game.findById(id);
  if(!doUpdate(result, req, res)){
    return;
  }
  await result.save();
  res.status(200).json({message: "Player selection success!"})
})

// update one boss' time per call
/*
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
*/

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
    findLatest,
    updateGame,
    // updateTimes,
    updatePlayers,
    findActiveGames,
    deleteGame
}