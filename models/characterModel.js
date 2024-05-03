const mongoose = require('mongoose');
const characterSchema = mongoose.Schema({
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
  },
  role: { 
    type: String,
    default: "Support"
  },
  description: { // how is the character supposed to be played?
    type: String,
    default: "A character who does some form of thing."
  },
  difficulty: { // how hard are they to play, from 1 to 3. 3 is the hardest.
    type: Number,
    default: 1
  },
  limits: {
    type: [Number],
    default: [1,2] // highest constellation allowed for that division. should be an array of size 2 exactly, with numbers from 0-6, and in increasing order
}, 
  _id: String, // should be same as character name
  restrictions: {
    type: [String],
    default: ["none", "C1: signature"] // open, then advanced. Premiere never has restrictions. Should be an array of size 2 exactly.
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