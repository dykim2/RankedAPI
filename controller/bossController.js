// a chunk simpler than the previous options
const boss = require("../models/bossModel");
const asyncHandler = require("express-async-handler");

const addBoss = asyncHandler(async(req, res) => {
    try{
        if(!verifyBoss(req.body, res, true, true, true)){
            return false;
        }
        const bossInfo = await boss.create(req.body);
        res.status(200).json({
          message: "Boss created succesfully!",
          characterName: bossInfo.name,
        });
    }
    catch(err){
        if (res.statusCode == 200) {
            res.status(500);
        }
        throw new Error(err.message);
    }
})

const getBosses = asyncHandler(async(req, res) => {
    try {
        const info = await boss.find({});
        res
          .status(200)
          .json([info, { message: "Bosses successfully found!" }]);
    } catch (err) {
      if (res.statusCode == 200) {
        res.status(500);
      }
      throw new Error(err.message);
    }
})

const getBossById = asyncHandler(async(req, res) => {
    try{
        const { id } = req.params;
        const info = await boss.findById(id);
        if (!info) {
          res.status(404);
          throw new Error(`unable to locate a character with id ${id}`);
        }
        res
          .status(200)
          .json([
            info,
            { message: `Boss with id ${id} obtained successfully!` },
          ]);
    }
    catch(err){
        if (res.statusCode == 200) {
          res.status(500);
        }
        throw new Error(err.message);
    }
})

const deleteBoss = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;
      const deletedBoss = await boss.findByIdAndDelete(id);
      if (!deletedBoss) {
        res.status(404);
      throw new Error(`unable to locate a boss with id ${id}`);
    }
    res.status(200).json([deletedBoss, { message: "Deletion successful!" }]);
    } catch (err) {
      if (res.statusCode == 200) {
        res.status(500);
      }
      throw new Error(err.message);
    }
})

const updateBoss = asyncHandler(async(req, res) => {
    try {
      const {id} = req.params;
      let info = await boss.findById(id);
      // check for body.changed
      switch(req.body.changed){
        case "boss":{
            if(!verifyBoss(req.body, res, true)){
                return false;
            }
            info.boss = req.body.boss;
            break;
        }
        case "icon":{
            if (!verifyBoss(req.body, res, false, true)) {
              return false;
            }
            info.icon = req.body.icon;
            break;
        }
        case "type":{
            if (!verifyBoss(req.body, res, false, false, true)) {
              return false;
            }
            info.type = req.body.type;
            break;
        }
        default:
            throw new Error("Please enter a valid changed value.")
      }
      info.save();
      res.status(200).json({message: "Boss information successfully updated!"})
    } catch (err) {
      if (res.statusCode == 200) {
        res.status(500);
      }
      throw new Error(err.message);
    }
})

const updateBossNoVerify = asyncHandler(async(req, res) => {
    try{
      const {id} = req.params;
      await boss.findByIdAndUpdate(id, req.body);
      res.status(200).json({message: "successful update!"})
    }
    catch(err){
      if (res.statusCode == 200) {
          res.status(500);
      }
      throw new Error(err.message);
    }
})

const verifyBoss = (body, res, checkBoss = false, checkIcon = false, checkType = false) => {
    // check that the body has a boss name, icon, and/or type
    if(checkBoss){   
        if(typeof body.boss == "undefined" || body.boss == ""){
            res.status(400);
            throw new Error("Please enter a boss option");
        }
    }
    if(checkIcon){
        if(typeof body.icon == "undefined" || body.icon == ""){
            res.status(400);
            throw new Error("Please enter an icon for the boss.");
        }
    }
    if(checkType) {
        if (typeof body.type == "undefined" || body.type == "") {
            res.status(400);
            throw new Error("Please enter a boss type.");
        }
        else{
            let types = ["normal", "weekly", "legend"];
            let found = false;
            types.forEach((type) => {
              if (body.type.toLowerCase() == type) {
                found = true;
                body.type = body.type.toLowerCase();
              }
            });
            if (!found) {
              res.status(400);
              throw new Error("Please enter a valid boss type.");
            }
        }
    }
    return true;
}

module.exports = {
    addBoss,
    getBosses,
    getBossById,
    deleteBoss,
    updateBoss,
    updateBossNoVerify
};