var PROBLEM_COUNT = 10;
var problems = [];

function generateNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildWorksheet() {
  var list = document.getElementById("problems");
  list.innerHTML = "";
  problems = [];

  for (var i = 0; i < PROBLEM_COUNT; i++) {
    var p = generateProblem();
    problems.push(p);

    var li = document.createElement("li");
    li.className = "problem-row";
    li.innerHTML =
      '<span class="problem-number"></span>' +
      '<span class="problem-text">' + p.text + "</span>" +
      '<input type="number" aria-label="Answer ' + (i + 1) + '">' +
      '<span class="problem-mark" id="mark-' + i + '"></span>';
    list.appendChild(li);
  }

  document.getElementById("score").textContent = "";
  document.getElementById("submit").disabled = false;

  // focus first input
  var first = list.querySelector("input");
  if (first) first.focus();
}

function gradeWorksheet() {
  var inputs = document.querySelectorAll("#problems input");
  var correct = 0;

  for (var i = 0; i < problems.length; i++) {
    var value = inputs[i].value.trim();
    var mark = document.getElementById("mark-" + i);
    var userAnswer = parseInt(value, 10);

    // remove old correction if any
    var oldCorr = inputs[i].parentNode.querySelector(".correction");
    if (oldCorr) oldCorr.remove();

    if (!isNaN(userAnswer) && userAnswer === problems[i].answer) {
      correct++;
      mark.className = "problem-mark correct";
    } else {
      mark.className = "problem-mark incorrect";
      var corr = document.createElement("div");
      corr.className = "correction";
      corr.textContent = "Answer: " + problems[i].answer;
      inputs[i].parentNode.appendChild(corr);
    }
    inputs[i].disabled = true;
  }

  var scoreEl = document.getElementById("score");
  scoreEl.textContent = "Score: " + correct + " / " + PROBLEM_COUNT;
  scoreEl.className = "score graded";

  var btn = document.getElementById("submit");
  btn.textContent = "New Worksheet";
  btn.disabled = false;
  btn.onclick = function () {
    btn.textContent = "Submit";
    btn.onclick = gradeWorksheet;
    buildWorksheet();
  };
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("submit").addEventListener("click", gradeWorksheet);

  // Enter in any input moves to next input, or submits on last
  document.getElementById("problems").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      var inputs = Array.prototype.slice.call(
        document.querySelectorAll("#problems input")
      );
      var idx = inputs.indexOf(e.target);
      if (idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      } else {
        gradeWorksheet();
      }
    }
  });

  buildWorksheet();
});
