const game = require('../models/gameModel.js')
const asyncHandler = require("express-async-handler");

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

const updateGame = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    // verify body is not empty
    const result = await game.findByIdAndUpdate(id, req.body);
    if (!result) {
      res.status(404);
      throw new Error(`unable to locate a game with id ${id}`);
    }
    res.status(200).json(await game.findById(id));
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});

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
        if(typeof body.timest1 !== undefined){
            index = body.timest1[1];
            result = gameResult.timest1;
            console.log(result);
            result[index] = body.timest1[0];
            request = {
                timest1: result
            }
            console.log(request);
            console.log(await game.findByIdAndUpdate(id, request));
            res.status(200).json({message: "Times updated successfully."});
        }
        else if(typeof body.timest2 !== undefined){
            index = body.timest2[1];
            result = gameResult.timest2;
            console.log(result);
            result[index] = body.timest2[0];
            request = {
                timest2: result,
            };
            console.log(request);
            console.log(await game.findByIdAndUpdate(id, request));
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