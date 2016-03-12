var questions = [
    // [question, image_url (localized), [list_of_questions]
    // for MC, the correct answer is always first
    // in order...
    ["This is a test. Let's begin?", "cats.jpg", ["Yes!", "Nope.", "Mayyyybe", "IDK"]],
    ["Type in 'Answer' in the box below. This is a short answer question.", "dummy.jpg", ["Answer"]]
];

// dangerous hackery, but whatev
NodeList.prototype["forEach"] = Array.prototype["forEach"];

function e(id) {
    return document.getElementById(id);
};

function initApp() {
    // runs on page load
    e("response-text").style.display = "none";
    e("response-mc").style.display = "none";

    nextQuestion();

    return true;
};

function openInputView() {
    e("response-mc").style.display = "none";
    e("response-text").children[0].value = "";
    e("response-text").style.display = "block";
    e("response-text").children[0].focus();
};

function openMultiView() {
    e("response-text").style.display = "none";
    e("response-mc").style.display = "block";
};

function setQuestion(questionID) {
    // sets ONLY THE QUESTION, not the answers
    e("question").innerHTML = questions[questionID][0];
};

function setBackground(questionID) {
    // sets the question background\
    if (e("background-" + (questionID - 1).toString())) {
        e("background-" + (questionID - 1).toString()).className="hide";
    }
    e("background-" + questionID.toString()).className="show";
};

function setMultiChoices(array) {
    // sets the answer choices

    var circleArray = [];
    var marker = Math.floor(Math.random() * 4);
    
    // circular-rotate an array
    for (i = 0; i < 4; i++) {
        circleArray[(marker + i) % 4] = array[i];
    }

    for (i = 0; i < 4; i++) {
        e("choice-" + i.toString()).innerText = circleArray[i];
    }
};

function checkAnswer(questionID, answer) {

    if (questionID == 10 && answer == "Answer") { // change this to whatever the last answer is. This is sort of janky. May be fixed later.
        openLetter();
    }

    if ( questions[questionID][2][0].toLowerCase() == answer && questionID != 10) {
       nextQuestion();
       return true;
    }

    tryAgain();
    return false;
};

function incrementProgress(questionID) {
    document.getElementsByClassName("progress")[0].style.width=(questionID * 10).toString() + "vw";
}

function nextQuestion() {

    questionID += 1;
    
    incrementProgress(questionID);

    setBackground(questionID);

    setQuestion(questionID);
    if (questions[questionID][2].length != 1) {
        setMultiChoices(questions[questionID][2]);
        openMultiView();
    } else {
        openInputView();
    }
};

function tryAgain() {

    if (incorrects >= 3) { // set number of tries allowable
        e("question").innerText = "Welp, looks like a moment of cranial flatulance. Starting over...";
        e("response-mc").className = "hide response";
        e("response-text").className = "hide response";
        setTimeout(function(){
            window.location.reload();
        }, 4000);
        return false;
    }

    e("question").innerText = "Nope, try again!";
    e("response-mc").className = "hide response";
    e("response-text").className = "hide response";

    setTimeout(function(){
        setQuestion(questionID);
        e("response-text").className = "response";
        e("response-mc").className = "response";
        e("response-text").children[0].focus();
    }, 1200);

    incorrects += 1;
};

function openLetter() {

    e("question").style.display="none";
    e("response-text").style.display = "none";
    e("response-mc").style.display = "none";

    // do something when the quiz is successfully finished
};

// kick it off
var questionID = -1;
var incorrects = 0;
initApp();

// submit event listeners
var choices = document.querySelectorAll("#response-mc div");
choices[0].addEventListener("click", function(e){
    checkAnswer(questionID, e.target.innerText.toLowerCase());
});
choices[1].addEventListener("click", function(e){
    checkAnswer(questionID, e.target.innerText.toLowerCase());
});
choices[2].addEventListener("click", function(e){
    checkAnswer(questionID, e.target.innerText.toLowerCase());
});
choices[3].addEventListener("click", function(e){
    checkAnswer(questionID, e.target.innerText.toLowerCase());
});
var inputbox = document.querySelectorAll("#response-text input");
inputbox[0].addEventListener("keypress", function(e){
    if (e.keyCode == 13) {
        checkAnswer(questionID, e.target.value.toLowerCase().trim());
    }
});

// correct image positions on taller screens
var heroes = document.querySelectorAll("#pandora img");
window.addEventListener("resize", calibrateImages);
function calibrateImages() {
    heroes.forEach(function(el){
        el.style.left = "50%";
        el.style.webkitTransform = "translateX(-" + (el.offsetWidth / 2).toString() + "px)";
    });
}

calibrateImages();

