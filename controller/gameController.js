const game = require('../models/gameModel.js')
const asyncHandler = require("express-async-handler");
const bossController = require("../controller/bossController.js");

const postGames = asyncHandler(async (req, res) => {
  const DEFAULT_BOSS = 16; // aeonblight is default boss
  // try to add the default pick / ban / boss
  // console.log("request")
  // console.log(req.body)
  req.body.fearless == "true" ? req.body.fearless = true : req.body.fearless = false;
  // console.log(req.body);
  const TOTAL_BANS = req.body.totalBans;
  const TOTAL_PICKS = 6;
  // be prepared to change this to 8, again 3 + 1
  try {
    // check for error
    let gameResult = {};
    if (req.body._id == -1) {
      gameResult = -1; // specifically set gameResult to create a new game
    } else {
      gameResult = await game.findById(req.body._id);
    }
    if (gameResult) {
      // will set id to be the next one
      let val = await latest();
      if (val != null) {
        req.body._id = val._id + 1;
      } else {
        // throw new Error("this should not happen. What are you doing that there is a game but no latest game?");
        req.body._id = 0;
      }
    }

    const defaultChar = -1;
    // replace this with -1
    const defaultBoss = -1;
    const newestBoss = await bossController.latestBoss();
    let bossList = [] // entering none for specific boss just means the standard none that is the default
    if(req.body.initialBosses){
      if (
        req.body.initialBosses[0] >= -1 &&
        req.body.initialBosses[0] <= newestBoss
      ) {
        const addBoss = req.body.initialBosses[0];
        bossList.push(addBoss);
      }
      if (req.body.initialBosses[0] == -2) {
        bossList.push(DEFAULT_BOSS);
      }
      if (
        req.body.initialBosses[1] >= -1 &&
        req.body.initialBosses[1] <= newestBoss
      ) {
        bossList.push(req.body.initialBosses[1]);
      }
    } 
    else{
      bossList.push(DEFAULT_BOSS);
    }
    let length = 7;
    if (req.body.division == "premier") {
      length = 9;
    }
    for(let i = bossList.length; i < req.body.bossCount + length; i++){
      bossList.push(defaultBoss);
    }
    // basically check if stuff is undefined, if it is defined then continue, if not then ignore
    
    // find a way to support 6 bosses, with a setting, also initially show a button at the bottom after pressing reg with custom settings
    req.body.bosses = bossList
    req.body.bans = [];
    req.body.pickst1 = [];
    req.body.pickst2 = []; 
    req.body.extrabans = [] // capping at 4
    req.body.logs = "";
    console.log("test test test test");
    for (
      let i = 0;
      i <
      Math.max(
        TOTAL_BANS,
        TOTAL_PICKS,
        req.body.extrabanst1 + req.body.extrabanst2
      );
      i++
    ) {
      if (i < TOTAL_BANS) {
        req.body.bans.push(defaultChar);
      }
      if (i < TOTAL_PICKS) {
        req.body.pickst1.push(defaultChar);
        req.body.pickst2.push(defaultChar);
      }
      if (i < req.body.extrabanst1 + req.body.extrabanst2) {
        req.body.extrabans.push(defaultChar);
      }
    }
    if(req.body.fearless){
      let fearlessBoss = []
      const thisGame = await game.findById(req.body.fearlessID);
      if(typeof thisGame != undefined){
        fearlessBoss.push(thisGame.bosses);
      }
      req.body.fearlessBosses = fearlessBoss;
    }
    else{
      req.body.fearlessBosses = [];
    }
    const newGame = await game.create(req.body);
    let currStatus = true;
    let verify = ""
    if (typeof req.body.player != "undefined") {
      verify = doUpdate(newGame, req, res);
      if(verify.includes("Please")){
        currStatus = false;
      }
      await newGame.save();
    }
    if(currStatus){
      res.status(200).json(newGame);
    }
    else{
      res.status(409).json({message: verify})
    }
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
    res.status(200).json(gameResult);
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
            { result: "progress" },
            { result: "boss" },
            { result: "extraban" },
            { result: "ban" },
            { result: "pick" }
          ],
        },
        "_id result connected"
      )
      .sort({_id: -1})
      .limit(25)
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

/*
const updateGame = asyncHandler(async (req, res) => { // to update games, must submit id
  try {
    const { id } = req.params;
    
    // const resultGame = await game.updateMany({ $set: { longBoss: [false, false]} });
    // console.log(resultGame);
    // res.status(200).json({ message: "Game stuffed successfully!" });
    // return;
    
    // verify body is not empty
    let updatedBody = req.body;
    let newSchema = [];
    if(typeof req.body.bosses != "undefined"){
      // need to implement
      for (let i = 0; i < req.body.bosses.length; i++) {
        // find a way to convert id to name
        const bossInfo = await boss.findById(req.body.bosses[i]); // must be in the form of an id - characters will be placed in order
        if (!bossInfo) {
          res.status(404);
          throw new Error(
            `unable to locate a boss with id ${req.body.bosses[i]}`
          );
        }
        newSchema.push(bossInfo);
      }
    }
    if(newSchema.length != 0){
      updatedBody.bosses = newSchema;
      newSchema = [];
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
*/

const doUpdate = (result, req) => {
  console.log("player: "+req.body.player)
  switch (req.body.player) {
    // verify the player count is valid
    // if it is not, returns a message saying it is invalid
    case "1":
      if (result.connected[0] >= 1) {
        // more than one person connected
        return "Someone else has already selected player 1! Please refresh and try again."
      }
      result.connected[0]++;
      break;
    case "2":
      if (result.connected[1] >= 1) {
        // more than one person connected
        return "Someone else has already selected player 2! Please refresh and try again.";
      }
      result.connected[1]++;
      break;
    case "Ref":
    case "Ref (Custom)":
      if (result.connected[2] >= 3) {
        // more than two person connected 
        return "Three people have already selected themselves to be refs! Please refresh and try again.";
      }
      result.connected[2]++;
      break;
    default:
      return "Please enter a valid player!";
  }
  return "No problems.";
}

const updatePlayers = asyncHandler(async(req, res)=> {
    // find a game, check the players, increment the existing values
  const {id} = req.params;
  const result = await game.findById(id);
  if(!doUpdate(result, req, res)){
    res.status(400).json({message: "Please choose a valid player!"});
  }
  await result.save();
  res.status(200).json({message: "Player selection success!", totalBans: result.totalBans})
})

const getBanInfo = asyncHandler(async(req, res) => {
  const { id } = req.params;
  const result = await game.findById(id);
  if(!result){
    res.status(400).json({ message: "Please choose a valid game!" });
  }
  else{
     res.status(200).json({message: "Ban info obtained!", totalBans: result.totalBans})
  }
})

const undoActivePlayers = asyncHandler(async(req, res) => {
  const { id } = req.params;
  const result = await game.findById(id);
  switch (req.body.player) {
    // verify the player count is valid
    // if it is not, returns a message saying it is invalid
    case "1":
      if (result.connected[0] > 0) {
        result.connected[0]--;
      }
      break;
    case "2":
      if (result.connected[1] > 0) {
        result.connected[1]--;
      }
      break;
    case "Ref":
    case "Ref (Custom)":
      if (result.connected[2] > 0) {
        result.connected[2]--;
      }
      break;
  }
  await result.save();
  res.status(200).json({ message: "Player removal success!" });
})

const getConnections = asyncHandler(async(req, res) => {
  const {id} = req.params;
  const result = await game.findById(id);
  if(!result){
    res.status(400).json({message: "Please choose a valid game!"});
  }
  else{
    res.status(200).json({message: "Connection info obtained!", connected: result.connected});
  }
})

const removeLogs = asyncHandler(async(req, res) => {
  const {id} = req.params;
  const result = await game.findById(id);
  result.log = "";
  await result.save();
  res.status(200).json({message: `Log for game ${id} purged!`});
})

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

const deleteRange = asyncHandler(async (req, res) => {
  
  try {
    for(let i = req.body.low; i <= req.body.high; i++){
      await game.findByIdAndDelete(i);
    }
    res.status(200).json({ message: "deletion of game range from " + req.body.low + " to " + req.body.high + " successful" });
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
    
   res.status(200).json({message: "Operation successful!"});
})

module.exports = {
    getGames,
    postGames,
    findGame,
    findLatest,
    // updateGame,
    updatePlayers,
    getBanInfo,
    undoActivePlayers,
    findActiveGames,
    getConnections,
    removeLogs,
    deleteGame,
    deleteRange
}