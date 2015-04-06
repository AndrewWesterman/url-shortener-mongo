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
        if (submittedURL.indexOf("http://") !== -1){
            console.log("Submitting "+submittedURL);

            // shorten the url if necessary
            $.post("short", {url :submittedURL});

            // request the corrsponding url
            $.post("url", { url: submittedURL }, function(res){
                console.log("Received "+res.url);
                $("#resurl").empty();
                $("#resurl").append($("<a>").text(res.url).attr("href",res.url));
            });
            loadLinks(); 
        } else {
            alert("You must enter a valid url \n Ex: http://website.com");
        }               
    });

    loadLinks();
};

$(document).ready(main);