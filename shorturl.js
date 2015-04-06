var redis = require("redis"),
    client = redis.createClient(),
    INIT_KEY = 1000000;

// returns true if the given url is long form
var isLong = function(url){
    return url.indexOf("localhost") === -1;
};

var nextKey = function(callback){
    // http://blog.semmy.me/post/18348581070/persistence-with-redis-and-node-js
    client.exists("next", function(error, exists){
        if(error){
            console.log("ERROR: "+error);
        } else if(!exists){
            // initialize the key value if it is null;
            console.log("creating key");
            client.set("next",INIT_KEY);
        } else {
            var rand = getRandomInt(1,10),
                newKey;
            client.get("next", function(err,result){
                if (err !== null){
                    console.log("ERROR: "+err);
                    return;
                }
                //console.log("result " +result);
                newKey = parseInt(result,10) + rand;
                client.set("next", newKey);
            });
        }
    });
};

var getRandomInt = function(max, min){
    return Math.floor(Math.random() * (max - min)) + min;
};

// shortens a long url
var shorten = function(longUrl){
    nextKey(function(){});
    client.get("next", function(err, next){
        if(err !== null){
            console.log("ERROR: "+ err);
            return;
        }
        var key = parseInt(next,10);
        
        shortUrl = "http://localhost:3000/"+key.toString(36);
        console.log("Key "+key);
        client.set(shortUrl,longUrl);
        client.set(longUrl,shortUrl);

    });
};

module.exports = {
    shorten: shorten,
    isLong: isLong,
    next: nextKey
};