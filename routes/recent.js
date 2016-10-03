var express = require('express');
var router = express.Router();

var mongo = require("mongodb").MongoClient;
var mLab = "mongodb://localhost:27017/imageSearch"

//get recent search queries

router.get('/', function(req, res, next) {

  mongo.connect(mLab, callback);

  function callback(err, db){
    if (err) throw err;

    var collection = db.collection("queries");

    collection.find({}, {search: 1, timeStamp: 1, _id: 0}).sort({_id:-1}).limit(10).toArray(function (err, doc){
      res.setHeader("Content-Type", "application/json");
      res.send(doc)
    }) //collection

    db.close()
  } //callback

}); // router

module.exports = router;
