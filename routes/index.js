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



//  Need to get ajax request, add parameters
//  https://api.datamarket.azure.com/Bing/Search/

/*

var http = require('http');
var serviceRoot = 'http://services.odata.org/v4/TripPinServiceRW/';
getURL(serviceRoot + 'People('russellwhyte')');
function getURL(url) {
    var body = '';
    http.get(url, function (response) {
        response.on('data', function (chunk) {
            body+=chunk;
        });
        response.on('end', function () {
            console.log(body);
        });
    }).on('error', function(e) {
        console.log('ERROR: ' + e.message);
    });
}


*/







    var http = require("http");
    var serviceRoot = "https://api.datamarket.azure.com/Bing/Search/";  //chck this
    var query = params //something something
    function getImgs(url) {
      http.get(url, function(response){
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
