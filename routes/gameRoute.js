const express = require('express');

const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const {getGames, postGames, findGame, updateGame, updateTimes, deleteGame} = require('../controller/gameController')

router.post("/", postGames);

router.get("/", getGames);
router.get("/:id", findGame);
// edit game as a whole
router.put("/:id", jsonParser, updateGame);
// edit part of a game (namely, the times for each team)
router.put("/times/:id", jsonParser, updateTimes);

router.delete("/:id", deleteGame);

module.exports = router;