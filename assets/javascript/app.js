var timeRemaining;
//var interval;
//var TotalSeconds;
var totalQuestions = 4;
var questionsCorrect = 0;
var questionsIncorrect = 0;
var questionsUnanswered = 0;
var audio = new Audio("http://www.soundjay.com/mechanical/sounds/camera-shutter-click-01.mp3");
var questionCollection;
var dataUrl = "assets/json/trivia-questions.json";
var currentQuestion = 0;
var currentQuestionObject;
var questionTimer;
var answerTimer;

function startGame() {
    timeRemaining = 0;
    totalQuestions = 4;
    questionsCorrect = 0;
    questionsIncorrect = 0;
    questionsUnanswered = 0;
    currentQuestion = 0;
    $("#timer").show();
    $("#questions").show();

    // Ensure results are hidden in case user clicked Play Again
    $("#results-info").hide();

    // DO THE AJAX CALL AND SAVE RESPONSE TO A GLOBAL VARIABLE SO THAT WE CAN REUSE IT
    $.ajax({ /// MOVE IT TO STARTGAME() AND SAVE RESPONSE
        dataType: "json",
        url: dataUrl,
        method: 'GET'
    }).done(function(response) {
        questionCollection = response;
        nextQuestion();
    });
}

function nextQuestion() {

    currentQuestion++;
    if (currentQuestion > totalQuestions) {
        //WE HAVE REACH THE END OF THE QUESTIONS AND THE GAME. SHOW WHATEVER DIVS AT END OF GAME.
        $("#results-info").show();
        $("#timer").hide();
        $("#questions").hide();
        $("#questions-correct").text(questionsCorrect);
        $("#questions-incorrect").text(questionsIncorrect);
        $("#questions-unanswered").text(questionsUnanswered);

    } else {

        timeRemaining = 5;
        renewTime();
        questionTimer = setInterval(renewTime, 1000);

        var randomNumber = Math.floor(Math.random() * questionCollection.length);
        currentQuestionObject = questionCollection[randomNumber];

        $("#questions").html(currentQuestionObject.question);
        $("#answers").fadeIn("fast");
        $("#A").text(currentQuestionObject.A);
        $("#B").text(currentQuestionObject.B);
        $("#C").text(currentQuestionObject.C);
        $("#D").text(currentQuestionObject.D);
    }
}

function renewTime() {

    if (timeRemaining <= -1) {
        // We've reached the limit, clear the timer
        clearInterval(questionTimer);
        showCurrentAnswer();
        questionsUnanswered++;
    } else {
        $("#timer1").text(timeRemaining);
        timeRemaining--;
    }
}

function showCurrentAnswer() {

    // Set a timer to show the next question after X seconds
    answerTimer = setInterval(stopShowingCurrentAnswer, 3000);
    $("#answers").fadeToggle("3000");

    // Obtain the text of the correct answer
    var answerText = "";

    switch (currentQuestionObject.answer) {
        case "A":
            answerText = "A: " + currentQuestionObject.A;
            break;

        case "B":
            answerText = "B: " + currentQuestionObject.B;
            break;

        case "C":
            answerText = "C: " + currentQuestionObject.C;
            break;

        case "D":
            answerText = "D: " + currentQuestionObject.D;
            break;
    }

    $("#correctAnswerShown").text(answerText);

    $("#correctAnswerShown").fadeIn("fast");
    $("#answerImage").show();

}

function stopShowingCurrentAnswer() {
    // Clear the interval that called us
    clearInterval(answerTimer);
    $("#correctAnswerShown").hide();
    $("#answerImage").hide();
    nextQuestion();
}


$(document).ready(function() {
    console.log('jquery ready')
        //This is the first window with a start button
    $("#play").click(function() {
        $("#press-play").fadeToggle("3000");
        audio.play();
        $("#timer").fadeIn("fast");
        $("#questions").fadeIn("fast, swing");
        $("#answers").fadeIn("fast, swing");
        alert("Are you Sure?");
        startGame();
    })

    $(".btn-primary").click(function() {
        console.log(this);
        console.log($(this).attr("id"));
        console.log(currentQuestionObject.answer)


        clearInterval(questionTimer);
        showCurrentAnswer();
        var questRight = currentQuestionObject.answer;

        if ($(this).attr("id") == currentQuestionObject.answer) {
            var result = "Winner";
            var resultShown = $("<div>YES SIR!!!!</div>");
            questionsCorrect++;
            $("#answerImage").html("<img src='http://i.imgur.com/dvcxb.gif' >");
        } else {
            var result = "Loser";
            var resultShown = $("<div>Maybe Next Time!!!</div>");
            var answerCorrect = $("<div>Sorry but the correct answer is " + currentQuestionObject[questRight] + "</div>");
            questionsIncorrect++;
            $("#answerImage").html("<img src='https://media.giphy.com/media/qjqFjoqYgLwZO/giphy.gif' width=300>");
        }
    })

})
