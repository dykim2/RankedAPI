const game = require('../models/gameModel.js')

const postGames = async (req, res) => {
  try {
    const info = await game.create(req.body);
    res.status(200).json(info);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const getGames = async (req, res) => {
  try {
    const games = await game.find({});
    res.status(200).json(games); // gets all the games available on the database
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const findGame = async (req, res) => {
  try {
    const { id } = req.params;
    const games = await game.findById(id);
    res.status(200).json(games);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    // verify body is not empty
    const result = await game.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res
        .status(404)
        .json({ message: `unable to locate a game with id ${id}` });
    }
    res.status(200).json(await game.findById(id));
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
}

const updateTimes = async(req, res) => {
    try {
        const {id} = req.params;
        const body = req.body;
        let index = 0;
        const gameResult = await game.findById(id);
        if(!gameResult){
            return res
              .status(404)
              .json({ message: `unable to locate a game with id ${id}` });
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
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
}

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await game.findByIdAndDelete(id);
    if (!deletedGame) {
      return res
        .status(404)
        .json({ message: `unable to locate a game with id ${id}` });
    }
    res.status(200).json([deletedGame, { message: "deletion successful" }]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    getGames,
    postGames,
    findGame,
    updateGame,
    updateTimes,
    deleteGame
}