const express = require('express');

const router = express.Router();

const character = require("../models/characterModel");
const {addChar, getChar, getCharById, deleteChar} = require("../controller/characterController");

// the api must be able to add characters, and remove them.
router.post("/add", addChar);
router.get("/", getChar);
router.get("/:id", getCharById)
router.delete("/delete/:id", deleteChar)

module.exports = router;