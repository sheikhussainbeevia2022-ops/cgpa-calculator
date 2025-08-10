function generateCourseInputs() {
  const numCourses = parseInt(document.getElementById("num-courses").value);
  const coursesContainer = document.getElementById("courses-container");
  coursesContainer.innerHTML = "";

  if (isNaN(numCourses) || numCourses < 1) {
    displayError("Please enter a valid number of courses (at least 1).");
    return;
  }

  hideError();

  for (let i = 1; i <= numCourses; i++) {
    const courseRow = document.createElement("tr");
    courseRow.classList.add("course-input-row");
    courseRow.innerHTML = `
      <td><input type="number" step="0.01" placeholder="Credits" id="credits${i}" min="0"></td>
      <td>
        <input type="text" placeholder="Grade" list="gradeList" id="grade${i}" maxlength="1">
      </td>
    `;
    coursesContainer.appendChild(courseRow);
  }

  if (!document.getElementById("gradeList")) {
    const datalist = document.createElement("datalist");
    datalist.id = "gradeList";
    ["S","A","B","C","D","E","F"].forEach(g => {
      const opt = document.createElement("option");
      opt.value = g;
      datalist.appendChild(opt);
    });
    document.body.appendChild(datalist);
  }

  document.getElementById("calculate-button").style.display = "inline-block";
  document.getElementById("result").style.display = "none";
}

function calculateGPA() {
  const numCourses = parseInt(document.getElementById("num-courses").value);
  let totalPoints = 0;
  let totalCredits = 0;
  const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };

  for (let i = 1; i <= numCourses; i++) {
    const gradeInput = document.getElementById(`grade${i}`);
    const creditsInput = document.getElementById(`credits${i}`);

    if (!gradeInput || !creditsInput) {
      displayError(`Input fields missing for Course ${i}`);
      return;
    }

    const grade = gradeInput.value.trim().toUpperCase();
    const credits = parseFloat(creditsInput.value);

    if (isNaN(credits) || credits <= 0) {
      displayError(`Invalid credits for Course ${i}`);
      return;
    }
    if (!(grade in gradePoints)) {
      displayError(`Invalid grade for Course ${i}`);
      return;
    }

    totalPoints += gradePoints[grade] * credits;
    totalCredits += credits;
  }

  if (totalCredits === 0) {
    displayError("Total credits cannot be zero.");
    return;
  }

  const gpa = totalPoints / totalCredits;

  let message = "";
  if (gpa === 10) message = "🎉 Contact Me  (I need some tips) 🎉";
  else if (gpa >= 9) message = "🎉 9 pointer! 🎉";
  else if (gpa >= 8) message = "👍 Good job! 👍";
  else if (gpa >= 7) message = "🙂 Not bad! 🙂";
  else if (gpa >= 6) message = "😕 Needs improvement 😕";
  else message = "😞 Better luck next time 😞";

  displayResult(`Your GPA is: ${gpa.toFixed(2)}. ${message}`);
}

function calculateCgpa() {
  const completedCredits = parseFloat(document.getElementById("completedCredits").value);
  const lastCgpa = parseFloat(document.getElementById("lastCgpa").value);
  const currentCredits = parseFloat(document.getElementById("currentCredits").value);
  const currentGpa = parseFloat(document.getElementById("currentGpa").value);

  if (
    isNaN(completedCredits) ||
    isNaN(lastCgpa) ||
    isNaN(currentCredits) ||
    isNaN(currentGpa) ||
    completedCredits < 0 ||
    lastCgpa < 0 || lastCgpa > 10 ||
    currentCredits < 0 ||
    currentGpa < 0 || currentGpa > 10
  ) {
    displayCgpaError("Please enter valid numbers (CGPA and GPA should be between 0 and 10).");
    return;
  }

  const totalGpaPoints = completedCredits * lastCgpa + currentCredits * currentGpa;
  const totalCredits = completedCredits + currentCredits;

  if (totalCredits === 0) {
    displayCgpaError("Total credits cannot be zero.");
    return;
  }

  const cgpa = totalGpaPoints / totalCredits;

  displayCgpaResult(cgpa.toFixed(2));
}

function displayError(message) {
  const errorDiv = document.getElementById("error");
  errorDiv.innerText = message;
  errorDiv.style.display = "block";

  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "none";
}

function hideError() {
  document.getElementById("error").style.display = "none";
}

function displayResult(message) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = message;
  resultDiv.style.display = "block";

  hideError();
}

function displayCgpaError(message) {
  const errorDiv = document.getElementById("error-container");
  errorDiv.innerText = message;
  errorDiv.style.display = "block";

  const resultDiv = document.getElementById("result-container");
  resultDiv.style.display = "none";
}

function displayCgpaResult(message) {
  const resultDiv = document.getElementById("result-container");
  resultDiv.style.display = "block";

  const cgpaSpan = document.getElementById("cgpaResult");
  cgpaSpan.innerText = message;

  const errorDiv = document.getElementById("error-container");
  errorDiv.style.display = "none";
}
