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

  //Ignore annoying favicon request and doesn't get logged into queries
  if (params === 'favicon.ico'){
    res.writeHead(200, {'Content-Type': 'image/x-icon'} );
    res.end();
    console.log('favicon requested');
    return;
  }


  var time = new Date().toString();


  var searching = params;
  var base = "https://www.googleapis.com/customsearch/v1?key="
  var q = '&q='+ searching +'&searchType=image'
  var url = base + process.env.KEYCX + q

  https.get(url, function (response) {
    response.setEncoding('utf8');

    response.pipe(bl(function(err, data) {
      if (err) throw err;
      var results = [];
      var json = JSON.parse(data);
      var items = json.items
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

    }//query



    query(db, function (){
      console.log("Search query entered into database");
      db.close();
    })

  }) // mongo connect



}) //router.get



/*

[{"Title":"Jets Wire","imageUrl":"https://usatjetswire.files.wordpress.com/2016/01/jetswireicon2.png","snippet":"Jets Wire","pageUrl":"http://jetswire.usatoday.com/"},{"Title":"Dassault/Dornier Alpha Jet - Wikipedia, the free encyclopedia","imageUrl":"https://upload.wikimedia.org/wikipedia/commons/d/dc/French_Alpha_Jet_1988.jpg","snippet":"Six French Alpha Jets of the ...","pageUrl":"https://en.wikipedia.org/wiki/Dassault/Dornier_Alpha_Jet"},{"Title":"NFL Team Preview: New York Jets - Good if it Goes","imageUrl":"http://goodifitgoes.com/wp-content/uploads/2016/08/nyj.jpg","snippet":"nyj","pageUrl":"http://goodifitgoes.com/nfl/nfl-team-preview-new-york-jets/"},{"Title":"New York Jets Football News, Schedule, Roster, Stats","imageUrl":"https://cdn1.vox-cdn.com/uploads/blog/sbnu_logo/166/large_ganggreennation.com.full.69101.png","snippet":"New York Jets Football News, ...","pageUrl":"http://www.sbnation.com/nfl/teams/new-york-jets"},{"Title":"Winnipeg Jets - Wikipedia, the free encyclopedia","imageUrl":"https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Winnipeg_Jets_Logo_2011.svg/1945px-Winnipeg_Jets_Logo_2011.svg.png","snippet":"Winnipeg Jets","pageUrl":"https://en.wikipedia.org/wiki/Winnipeg_Jets"},{"Title":"Madden 16 - New York Jets Playbooks | Madden Daily","imageUrl":"https://maddendaily.com/wp-content/uploads/2015/08/nfl-jets.png","snippet":"Madden 16 - New York Jets ...","pageUrl":"https://maddendaily.com/madden-16-new-york-jets-playbooks/"},{"Title":"all about jets by gubb0016","imageUrl":"http://8dd4d2aa9263c5094bdf-9f7114a943e0980c1bc96778d91d93b7.r3.cf2.rackcdn.com/ba9cc2d539024cacb339d9e089690f06.jpg","snippet":"all about jets by gubb0016","pageUrl":"https://www.haikudeck.com/all-about-jets-uncategorized-presentation-9XB7tWXN33"},{"Title":"New_York_Jets2.jpg","imageUrl":"http://www.myfantasysportstalk.com/wp-content/uploads/2015/03/New_York_Jets2.jpg","snippet":"new ork jets","pageUrl":"http://www.mooseintl.org/5movhay-new-ork-jets-fanshop"},{"Title":"General Dynamics F-16 Fighting Falcon - Wikipedia, the free ...","imageUrl":"https://upload.wikimedia.org/wikipedia/commons/2/2f/F-16C_block_52%2B_fighter_jet,_Hellenic_Air_Force_(November_2010).jpg","snippet":"F-16C block 52 of the Hellenic ...","pageUrl":"https://en.wikipedia.org/wiki/General_Dynamics_F-16_Fighting_Falcon"},{"Title":"1000+ images about New York Jets on Pinterest | New York Jets, NFL ...","imageUrl":"https://s-media-cache-ak0.pinimg.com/originals/a2/10/ca/a210ca73562a61437d6687ecae6fd701.jpg","snippet":"... New York Jets on Pinterest ...","pageUrl":"https://www.pinterest.com/drego2279/new-york-jets/"}]




*/


module.exports = router;
