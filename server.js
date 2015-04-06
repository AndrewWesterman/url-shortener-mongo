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

setInterval(function(){
    urlShort.next();
},1000);

    
app.post("/url", function(req,res){
    var url = "http://localhost:3000/",
        suffix;

    res.json({url: url});
});


console.log("Server listening on http://localhost:3000");