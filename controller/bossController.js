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
          bossName: bossInfo.name,
        });
    }
    catch(err){
        if (res.statusCode == 200) {
            res.status(500);
        }
        throw new Error(err.message);
    }
})

const addManyBosses = asyncHandler(async(req, res) => {
    try{
      if(Array.isArray(req.body)){
        req.body.forEach(async (newBoss) => {
          if(!verifyBoss(newBoss, res, true, true, true)){
            console.log("bosses not verified.");
            return false;
          }
          await boss.create(newBoss);
        });
      }
      res.status(200).json({
        message: "Boss created succesfully!"
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
        // const info = await boss.find({}, 'boss icon');
        const info = await boss.find({});
        /*
        const compare = (a, b) => {
          if(a.boss.toLowerCase() > b.boss.toLowerCase()){
            return 1;
          }
          else if(a.boss.toLowerCase() < b.boss.toLowerCase()){
            return -1;
          }
          else{
            return 0;
          }
        }
        info.sort(compare);
        */
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
      throw new Error(`unable to locate a boss with id ${id}`);
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

const getLatestBoss = asyncHandler(async(req, res) => {
  const info = await latestBoss();
  res.status(200).json({
    message: "Latest boss successfully found!",
    latest: info
  });
})

const latestBoss = async() => {
  const info = await boss.find({}, "_id");
  return info[info.length - 1]._id;
}

const deleteBoss = asyncHandler(async(req, res) => {
    try {
      const { id } = req.params;
      /*
      for(let i = 5; i < 52; i++){
        await boss.findByIdAndDelete(i);
      }
      res.status(200).json({ message: "Deletion successful!" });
      return;
      */
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
    /*
      await boss.updateMany({}, {$set: {region: "Mondstadt"}}, {multi: true})
      res.status(200).json({ message: "Bossing update successful!" });
      return;
    */
    const { id } = req.params;
    let info = await boss.findById(id);
    // check for body.changed
    switch (req.body.changed) {
      case "boss": {
        if (!verifyBoss(req.body, res, true)) {
          return false;
        }
        info.boss = req.body.boss;
        break;
      }
      case "icon": {
        if (!verifyBoss(req.body, res, false, true)) {
          return false;
        }
        info.icon = req.body.icon;
        break;
      }
      case "type": {
        if (!verifyBoss(req.body, res, false, false, true)) {
          return false;
        }
        info.type = req.body.type;
        break;
      }
      case "region": {
        let regions = ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"];
        let found = false;
        let index = -1;
        for(let i = 0; i < regions.length; i++){
          if(req.body.region.toLowerCase() == regions[i].toLowerCase()){
            found = true;
            index = i;
            break;
          }
        }
        if(found){
          info.region = regions[index];
        }
        else{
          return false;
        }
        break;
      }
      default:
        throw new Error("Please enter a valid changed value.");
    }
    info.save();
    res
      .status(200)
      .json({ message: "Boss information successfully updated!" });
  } catch (err) {
    if (res.statusCode == 200) {
      res.status(500);
    }
    throw new Error(err.message);
  }
})

/*
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
*/

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
    addManyBosses,
    getBosses,
    getBossById,
    getLatestBoss,
    latestBoss,
    deleteBoss,
    updateBoss,
    // updateBossNoVerify
};