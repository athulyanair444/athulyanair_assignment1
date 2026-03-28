/*
Program name: homework2.js
Author: Athulya Nair
Date created: 03/15/2026
Date last edited: 03/27/2026
Version: 1.1
Description: External JavaScript for Homework 2 Patient Registration Form.
*/

document.addEventListener("DOMContentLoaded", function () {
  setBannerDate();
  setupSlider();
  setupReviewButton();
  setupResetButton();
  setupLowercaseUserId();
  setupSubmitValidation();
  setupPasswordLiveValidation();
});

/* =========================
   BANNER DATE
========================= */
function setBannerDate() {
  var today = new Date();
  document.getElementById("todayDate").textContent = today.toDateString();
}

/* =========================
   SLIDER
========================= */
function setupSlider() {
  var slider = document.getElementById("healthScale");
  var healthValue = document.getElementById("healthValue");

  if (slider && healthValue) {
    healthValue.textContent = slider.value;

    slider.addEventListener("input", function () {
      healthValue.textContent = slider.value;
    });
  }
}

/* =========================
   USER ID LOWERCASE
========================= */
function setupLowercaseUserId() {
  var userId = document.getElementById("userId");

  if (userId) {
    userId.addEventListener("input", function () {
      userId.value = userId.value.toLowerCase();
    });
  }
}

/* =========================
   LIVE PASSWORD VALIDATION
========================= */
function setupPasswordLiveValidation() {
  var pw1 = document.getElementById("pw1");
  var pw2 = document.getElementById("pw2");

  if (pw1) {
    pw1.addEventListener("input", function () {
      if (pw1.value === "") {
        showError("pw1Error", "");
      } else if (!validatePassword(pw1.value)) {
        showError(
          "pw1Error",
          "Password must be 8 to 30 characters and include uppercase, lowercase, a number, and a special character."
        );
      } else {
        showError("pw1Error", "");
      }

      if (pw2 && pw2.value !== "") {
        if (pw1.value !== pw2.value) {
          showError("pw2Error", "Passwords do not match.");
        } else {
          showError("pw2Error", "");
        }
      }
    });
  }

  if (pw2) {
    pw2.addEventListener("input", function () {
      if (pw2.value === "") {
        showError("pw2Error", "");
      } else if (pw1.value !== pw2.value) {
        showError("pw2Error", "Passwords do not match.");
      } else {
        showError("pw2Error", "");
      }
    });
  }
}

/* =========================
   REVIEW BUTTON
========================= */
function setupReviewButton() {
  var reviewBtn = document.getElementById("reviewBtn");

  if (reviewBtn) {
    reviewBtn.addEventListener("click", function () {
      clearAllErrors();

      var isValid = validateForm();

      if (isValid) {
        displayReview();
      }
    });
  }
}

/* =========================
   RESET BUTTON
========================= */
function setupResetButton() {
  var form = document.getElementById("patientForm");

  if (form) {
    form.addEventListener("reset", function () {
      setTimeout(function () {
        clearAllErrors();
        clearReview();
        document.getElementById("healthValue").textContent =
          document.getElementById("healthScale").value;
      }, 0);
    });
  }
}

/* =========================
   SUBMIT VALIDATION
========================= */
function setupSubmitValidation() {
  var form = document.getElementById("patientForm");

  if (form) {
    form.addEventListener("submit", function (event) {
      clearAllErrors();

      var isValid = validateForm();

      if (!isValid) {
        event.preventDefault();
      } else {
        displayReview();
      }
    });
  }
}

/* =========================
   MAIN VALIDATION
========================= */
function validateForm() {
  var isValid = true;

  /* First Name */
  var firstName = document.getElementById("firstName").value.trim();
  if (!/^[A-Za-z'-]{1,30}$/.test(firstName)) {
    showError(
      "firstNameError",
      "First name must be 1 to 30 characters and contain only letters, apostrophes, or dashes."
    );
    isValid = false;
  }

  /* Middle Initial */
  var middleInitial = document.getElementById("middleInitial").value.trim();
  if (middleInitial !== "" && !/^[A-Za-z]$/.test(middleInitial)) {
    showError("middleInitialError", "Middle initial must be one letter only.");
    isValid = false;
  }

  /* Last Name */
  var lastName = document.getElementById("lastName").value.trim();
  if (!/^[A-Za-z0-9'-]{1,30}$/.test(lastName)) {
    showError(
      "lastNameError",
      "Last name must be 1 to 30 characters and may contain letters, numbers, apostrophes, or dashes."
    );
    isValid = false;
  }

  /* Date of Birth */
  var dob = document.getElementById("dob").value.trim();
  if (!validateDOB(dob)) {
    isValid = false;
  }

  /* SSN */
  var ssn = document.getElementById("ssn").value.trim();
  if (!/^\d{3}-?\d{2}-?\d{4}$/.test(ssn)) {
    showError("ssnError", "Enter SSN as 123-45-6789 or 123456789.");
    isValid = false;
  }

  /* Email */
  var email = document.getElementById("email").value.trim();
  if (!validateEmail(email)) {
    showError("emailError", "Enter a valid email address.");
    isValid = false;
  }

  /* Phone */
  var phone = document.getElementById("phone").value.trim();
  if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
    showError("phoneError", "Phone number must be in the format 000-000-0000.");
    isValid = false;
  }

  /* Address Line 1 */
  var addr1 = document.getElementById("addr1").value.trim();
  if (addr1.length < 2 || addr1.length > 30) {
    showError("addr1Error", "Address Line 1 must be 2 to 30 characters.");
    isValid = false;
  }

  /* Address Line 2 */
  var addr2 = document.getElementById("addr2").value.trim();
  if (addr2 !== "" && (addr2.length < 2 || addr2.length > 30)) {
    showError("addr2Error", "Address Line 2 must be 2 to 30 characters if entered.");
    isValid = false;
  }

  /* City */
  var city = document.getElementById("city").value.trim();
  if (!/^[A-Za-z .'-]{2,30}$/.test(city)) {
    showError("cityError", "City must be 2 to 30 characters and contain letters only.");
    isValid = false;
  }

  /* State */
  var state = document.getElementById("state").value;
  if (state === "") {
    showError("stateError", "Please select a state.");
    isValid = false;
  }

  /* Zip */
  var zip = document.getElementById("zip").value.trim();
  if (!/^\d{5}(-\d{4})?$/.test(zip)) {
    showError("zipError", "ZIP code must be 5 digits or ZIP+4.");
    isValid = false;
  }

  /* Gender */
  if (!getSelectedRadioValue("gender")) {
    showError("genderError", "Please select a gender.");
    isValid = false;
  }

  /* Vaccinated */
  if (!getSelectedRadioValue("vaccinated")) {
    showError("vaccinatedError", "Please select yes or no.");
    isValid = false;
  }

  /* Insurance */
  if (!getSelectedRadioValue("insurance")) {
    showError("insuranceError", "Please select yes or no.");
    isValid = false;
  }

  /* User ID */
  var userId = document.getElementById("userId").value.trim().toLowerCase();
  document.getElementById("userId").value = userId;

  if (!/^[a-z][a-z0-9_-]{4,29}$/.test(userId)) {
    showError(
      "userIdError",
      "User ID must be 5 to 30 characters, start with a letter, and contain only letters, numbers, dashes, or underscores."
    );
    isValid = false;
  }

  /* Password */
  var pw1 = document.getElementById("pw1").value;
  var pw2 = document.getElementById("pw2").value;

  if (!validatePassword(pw1)) {
    showError(
      "pw1Error",
      "Password must be 8 to 30 characters and include uppercase, lowercase, a number, and a special character."
    );
    isValid = false;
  }

  if (pw2 === "") {
    showError("pw2Error", "Please re-enter your password.");
    isValid = false;
  } else if (pw1 !== pw2) {
    showError("pw2Error", "Passwords do not match.");
    isValid = false;
  }

  return isValid;
}

/* =========================
   DOB VALIDATION
========================= */
function validateDOB(dob) {
  var dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;

  if (!dobPattern.test(dob)) {
    showError("dobError", "Date of birth must be in MM/DD/YYYY format.");
    return false;
  }

  var parts = dob.split("/");
  var month = parseInt(parts[0], 10);
  var day = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  var dobDate = new Date(year, month - 1, day);

  if (
    dobDate.getFullYear() !== year ||
    dobDate.getMonth() !== month - 1 ||
    dobDate.getDate() !== day
  ) {
    showError("dobError", "Please enter a real calendar date.");
    return false;
  }

  var today = new Date();
  var oldestDate = new Date();
  oldestDate.setFullYear(today.getFullYear() - 120);

  if (dobDate > today) {
    showError("dobError", "Date of birth cannot be in the future.");
    return false;
  }

  if (dobDate < oldestDate) {
    showError("dobError", "Date of birth cannot be more than 120 years ago.");
    return false;
  }

  return true;
}

/* =========================
   EMAIL VALIDATION
========================= */
function validateEmail(email) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/* =========================
   PASSWORD VALIDATION
========================= */
function validatePassword(password) {
  var passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%^&*()\-_+=\\/><.,`~])[^\"]{8,30}$/;
  return passwordPattern.test(password);
}

/* =========================
   DISPLAY REVIEW
========================= */
function displayReview() {
  var firstName = document.getElementById("firstName").value.trim();
  var middleInitial = document.getElementById("middleInitial").value.trim();
  var lastName = document.getElementById("lastName").value.trim();
  var dob = document.getElementById("dob").value.trim();
  var ssn = document.getElementById("ssn").value.trim();
  var email = document.getElementById("email").value.trim();
  var phone = document.getElementById("phone").value.trim();
  var addr1 = document.getElementById("addr1").value.trim();
  var addr2 = document.getElementById("addr2").value.trim();
  var city = document.getElementById("city").value.trim();
  var state = document.getElementById("state").value;
  var zip = document.getElementById("zip").value.trim();
  var symptoms = document.getElementById("symptoms").value.trim();
  var healthScale = document.getElementById("healthScale").value;
  var userId = document.getElementById("userId").value.trim().toLowerCase();
  var password = document.getElementById("pw1").value;

  document.getElementById("userId").value = userId;

  var fullName = firstName;
  if (middleInitial !== "") {
    fullName += " " + middleInitial + ".";
  }
  fullName += " " + lastName;

  var fullAddress = addr1;
  if (addr2 !== "") {
    fullAddress += "<br>" + addr2;
  }
  fullAddress += "<br>" + city + ", " + state + " " + truncateZip(zip);

  document.getElementById("reviewName").textContent = fullName;
  document.getElementById("reviewDob").textContent = dob;
  document.getElementById("reviewSsn").textContent = formatSSN(ssn);
  document.getElementById("reviewEmail").textContent = email;
  document.getElementById("reviewPhone").textContent = phone;
  document.getElementById("reviewAddress").innerHTML = fullAddress;
  document.getElementById("reviewHistory").textContent = getCheckedValues("history");
  document.getElementById("reviewGender").textContent = getSelectedRadioValue("gender");
  document.getElementById("reviewVaccinated").textContent =
    getSelectedRadioValue("vaccinated");
  document.getElementById("reviewInsurance").textContent =
    getSelectedRadioValue("insurance");
  document.getElementById("reviewHealthScale").textContent = healthScale;
  document.getElementById("reviewSymptoms").textContent =
    symptoms === "" ? "None entered" : symptoms;
  document.getElementById("reviewUserId").textContent = userId;
  document.getElementById("reviewPassword").textContent = maskPassword(password);

  document.getElementById("reviewSection").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* =========================
   HELPER FUNCTIONS
========================= */
function getCheckedValues(name) {
  var checkboxes = document.getElementsByName(name);
  var selected = [];

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      selected.push(checkboxes[i].value);
    }
  }

  if (selected.length === 0) {
    return "None selected";
  }

  return selected.join(", ");
}

function getSelectedRadioValue(name) {
  var radios = document.getElementsByName(name);

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }

  return "";
}

function formatSSN(ssn) {
  var digits = ssn.replace(/\D/g, "");

  if (digits.length === 9) {
    return (
      digits.substring(0, 3) +
      "-" +
      digits.substring(3, 5) +
      "-" +
      digits.substring(5)
    );
  }

  return ssn;
}

function truncateZip(zip) {
  return zip.substring(0, 5);
}

function maskPassword(password) {
  var masked = "";

  for (var i = 0; i < password.length; i++) {
    masked += "*";
  }

  return masked;
}

function showError(errorId, message) {
  var errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearAllErrors() {
  var errors = document.querySelectorAll(".error");

  for (var i = 0; i < errors.length; i++) {
    errors[i].textContent = "";
  }
}

function clearReview() {
  document.getElementById("reviewName").textContent = "";
  document.getElementById("reviewDob").textContent = "";
  document.getElementById("reviewSsn").textContent = "";
  document.getElementById("reviewEmail").textContent = "";
  document.getElementById("reviewPhone").textContent = "";
  document.getElementById("reviewAddress").innerHTML = "";
  document.getElementById("reviewHistory").textContent = "";
  document.getElementById("reviewGender").textContent = "";
  document.getElementById("reviewVaccinated").textContent = "";
  document.getElementById("reviewInsurance").textContent = "";
  document.getElementById("reviewHealthScale").textContent = "";
  document.getElementById("reviewSymptoms").textContent = "";
  document.getElementById("reviewUserId").textContent = "";
  document.getElementById("reviewPassword").textContent = "";
}
