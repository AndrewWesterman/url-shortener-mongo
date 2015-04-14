var mongoose = require("mongoose"),
    UrlSchema = mongoose.Schema({
        "long": String,
        "short": String,
        "score": Number
    }),
    Url = mongoose.model("Url", UrlSchema),
    Key = mongoose.model("Key", {key: Number}),
    INIT_KEY = 1000000;

// returns true if the given url is long form
var isLong = function(url){
    return url.indexOf("localhost") === -1;
};

var nextKey = function(){
    Key.findOne({}, function(err,key){
        if(err !== null){
            console.log("ERROR: "+err);
            return;
        } else if (key === null) {
            console.log("creating key");
            key = Key({key: INIT_KEY});
            key.save(function(err){
                if(err !== null){
                    console.log("ERROR: "+err);
                    return;
                }
            });
        } else {
            var rand = getRandomInt(1,10),
                newKey;
            newKey = key.key + rand;
            key.key = newKey;
            key.save(function(err){
                if(err !== null){
                    console.log("ERROR: "+err);
                    return;
                }
            });
        }
    });
};

var getRandomInt = function(max, min){
    return Math.floor(Math.random() * (max - min)) + min;
};

// shortens a long url
var shorten = function(longUrl){
    if(isLong(longUrl)){
        nextKey();
        Url.findOne({"long": longUrl},function(err,url){
            if(url===null){
                Key.findOne({}, function(err,key){
                    var shortUrl = "http://localhost:3000/"+key.key.toString(36),
                        url = Url({short: shortUrl, long: longUrl, score: 0});
                    url.save();
                    console.log(shortUrl+" added");
                });
            }
        }); 
    }    
};

// increments the number of clicks for the given url
var addScore = function(url){
    Url.findOne({short: url},function(err,result){
        result.score = result.score + 1;
        result.save();
    });
};

var getUrl = function(url, req, res){
    if(isLong(url)){
        Url.findOne({"long": url}, function(err, reqUrl){
            if(err !== null){
                console.log("ERROR: "+err);
                return;
            } else if (reqUrl === null){
                console.log("ERROR: requested url not found");
                return;
            }
            console.log("returning "+reqUrl.short);
            res.json({url:reqUrl.short});
        });
    } else {
        Url.findOne({"short": url}, function(err, reqUrl){
            if(err !== null){
                console.log("ERROR: "+err);
                return;
            } else if (reqUrl === null){
                console.log("ERROR: requested url not found");
                return;
            }
            console.log("returning "+reqUrl.long);
            if(req.method==="GET"){
                addScore(url);
                res.redirect(reqUrl.long);
            } else {
                res.json({url:reqUrl.long});
            } 
        });
    }    
};

var getTop10 = function(req,res){
    Url.find({$query: {}, $orderby: {score: -1}},function(err, urls){
        var top10 = [];

        urls.forEach(function(url){
            if(top10.length !== 10){
                top10.push(url.short);
            }
            else {
                return;
            }               
        });
        res.json({top10: top10});            
    });
};

var init = function(){
    nextKey();
};

module.exports = {
    shorten: shorten,
    isLong: isLong,
    addScore: addScore,
    getUrl: getUrl,
    getTop10: getTop10,
    init: init
};