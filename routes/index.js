var express = require('express');
var router = express.Router();
var https = require("https")
var bl = require('bl')

var mongo = require("mongodb").MongoClient;
var mLab = process.env.IMAGEDB;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Search', author: "Ian Agpawa" });
});


//search for


router.get("/search/:term", function (req, res, next) {

  var term = req.params.term;

  //get starting index
  function ind(n){
    return ((n - 1) * 10) + 1
  }

  var page = ind(req.query.offset);


  //Ignore annoying favicon request and doesn't get logged into queries
  if (term === 'favicon.ico'){
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    console.log('favicon requested');
    return;
  }

  var time = new Date().toString();

  var base = "https://www.googleapis.com/customsearch/v1?key="
  var start = (page || 1);
  var q = '&q='+ term +'&searchType=image&start=' + start;
  var url = base + process.env.KEYCX + q;


  https.get(url, function (response) {
    response.setEncoding('utf8');

    response.pipe(bl(function(err, data) {
      if (err) throw err;
      var results = [];
      var json = JSON.parse(data);
      if (json.error){
        res.send(json.error)
        //res.send(json.error.errors.reason + " : " + json.error.errors.message);
      } else {
        var items = json.items;
        for (var i = 0; i < items.length; i++){
          var title = items[i].title;
          var url = items[i].link;
          var snippet = items[i].snippet;
          var page = items[i].image.contextLink;

          var result = {
            Title: title,
            imageUrl: url,
            snippet: snippet,
            pageUrl: page
          }

          results.push(result)
        } // for

        res.setHeader("Content-Type", "application/json");
        res.send(results)
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

    //enter search query into database
    var query = function (db, callback){
      var searchObj = {
        search: term,
        timeStamp: time
      } //searchObj
      collection.insert(searchObj);
    }//query

    query(db, function (){
      db.close();
    })
    console.log("Search query entered into database");
  }) // mongo connect

}) //router.get


module.exports = router;
