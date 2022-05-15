// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, set, child, get, onValue
,update } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuZrKwqm5BU5HnTflLAj9id1O5txhFPjQ",
    authDomain: "quiz-game-bc4ba.firebaseapp.com",
    databaseURL: "https://quiz-game-bc4ba-default-rtdb.firebaseio.com",
    projectId: "quiz-game-bc4ba",
    storageBucket: "quiz-game-bc4ba.appspot.com",
    messagingSenderId: "1073273640899",
    appId: "1:1073273640899:web:2b48ac450c133bd6c20f76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(getDatabase());

//Default function called
if(checkStartGame()){

    //Update user scores
    updateUserScores();

    //Display the question
    readQuestion();
}

$("#start-game-btn").click(function(){
    var name = document.getElementById("name-input");
    if(name.value.trim() != 0){
        var userName = name.value.trim();

        //Insert record
        get(child(dbRef, `users/${userName}`)).then((snapshot) => {
            if (snapshot.exists()) {
            
                alert("This user already exists! Please type a new name");

                //Empty the input field
                name.value = "";

            } else {

                //Create session storage
                sessionStorage.setItem("quiz-name", userName);
                
                set(ref(db, 'users/' + userName), {
                    username: userName,
                    scores: 0,
                    totalCorrect: 0,
                    continuousCorrect: 0,
                    highestScore: 0
                });

                playerName = userName;

                //Remove Cover
                removeCover();

                //Update user scores
                updateUserScores();

                readQuestion();
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    else{
        alert("Name cannot be empty!");
    }
});

$(".option-input").click(function(event){

    if(answered != true){
        //Disable all the input
        disabledOptions(event.target.value);

        //Change answered to true
        answered = true;

        //Check Answer
        get(child(dbRef, `Questions/Question-${randomQuestion}`)).then((snapshot) => {
            if (snapshot.exists()) {

                var statusDisplay = document.getElementById("answer-status-display");
                var iconDisplay = document.getElementById("answer-icon-display");

                if(snapshot.val().answer == event.target.value){
                    iconDisplay.innerHTML = `<i class="fa fa-check-circle text-success answer-status-mark" aria-hidden="true"></i>`;
                    statusDisplay.innerHTML = "Correct";

                    get(child(dbRef, `users/${playerName}`)).then((userSnapshot) => {

                        console.log(JSON.stringify(userSnapshot.val()))
                        var totalScores = userSnapshot.val().scores;
                        var continuousCorrect = userSnapshot.val().continuousCorrect;
                        var totalCorrect = userSnapshot.val().totalCorrect;

                        //Score calculation
                        var scoreOfTheRound;

                        if(answerTime >= 10){
                            scoreOfTheRound = 5 + (answerTime - 10) + continuousCorrect;
                        }
                        else{
                            scoreOfTheRound = 0;
                        }

                        var newTotal = totalScores + scoreOfTheRound;
                        
                        //Increase the total correct
                        totalCorrect++;
                        continuousCorrect++;

                        //Update firebase
                        var newData = {
                            scores : newTotal,
                            continuousCorrect: continuousCorrect,
                            totalCorrect: totalCorrect,
                            highestScore: userSnapshot.val().highestScore,
                            username: playerName
                        }

                        const updates = {};
                        updates['users/' + playerName] = newData;

                        update(ref(db), updates);
                    });
                }
                else{
                    iconDisplay.innerHTML = `<i class="fa fa-times text-danger answer-status-mark" aria-hidden="true"></i>`;
                    statusDisplay.innerHTML = "Wrong";

                    get(child(dbRef, `users/${playerName}`)).then((userSnapshot) => {

                        console.log(JSON.stringify(userSnapshot.val()))
                        var totalScores = userSnapshot.val().scores;
                        var continuousCorrect = userSnapshot.val().continuousCorrect;
                        var totalCorrect = userSnapshot.val().totalCorrect;

                        //Update firebase
                        var newData = {
                            scores : totalScores,
                            continuousCorrect: 0,
                            totalCorrect: totalCorrect,
                            highestScore: userSnapshot.val().highestScore,
                            username: playerName
                        }

                        const updates = {};
                        updates['users/' + playerName] = newData;

                        update(ref(db), updates);
                    });
                }

                $("#answer-status").fadeIn();
                removeAnswerStatus();

            } else {
                alert("Error Occured");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
    else{
        //Check the box by default
        event.target.checked = true;
    }
    
});

function readQuestion(){

    //Read question
    randomQuestion = Math.floor(Math.random() * 151) + 1;

    if(!randomArray.includes(randomQuestion)){
        //Add a new array element
        randomArray.push(randomQuestion);

        var questionDisplay = document.getElementById("question-title");
        var option_1_display = document.getElementById("option-1");
        var option_2_display = document.getElementById("option-2");
        var option_3_display = document.getElementById("option-3");
        var option_4_display = document.getElementById("option-4");
        var optionValues = document.getElementsByClassName("option-input");

        //Insert record
        get(child(dbRef, `Questions/Question-${randomQuestion}`)).then((snapshot) => {
            if (snapshot.exists()) {

            //Change answered to false
            answered = false;

            //Display options
            displayOptions();

            //Display the question details
            questionDisplay.innerHTML = questionCount + ". " + snapshot.val().question;
            option_1_display.innerHTML = snapshot.val().option_1;
            option_2_display.innerHTML = snapshot.val().option_2;
            option_3_display.innerHTML = snapshot.val().option_3;
            option_4_display.innerHTML = snapshot.val().option_4;

            //Set the value
            optionValues[0].value = snapshot.val().option_1;
            optionValues[1].value = snapshot.val().option_2;
            optionValues[2].value = snapshot.val().option_3;
            optionValues[3].value = snapshot.val().option_4;

            displayReadingTimer();

            } else {
            alert("Error Occured");
            }
        }).catch((error) => {
        console.error(error);
        });

    }
    else{
        readQuestion();
    }

}

function displayReadingTimer(){
    
    var timerDisplay = document.getElementById("timer-display");

    if(readingTime != -1){

        setTimeout(function(){
            timerDisplay.innerHTML = "Reading Time Left: " + readingTime;
            readingTime--;
            displayReadingTimer();
        },1000);
    }
    else{
        readingTime = 10;
        displayAnswerTimer();
        enableOptions();
    }
}

function displayAnswerTimer(){
    var timerDisplay = document.getElementById("timer-display");

    if(answerTime != -1){

        setTimeout(function(){
            timerDisplay.innerHTML = "Answer Time Left: " + answerTime;
            answerTime--;
            displayAnswerTimer();
        },1000);
    }
    else{
        answerTime = 15;
        
        //Increase the answer count
        questionCount++;

        if(questionCount <= 20){
            readQuestion();
        }
    }
}

function updateUserScores(){
    //Read user info
    const userRef = ref(db, 'users/' + playerName + '/');
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();

        //Assign the user info
        playerInfo.totalScores = snapshot.val().scores;
        playerInfo.continuousCorrect = snapshot.val().continuousCorrect;
        playerInfo.totalCorrect = snapshot.val().totalCorrect
        playerInfo.highestScore = snapshot.val().highestScore;

        //Update the score board
        var score1 = document.getElementById("total-scores");
        var score2 = document.getElementById("continuous-correct");
        var score3 = document.getElementById("total-correct");

        score1.innerHTML = playerInfo.totalScores;
        score2.innerHTML = playerInfo.continuousCorrect;
        score3.innerHTML = playerInfo.totalCorrect;

        //console.log("Data get " + JSON.stringify(playerInfo))
    });
}