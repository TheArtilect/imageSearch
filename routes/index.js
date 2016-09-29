var express = require('express');
var router = express.Router();

var mongo = require("mongodb").MongoClient;
var mLab = "mongodb://localhost:27017/imageSearch"
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Search', author: "Ian Agpawa" });
});


//search for
router.get("/:term", function (req, res, next) {
  mongo.connect(mLab, function (err, db){
    if (err) throw err;
    console.log("connected, getting search term")

    var collection = db.collection("queries");
    var params = req.params.term

    var local = req.get("host");
    console.log(params)
  })
})

module.exports = router;
