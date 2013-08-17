$(function() {
 matchingGame.deck.sort(shuffle);
 for(var i=0; i<11; i++){
     $(".card:first-child").clone().appendTo("#cards");
 }
 $("#cards").children().each(function(index){
    $(this).css({
        "left":($(this).width()+20)*(index%4),
        "top":($(this).height()+20)*Math.floor(index/4)
    }); 
    var pattern = matchingGame.deck.pop();
    $(this).find(".back").addClass(pattern);
    $(this).attr("data-pattern",pattern);
    $(this).click(selectCard);
 });
 $("#go").click(beginImgShow);
 $("#go").hover(function(){
    console.log(audiogame.start_areyouready);
    audiogame.start_areyouready.currentTime = 0;
    audiogame.start_areyouready.play();
 },function(){
    audiogame.start_areyouready.pause();
 });

 
});

var matchingGame = {};
matchingGame.deck= [
    'cardA12','cardA13',
    'cardB12','cardB13',
    'cardC12','cardC13',
    'cardA12','cardA13',
    'cardB12','cardB13',
    'cardC12','cardC13',];

function shuffle() {
    return 0.5- Math.random();
}

function selectCard() {
    if($(".card-flipped").size() > 1) {
        return;
    }
    $(this).addClass("card-flipped");
    if($(".card-flipped").size() == 2){
        setTimeout(checkPattern,700);
    }    
}

function checkPattern(){
    if(isMatchPattern()){
        $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        $(".card-removed").bind("webkitTransitionEnd", removeTookCards);
    }else{
        $(".card-flipped").removeClass("card-flipped");
    }
}

function isMatchPattern(){
    var cards = $(".card-flipped");
    var pattern = $(cards[0]).data("pattern");
    var anotherPattern = $(cards[1]).data("pattern");
    return (pattern == anotherPattern);
}

function removeTookCards(){
    $(".card-removed").remove();
}


var time_;
function beginImgShow() {
    
    $("#beginImg").css({
         "background-position":"-330px 0"
    });
    $("#beginImg").removeClass("hide");
    showSecond(-330,time_);
    return false;
}

function showSecond(v){
    setTimeout(function (){
        $("#beginImg").addClass("transOpacity");
        $("#beginImg").css({"opacity":0});
        v=v+165;
        setTimeout(function() {
            if(v<=0){
                $("#beginImg").css({
                    "background-position": v+"px 0"
                });
                $("#beginImg").removeClass("transOpacity");
                $("#beginImg").css({"opacity":1});
                showSecond(v);
            }else{
                $("#beginImg").removeClass("transOpacity");
                $("#beginImg").css({"opacity":1});
                $("#beginImg").addClass("hide");
                time_ = new Stopwatch("timeTab");
                time_.start();
                console.log(audiogame.bg_music_beforegame);
                audiogame.bg_music_beforegame.pause();
                audiogame.bg_music_ingame.play();
            }
        },1000);
    },200);
}

