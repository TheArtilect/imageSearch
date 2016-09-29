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

    //enter search query into database
    var query = function (db, callback){
      var searchObj = {
        search: params
      } //searchObj

      collection.insert(searchObj);

      res.json({
        ///////////////////////////////////////////put output here
      })
    }//query



    query(db, function (){
      console.log("Search query entered into database");
      db.close();
    })




  }) // mongo connect







}) //router.get

module.exports = router;
