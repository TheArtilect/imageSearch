var express = require('express');
var router = express.Router();

var mongo = require("mongodb").MongoClient;
var mLab = "mongodb://localhost:27017/imageSearch"

//get recent search queries
/* GET users listing. */
router.get('/', function(req, res, next) {
  mongo.connect(mLab, function (err, db){
    if (err) throw err;
    console.log("connected, retrieving recent queries")

    var collection = db.collection("queries")

    var retrieve = function (db, callback){
      ///////////get most recent queries
    }
  })


  //res.send('respond with a resource');
});

module.exports = router;
