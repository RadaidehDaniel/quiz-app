const sectionWelcome = document.getElementById("welcome-section");
const sectionTopics = document.getElementById("topics-section");
const sectionQuestion = document.getElementById("question-section");
const sectionOptions = document.getElementById("options-section");
const sectionComplete = document.getElementById("complete-section");
const sectionScore = document.getElementById("score-section");
const sectionLoading = document.getElementById("section-loading");
const imgTopicHeader = document.getElementById("topic-img");
const textTopicHeader = document.getElementById("topic-title");
const textCounter = document.getElementById("question-counter");
const textQuestion = document.getElementById("question-text");
const progressBar = document.getElementById("progress-bar");
const textOptions = document.querySelectorAll(".option-text");
const options = document.querySelectorAll("input[name='option']");
const optionsImgs = document.querySelectorAll("label img");
const btnSubmit = document.getElementById("submit-button");
const btnNext = document.getElementById("next-button");
const textScore = document.getElementById("socre-text");
const topicButtons = document.querySelectorAll(".topic-button");
const btnReset = document.getElementById("reset-button");
const msgError = document.getElementById("error-msg");
const btnTheme = document.getElementById("theme-switch");
const bodyElement = document.querySelector("body");
const iconSun = document.getElementById("sun-icon");
const iconMoon = document.getElementById("moon-icon");
const labels = document.querySelectorAll("label");

let score = 0;
let quizData;
let topicData;
let counter = 0;
let questionTimer;
let barProgress;
let timePass;
// FUNCTIONS

function startTimer() {
  clearTimeout(questionTimer);
  clearInterval(barProgress);
  timePass = 20;

  questionTimer = setTimeout(() => {
    options.forEach((option) => {
      let optionText = document.querySelector(
        `label[for="${option.id}"] span.option-text`
      ).textContent;

      if (optionText === quizData.questions[counter].answer) {
        document.querySelector(`label[for="${option.id}"] img`).src =
          "./assets/images/icon-correct.svg";
        document
          .querySelector(`label[for="${option.id}"]`)
          .classList.add("correct");
      }
    });

    options.forEach((option) => {
      option.checked = false;
    });

    counter += 1;

    document.querySelectorAll("form div").forEach((div) => {
      div.style.pointerEvents = "none";
    });

    btnNext.classList.remove("hidden");
    btnSubmit.classList.add("hidden");
    msgError.classList.add("hidden");
  }, 10000);

  barProgress = setInterval(() => {
    timePass -= 1;
    p = (timePass / 20) * 100;
    progressBar.value = p;
  }, 500);
}

function handleNext() {
  clearTimeout(questionTimer);
  clearInterval(barProgress);

  labels.forEach((label) => {
    label.classList.remove("correct");
    label.classList.remove("wrong");
  });

  renderQandA(quizData.questions);

  document.querySelectorAll("form div").forEach((div) => {
    div.style.pointerEvents = "all";
  });

  if (counter > 8) {
    btnNext.textContent = "Complete Quiz";
  }

  btnNext.classList.add("hidden");
  btnSubmit.classList.remove("hidden");
  optionsImgs.forEach((img) => {
    img.src = "";
  });

  startTimer();
}

function handleSubmit(event) {
  event.preventDefault();

  let isChecked = false;
  let answerText;

  msgError.classList.add("hidden");

  options.forEach((option) => {
    if (option.checked) {
      isChecked = true;
    }
  });

  if (!isChecked) {
    msgError.classList.remove("hidden");
    return;
  }

  clearInterval(barProgress);

  options.forEach((option) => {
    let optionText = document.querySelector(
      `label[for="${option.id}"] span.option-text`
    ).textContent;

    if (optionText === quizData.questions[counter].answer) {
      document.querySelector(`label[for="${option.id}"] img`).src =
        "./assets/images/icon-correct.svg";
      document
        .querySelector(`label[for="${option.id}"]`)
        .classList.add("correct");
    }

    if (option.checked) {
      answerText = document.querySelector(
        `label[for="${option.id}"] span.option-text`
      ).textContent;
      if (answerText === quizData.questions[counter].answer) {
        document.querySelector(`label[for="${option.id}"] img`).src =
          "./assets/images/icon-correct.svg";
        document
          .querySelector(`label[for="${option.id}"]`)
          .classList.add("correct");
        score += 1;
      } else {
        document.querySelector(`label[for="${option.id}"] img`).src =
          "./assets/images/icon-incorrect.svg";
        document
          .querySelector(`label[for="${option.id}"]`)
          .classList.add("wrong");
      }
    }
  });

  options.forEach((option) => {
    option.checked = false;
  });

  counter += 1;

  document.querySelectorAll("form div").forEach((div) => {
    div.style.pointerEvents = "none";
  });

  btnNext.classList.remove("hidden");
  btnSubmit.classList.add("hidden");
}

function renderScore() {
  textScore.textContent = score;

  sectionComplete.classList.remove("hidden");
  sectionScore.classList.remove("hidden");
  sectionQuestion.classList.add("hidden");
  sectionOptions.classList.add("hidden");
}

function renderQandA(questionsAndAnswers) {
  if (counter > 9) {
    renderScore();
  } else {
    textCounter.textContent = counter + 1;
    textQuestion.textContent = questionsAndAnswers[counter].question;
    textOptions.forEach((option, index) => {
      option.textContent = questionsAndAnswers[counter].options[index];
    });
  }
}

function renderQuizRemoveLoading() {
  sectionLoading.classList.add("hidden");
  sectionQuestion.classList.remove("hidden");
  sectionOptions.classList.remove("hidden");
}

function initiateQuiz(data) {
  imgTopicHeader.src = data.icon;
  imgTopicHeader.alt = `${data.title} icon`;
  imgTopicHeader.classList.add(`${data.title}-style`);
  textTopicHeader.textContent = data.title;

  renderQuizRemoveLoading();

  renderQandA(data.questions);

  startTimer();
}

function renderLoading() {
  sectionWelcome.classList.add("hidden");
  sectionTopics.classList.add("hidden");
  sectionLoading.classList.remove("hidden");
}

function handleTopicSelection(event) {
  const topic = event.currentTarget.id;

  renderLoading();

  fetch("/data.json")
    .then((request) => {
      if (!request.ok) {
        console.log("Oops! Something went wrong.");
        return null;
      }

      return request.json();
    })
    .then((data) => {
      const dataArr = data.quizzes.filter((obj) => {
        return obj.title === topic;
      });

      quizData = dataArr[0];

      initiateQuiz(quizData);
    });
}

function handleReset() {
  window.location.reload();
}

// EVENTS

topicButtons.forEach((btn) => {
  btn.addEventListener("click", handleTopicSelection);
});

btnSubmit.addEventListener("click", handleSubmit);

btnNext.addEventListener("click", handleNext);

btnReset.addEventListener("click", handleReset);

function handleTheme() {
  bodyElement.classList.toggle("dark");

  if (bodyElement.classList.contains("dark")) {
    iconSun.src = "./assets/images/icon-sun-light.svg";
    iconMoon.src = "./assets/images/icon-moon-light.svg";
  } else {
    iconSun.src = "./assets/images/icon-sun-dark.svg";
    iconMoon.src = "./assets/images/icon-moon-dark.svg";
  }
}

btnTheme.addEventListener("click", handleTheme);
