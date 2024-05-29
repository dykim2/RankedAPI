const express = require("express");

const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const {addBoss, getBosses, getBossById, deleteBoss, updateBoss, updateBossNoVerify} = require("../controller/bossController");

router.post("/", addBoss);
router.get("/all", getBosses);
router.get("/find/:id", getBossById);
router.put("/:id", jsonParser, updateBoss);
router.put("/noverify/:id", jsonParser, updateBossNoVerify);
router.delete("/:id", deleteBoss);

module.exports = router;