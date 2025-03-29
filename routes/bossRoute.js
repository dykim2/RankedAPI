const express = require("express");

const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const {addBoss, addManyBosses, getBosses, getBossById, deleteBoss, updateBoss, getLatestBoss, /* updateBossNoVerify */} = require("../controller/bossController");

router.post("/", addBoss);
router.post("/many", addManyBosses); // add many bosses at once
router.get("/all", getBosses);
router.get("/find/:id", getBossById);
router.get("/latest", getLatestBoss);
router.put("/:id", jsonParser, updateBoss);
// router.put("/noverify/:id", jsonParser, updateBossNoVerify);
router.delete("/:id", deleteBoss);

module.exports = router;