const mongoose = require('mongoose');
const characterSchema = mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: [true, "Please enter the character name"],
  },
  image: {
    type: String,
    required: true,
  },
  element: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("character", characterSchema);

// example:
/*
{
    "name": "Arlecchino",
    "image": "http://"
    "element": "Pyro",
    "role": "Carry",
    "description": "A heavy hitter of a pyro dps who cannot heal herself in battle. Dodging is really important on her to keep her bond of life active."
    "difficulty": 3,
    "limits": [0,1],
    "restrictions": ["no 5* or Battle Pass weapons", "no 5* or Battle Pass weapons at C1"]
}
*/