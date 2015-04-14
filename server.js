#!/usr/bin/env node

var express = require("express"),
    http = require("http"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express(),
    urlShort = require("./shorturl.js");

http.createServer(app).listen(3000);

mongoose.connect("mongodb://localhost/url-short");
app.use(express.static(__dirname + "/client"));
app.use(bodyParser());
urlShort.init();
    
app.post("/url", function(req,res){
    var url = req.body.url;
    urlShort.getUrl(url,req,res);
});

app.post("/short", function(req,res){
    var url = req.body.url;
    urlShort.shorten(url);
});

app.post("/ten", function(req,res){
    urlShort.getTop10(req,res);   
});

app.get("/:short", function(req,res){
    var shortUrl = "http://localhost:3000/"+req.params.short;
    urlShort.getUrl(shortUrl,req,res);
});



console.log("Server listening on http://localhost:3000");