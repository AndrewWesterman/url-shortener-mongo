#!/usr/bin/env node

var express = require("express"),
    http = require("http"),
    redis = require("redis"),
    bodyParser = require("body-parser"),
    client = redis.createClient(),
    app = express(),
    urlShort = require("./shorturl.js"),
    INIT_KEY = 1000000;

http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
app.use(bodyParser());
    
app.post("/url", function(req,res){
    var url = req.body.url;
    if(urlShort.isLong(url)){
        urlShort.shorten(url);
    }    
    client.get(url, function(err, reqUrl){
        if(err !== null){
            console.log("ERROR: "+ err);
            return;
        }
        res.json({url: reqUrl});
    });
});

app.get("/:short", function(req,res){
    var shortUrl = "http://localhost:3000/"+req.params.short;
    client.get(shortUrl, function(err, longUrl){
        if(err !== null){
            console.log("ERROR: "+ err);
            return;
        }
        res.redirect(longUrl);
    });
});


console.log("Server listening on http://localhost:3000");