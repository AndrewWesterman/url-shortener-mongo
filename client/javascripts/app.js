var main = function(){

    var loadLinks = function(){
        $.post("ten", function(res){
            $("#toplinks").empty();
            res.top10.forEach(function(url){
                $("#toplinks").append($("<li>").append($("<a>").text(url).attr("href",url)));
            });
        });
    };

    $("#submit").on("click", function(){
        console.log("You entered a URL!");
        var submittedURL = $("#url").val();
        console.log("Submitting "+submittedURL);
        $.post("url", { url: submittedURL }, function(res){
            console.log("Received "+res.url);
            $(".shorturl").append($("<a>").text(res.url).attr("href",res.url));
        });
        loadLinks();        
    });

    loadLinks();
};

$(document).ready(main);