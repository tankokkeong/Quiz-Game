var randomArray = [];
var questionCount = 1;

function checkStartGame(){
    var name = sessionStorage.getItem("quiz-name");

    if(name && name.trim().length != 0){
        removeCover();
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