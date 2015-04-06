#!/usr/bin/env node

var express = require("express"),
    http = require("http"),
    redis = require("redis"),
    bodyParser = require("body-parser"),
    client = redis.createClient(),
    app = express(),
    urlShort = require("./shorturl.js");

http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
app.use(bodyParser());
urlShort.init();
    
app.post("/url", function(req,res){
    var url = req.body.url;
    client.get(url, function(err, reqUrl){
        if(err !== null){
            console.log("ERROR: "+ err);
            return;
        }
        console.log("Requested url: "+reqUrl);
        res.json({url: reqUrl});
    });
    
});

app.post("/short", function(req,res){
    var url = req.body.url;
    client.exists(url, function(error, exists){
        console.log(url);
        if(error){
            console.log("ERROR: "+error);
            return;
        } else if(!exists){
            console.log("New url entered!");
            if(urlShort.isLong(url)){
                console.log("Shortening "+url);
                urlShort.shorten(url);                    
            }
        }
    });
});

app.post("/ten", function(req,res){
    client.zrevrange("top10",0,9, function(err, result){
        if(err !== null){
            console.log("ERROR: "+ err);
            return;
        }
        var top10 = [];
        result.forEach(function(url){
            top10.push(url);
        });
        res.json({top10: top10});
    });    
});

app.get("/:short", function(req,res){
    var shortUrl = "http://localhost:3000/"+req.params.short;
    client.get(shortUrl, function(err, longUrl){
        if(err !== null){
            console.log("ERROR: "+ err);
            return;
        }
        urlShort.addScore(shortUrl);
        res.redirect(longUrl);
    });
});



console.log("Server listening on http://localhost:3000");