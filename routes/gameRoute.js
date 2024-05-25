const express = require('express');

const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const {getGames, postGames, findGame, updateGame, deleteGame, findActiveGames} = require('../controller/gameController')

router.post("/", postGames);

router.get("/all", getGames);
router.get("/find/:id", findGame);
router.get("/active", findActiveGames)
// edit game as a whole
router.put("/:id", jsonParser, updateGame);
// edit part of a game (namely, the times for each team) - moved to websockets
// router.put("/times/:id", jsonParser, updateTimes);
router.delete("/:id", deleteGame);

module.exports = router;