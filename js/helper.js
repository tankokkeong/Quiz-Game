var randomArray = [];
var randomQuestion;
var questionCount = 1;
var readingTime = 10;
var answerTime = 15;
var answered = false;
var playerName;
var playerInfo = 
{
    totalScores: 0,
    continuousCorrect : 0,
    totalCorrect : 0,
    highestScore: 0
};

function checkStartGame(){
    var name = sessionStorage.getItem("quiz-name");

    if(name && name.trim().length != 0){
        removeCover();
        playerName = name.trim();
        return true;
    }
    else{
        return false;
    }
}

function removeCover(){
    var cover = document.getElementById("start-game-container");
    var input = document.getElementById("start-input-container");

    //Remove the cover
    cover.style.display = "none";
    input.style.display = "none";
}

function displayOptions(){
    var option = document.getElementsByClassName("option-input");

    for(var i = 0; i < option.length; i++){
        option[i].style.display = "";
        option[i].checked = false;
        option[i].disabled = true;
    }
}

function enableOptions(){
    var option = document.getElementsByClassName("option-input");

    for(var i = 0; i < option.length; i++){
        option[i].disabled = false;
    }
}

function disabledOptions(value){
    var option = document.getElementsByClassName("option-input");

    for(var i = 0; i < option.length; i++){
        
        if(option[i].value != value){
            option[i].style.display = "none";
        }
    }
}

function removeAnswerStatus(){

    setTimeout(function(){
        $("#answer-status").fadeOut();
    },2000);
}