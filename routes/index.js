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
  console.log(params)

  var searching = params;
  var base = "https://www.googleapis.com/customsearch/v1?key="

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



/*
title: items[i].title
image url : items[i].link,
alt text : items[i].snippet,
page urls : items[i].image.contextLink



url
snippet
thumbnail
context




*/



/*
  function getImgs(link) {
    http.get(link, function(response){
      response.on("data", function(chunk){
        //do something with chunkData

      });
      response.on("end", function(){
        //do somehing at the end, i.e. console.log(body), after adding to it

      });
    }).on('error', function(e){
      console.log("ERROR: " + e.message)
    }) // https
  } //getImgs

*/

/*
DON"T NEED YET
  //This is for the database
  mongo.connect(mLab, function (err, db){
    if (err) throw err;
    console.log("connected, getting search term")

    var collection = db.collection("queries");
    var local = req.get("host");


    //enter search query into database
    var query = function (db, callback){
      var searchObj = {
        search: params
      } //searchObj

      collection.insert(searchObj);

      res.json({
        ///////////////////////////////////////////put output here
        "searhced for: ": params
      })
    }//query



    query(db, function (){
      console.log("Search query entered into database");
      db.close();
    })

  }) // mongo connect

  */







}) //router.get

module.exports = router;
