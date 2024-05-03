const character = require('../models/characterModel.js')

const addChar = async (req, res) => {
  try {
    if (!verify(req.body)) {
      res
        .status(400)
        .json({
          message: "Please enter the necessary information in the body.",
        });
    }
    const info = await character.create(req.body);
    // check that the body meets the very specific outlined requirements
    res.status(200).json({
      message: "Character created succesfully.",
      characterName: info.name,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getChar = async (req, res) => {
  try {
    const info = await character.find({});
    res.status(200).json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCharById = async (req, res) => {
  try {
    const { id } = req.params;
    const info = await character.findById(id);
    if (!info) {
      return res
        .status(404)
        .json({ message: `unable to locate a character with id ${id}` });
    }
    res.status(200).json(info);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};
const deleteChar = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChar = await character.findByIdAndDelete(id);
    if (!deletedChar) {
      return res
        .status(404)
        .json({ message: `unable to locate a character with id ${id}` });
    }
    res.status(200).json([deletedGame, { message: "deletion successful" }]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};
const verify = (body) => {
  // if the requirements are not met, rejects the request
  if (typeof body.name === undefined || body.name == "") {
    return false;
  }
  if (typeof body.element === undefined || body.element == "") {
    return false;
  }
  if (typeof body.description === undefined || body.description == "") {
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