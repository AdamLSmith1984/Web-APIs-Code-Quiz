

// DOM elements
var questionE1 = document.querySelector("#questions");
var timerE1 = document.querySelector("#time");
var choicesE1 = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initialsE1 = document.querySelector("#initials");
var feedbackE1 = document.querySelector("#feedback");

// quiz state variables
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

function startQuiz() {
    // hide start screen
    var startScreenE1 = document.getElementById("start-screen");
    startScreenE1.setAttribute("class", "hide");

    // un-hide questions section
    questionE1.removeAttribute("class");

    // start timer
    timerId = setInterval(clockTick, 1000);

    // show starting time
    timerE1.textContent = time;

    getQuestion();
}

function getQuestion() {
    // get current question object from array
    var currentQuestion = questions[currentQuestionIndex];

    // update title with current question
    var titleE1 = document.getElementById("question-title");
    titleE1.textContent = currentQuestion.title;

    // clear out any old question choices
    choicesE1.innerHTML = "";

    // loop over choices
    currentQuestion.choices.forEach(function (choice, i) {
        // create new button for each choice
        var choiceNode = document.createElement("button");
        choiceNode.setAttribute("class", "choice");
        choiceNode.setAttribute("value", choice);

        choiceNode.textContent = i + 1 + ". " + choice;

        // attach click event listener to each choice
        choiceNode.onclick = questionClick;

        // display on the page
        choicesE1.appendChild(choiceNode);
    });
}

function questionClick() {
    // check if user guessed wrong
    if (this.value !== questions[currentQuestionIndex].answer) {
        // penalize time
        time -= 15;

        if (time < 0) {
            time = 0;
        }
        // display new time on page
        timerE1.textContent = time;
        feedbackE1.textContent = "wrong!";
        feedbackE1.computedStyleMap.color = "red";
        feedbackE1.computedStyleMap.fontSize = "400%";
    } else {
        feedbackE1.textContent = "Correct!";
        feedbackE1.style.color = "green";
        feedbackE1.style.fontSize = "400%";
    }

    // flash right/wrong feedback
    feedbackE1.setAttribute("class", "feedback");
    setTimeout(function () {
        feedbackE1.setAttribute("class", "feedback hide");
    }, 1000);

    // next question
    currentQuestionIndex++;

    // time checker
    if (currentQuestionIndex === questions.length) {
        quizEnd();
    } else {
        getQuestion();
    }
}

function quizEnd() {
    // stop timer
    clearInterval(timerId);

    // show end screen
    var endScreenE1 = document.getElementById("end-screen");
    endScreenE1.removeAttribute("class");

    // show final score
    var finalScoreE1 = document.getElementById("final-score");
    finalScoreE1.textContent = time;

    // hide questions section
    questionE1.setAttribute("class", "hide");
}

function clockTick() {
    // update time
    time--;
    timerE1.textContent = time;

    // check if user ran out of time
    if (time <= 0) {
        quizEnd();
    }
}

function saveHighscore() {
    // get value of input box
    var initials = initialsE1.value.trim();

    if (initials !== "") {
        // get saved scores from localstorage, or if not any, set to empty array
        var highscores =
            JSON.parse(window.localStorage.getItem("highscores")) || [];

        // format new score object for current user
        var newScore = {
            score: time,
            initials: initials
        };

        // save to localstorage
        highscores.push(newScore);
        window.localStorage.setItem("highscores", JSON.stringify(highscores));

        // redirect to next page
        window.location.href = "score.html";
    }
}

function checkForEnter(event) {
    // "13" represents the enter key
    if (event.key === "Enter") {
        saveHighscore();
    }
}

// submit initials
submitBtn.onclick = saveHighscore;

// start quiz
startBtn.onclick = startQuiz;

initialsE1.onkeyup = checkForEnter;
