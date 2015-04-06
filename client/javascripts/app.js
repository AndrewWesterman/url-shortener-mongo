var main = function(){

    $("#submit").on("click", function(){
        console.log("You entered a URL!");
        var submittedURL = $("#url").val();
        $.post("url", { url: submittedURL }, function(res){
            console.log("Received "+res.url);
            $(".shorturl").append($("<a>").text(res.url).attr("href",res.url));
        });
    });
};

$(document).ready(main);