const express = require('express');

const router = express.Router();
const {getGames, postGames, findGame, findLatest, updateGame, updatePlayers, undoActivePlayers, deleteGame, findActiveGames} = require('../controller/gameController')

router.post("/", postGames);

router.get("/all", getGames);
router.get("/find/:id", findGame);
router.get("/active", findActiveGames);
router.get("/latest", findLatest);

router.put("/players/:id", updatePlayers);
router.put("/players/remove/:id", undoActivePlayers);
// edit game as a whole
router.put("/game/:id", updateGame);
// edit part of a game (namely, the times for each team) - moved to websockets
// router.put("/times/:id", jsonParser, updateTimes);
router.delete("/:id", deleteGame);

module.exports = router;