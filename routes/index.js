var express = require('express');
var router = express.Router();
var https = require("https")
var bl = require('bl')

var mongo = require("mongodb").MongoClient;
var mLab = "mongodb://localhost:27017/imageSearch"
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Search', author: "Ian Agpawa" });

});


//search for


router.get("/:term", function (req, res, next) {

  var params = req.params.term;
  var time = new Date().toString();

  var searching = params;
  var base = "https://www.googleapis.com/customsearch/v1?key="
  var keyCX = 
  var q = '&q='+ searching +'&searchType=image'
  var url = base + keyCX + q

  https.get(url, function (response) {
    response.setEncoding('utf8');

    response.pipe(bl(function(err, data) {
      var json = JSON.parse(data);
      var items = json.items
      for (var i = 0; i < items.length; i++){
        var title = items[i].title;
        var url = items[i].link;
        var snippet = items[i].snippet;
        var page = items[i].image.contextLink;

        console.log({
          Title: title,
          imageUrl: url,
          altText: snippet,
          pageUrl: page
        })
      }
    }));

  }).on('error', function (e){
    console.log("ERROR: " + e.message)
  })


  //This is for the database
  mongo.connect(mLab, function (err, db){
    if (err) throw err;
    console.log("connected, mongo")

    var collection = db.collection("queries");
    var local = req.get("host");



    //enter search query into database
    var query = function (db, callback){
      var searchObj = {
        search: params,
        timeStamp: time
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
