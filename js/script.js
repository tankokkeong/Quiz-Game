// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";
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
                continuousCorrect: 0
            });

            //Remove Cover
            removeCover();

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

    //Disable all the input
    disabledOptions(event.target.value);

    //Check Answer
    get(child(dbRef, `Questions/Question-${randomQuestion}`)).then((snapshot) => {
        if (snapshot.exists()) {

            var statusDisplay = document.getElementById("answer-status-display");
            var iconDisplay = document.getElementById("answer-icon-display");

            if(snapshot.val().answer == event.target.value){
                iconDisplay.innerHTML = `<i class="fa fa-check-circle text-success answer-status-mark" aria-hidden="true"></i>`;
                statusDisplay.innerHTML = "Correct";
            }
            else{
                iconDisplay.innerHTML = `<i class="fa fa-times text-danger answer-status-mark" aria-hidden="true"></i>`;
                statusDisplay.innerHTML = "Wrong";
            }

            $("#answer-status").fadeIn();
            removeAnswerStatus();

        } else {
            alert("Error Occured");
        }
    }).catch((error) => {
        console.error(error);
    });

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