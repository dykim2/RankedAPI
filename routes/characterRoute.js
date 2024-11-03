const express = require('express');

const router = express.Router();
const {addChar, getChar, getCharById, deleteChar, updateChar, updateRestrictions} = require("../controller/characterController");

// the api must be able to add characters, and remove them.
router.post("/add", addChar);
router.get("/", getChar);
router.get("/:id", getCharById)
router.put("/:id", updateChar)
router.put("/restrictions/:id", updateRestrictions)
router.delete("/delete/:id", deleteChar)

module.exports = router;