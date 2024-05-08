const character = require('../models/characterModel.js');
const asyncHandler = require("express-async-handler");

const addChar = asyncHandler(async (req, res) => {
  try {
    if (!verify(req.body)) {
      res.status(400);
      throw new Error("Please enter the necessary information in the body.");
    }
    const info = await character.create(req.body);
    // check that the body meets the very specific outlined requirements
    res.status(200).json({
      message: "Character created succesfully.",
      characterName: info.name,
    });
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});
const getChar = asyncHandler(async (req, res) => {
  try {
    const info = await character.find({});
    res.status(200).json(info);
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});

const getCharById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const info = await character.findById(id);
    if (!info) {
       res.status(404);
       throw new Error(`unable to locate a character with id ${id}`);
    }
    res.status(200).json(info);
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});
const deleteChar = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChar = await character.findByIdAndDelete(id);
    if (!deletedChar) {
      res.status(404);
      throw new Error(`unable to locate a character with id ${id}`);
    }
    res.status(200).json([deletedGame, { message: "deletion successful" }]);
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});
const verify = (body) => {
  // if the requirements are not met, rejects the request
  if (typeof body.name === "undefined" || body.name == "") {
    return false;
  }
  if (typeof body.element === "undefined" || body.element == "") {
    return false;
  }
  if (typeof body.description === "undefined" || body.description == "") {
    return false;
  }
  /*
        list of requirements: 
        1) must have a name
        2) must have an element
        3) must have a description
        4) must have an image link that matches the character name (i will upload them to github pages)
    */
  return true;
};
module.exports = {
    addChar,
    getChar,
    getCharById,
    deleteChar
}