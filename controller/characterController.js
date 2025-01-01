const character = require('../models/characterModel.js');
const boss = require("../models/bossModel.js");
const asyncHandler = require("express-async-handler");

const addChar = asyncHandler(async (req, res) => {
  try {
    if (!verify(req.body, res)) {
      res.status(400);
      throw new Error("Please enter the necessary information in the body.");
    }
    const info = await character.create(req.body);
    // check that the body meets the very specific outlined requirements
    res.status(200).json({
      message: "Character created succesfully!",
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
    const otherInfo = await boss.find({});
    let newInfo = JSON.parse(JSON.stringify(otherInfo));
    newInfo = newInfo.map(moreInfo => moreInfo.icon);
    // console.log(newInfo);
    const compare = (char1, char2) => {
      if (char1.name.toLowerCase() > char2.name.toLowerCase()) {
        return 1;
      }
      else if(char1.name.toLowerCase() < char2.name.toLowerCase()) {
        return -1;
      }
      else{
        return 0;
      }
    }
    info.sort(compare);
    res.status(200).json([info, {message: "Character successfully obtained!"}]);
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
    res.status(200).json([info, {message: `Character with id ${id} obtained successfully!`}]);
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
    res.status(200).json([deletedChar, { message: "Deletion successful!" }]);
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
});
const updateChar = asyncHandler(async (req, res) => {
  // update every character to have a rarity / weapon / region
  try{
    /*
      await character.updateMany({}, {$set: {rarity: 4}}, {multi: true})
      res.status(200).json({ message: "Character update successful!" });
      return;
    */
    const {id} = req.params;
    if (!verifyElement(req.body, res)) {
      res.status(400);
      throw new Error("Please enter the necessary information in the body.");
    }
    await character.findByIdAndUpdate(id, req.body).lean();
    res.status(200).json({message: "Character update successful!"});
  } catch(err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
})
const verify = (body, res) => {
  // if the requirements are not met, rejects the request
  if (typeof body.name === "undefined" || body.name == "") {
    res.status(400);
    throw new Error("Please enter a valid name.")
  }
  /*
        list of requirements: 
        1) must have a name
        2) must have an image link that matches the character name (i will upload them)
        3) must have an element so text can be colored accordingly on display
    */
  return verifyElement(body, res);
};
const verifyElement = (body, res) => {
  if (typeof body.element !== "undefined" && body.element != "") {
    // verify the element is valid, if one is specified - if none is specified, gives the OK
    const elements = [
      "anemo",
      "hydro",
      "dendro",
      "electro",
      "pyro",
      "cryo",
      "geo",
      "physical"
    ];
    let elem = body.element;
    if (!elements.includes(elem) && (body.name != undefined && body.name.toLowerCase() != "traveler")) { // not one of the 7 elements, and not the traveller
      res.status(400);
      throw new Error(
        "Please specify a valid element. Make sure the element name is in lowercase only."
      );
    }
    if ((body.name != undefined && body.name.toLowerCase() == "traveler") && body.element != "variable") { 
      // special case: just for traveler - the only accepted traveler element is "variable"
      res.status(400);
      throw new Error(
        "Please specify a valid element. Make sure the element name is in lowercase only."
      );
    }
  }
  
  return true;
};
module.exports = {
    addChar,
    getChar,
    getCharById,
    deleteChar,
    updateChar
}