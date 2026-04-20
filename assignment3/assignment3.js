/*
Program name: homework3.js
Author: Athulya Nair
Date created: 04/20/2026
Version: 1.0
Description: External JavaScript for Homework 3 Patient Registration Form with
live validation, validate button workflow, and submit enabled only when all
fields are valid.
*/

document.addEventListener("DOMContentLoaded", function () {
  setBannerDate();
  setupSlider();
  setupLiveValidation();
  setupReviewButton();
  setupValidateButton();
  setupResetButton();
  hideSubmitButtonInitially();
});

/* =========================
   INITIAL PAGE SETUP
========================= */
function setBannerDate() {
  var today = new Date();
  document.getElementById("todayDate").textContent = today.toDateString();
}

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

function hideSubmitButtonInitially() {
  var submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.style.display = "none";
  }
}

/* =========================
   LIVE VALIDATION SETUP
========================= */
function setupLiveValidation() {
  setupFieldValidation("firstName", validateFirstName);
  setupFieldValidation("middleInitial", validateMiddleInitial);
  setupFieldValidation("lastName", validateLastName);
  setupFieldValidation("dob", validateDOBField);
  setupFieldValidation("email", validateEmailField);
  setupFieldValidation("phone", validatePhone);
  setupFieldValidation("addr1", validateAddr1);
  setupFieldValidation("addr2", validateAddr2);
  setupFieldValidation("city", validateCity);
  setupFieldValidation("state", validateState);
  setupFieldValidation("zip", validateZip);
  setupFieldValidation("userId", validateUserId);
  setupFieldValidation("pw1", validatePassword1);
  setupFieldValidation("pw2", validatePassword2);

  var ssn = document.getElementById("ssn");
  if (ssn) {
    ssn.addEventListener("input", function () {
      formatSSNLive(ssn);
      validateSSN();
      updateSubmitVisibility();
    });

    ssn.addEventListener("blur", function () {
      validateSSN();
      updateSubmitVisibility();
    });
  }

  var email = document.getElementById("email");
  if (email) {
    email.addEventListener("input", function () {
      email.value = email.value.toLowerCase();
    });
  }

  var userId = document.getElementById("userId");
  if (userId) {
    userId.addEventListener("input", function () {
      userId.value = userId.value.toLowerCase();
      validateUserId();
      validatePassword1();
      validatePassword2();
      updateSubmitVisibility();
    });
  }

  setupRadioValidation("gender", "genderError");
  setupRadioValidation("vaccinated", "vaccinatedError");
  setupRadioValidation("insurance", "insuranceError");
}

function setupFieldValidation(fieldId, validationFunction) {
  var field = document.getElementById(fieldId);

  if (field) {
    field.addEventListener("input", function () {
      validationFunction();
      updateSubmitVisibility();
    });

    field.addEventListener("blur", function () {
      validationFunction();
      updateSubmitVisibility();
    });
  }
}

function setupRadioValidation(groupName, errorId) {
  var radios = document.getElementsByName(groupName);

  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", function () {
      validateRadioGroup(groupName, errorId, "Please select an option.");
      updateSubmitVisibility();
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
      var isValid = validateForm();

      if (isValid) {
        displayReview();
      }
    });
  }
}

/* =========================
   VALIDATE BUTTON
========================= */
function setupValidateButton() {
  var validateBtn = document.getElementById("validateBtn");

  if (validateBtn) {
    validateBtn.addEventListener("click", function () {
      var isValid = validateForm();

      if (isValid) {
        displayReview();
        showSubmitButton();
      } else {
        hideSubmitButton();
      }
    });
  }
}

function showSubmitButton() {
  var submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.style.display = "inline-block";
  }
}

function hideSubmitButton() {
  var submitBtn = document.getElementById("submitBtn");
  if (submitBtn) {
    submitBtn.style.display = "none";
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
        hideSubmitButton();

        var slider = document.getElementById("healthScale");
        var healthValue = document.getElementById("healthValue");
        if (slider && healthValue) {
          healthValue.textContent = slider.value;
        }
      }, 0);
    });
  }
}

/* =========================
   MAIN FORM VALIDATION
========================= */
function validateForm() {
  var isValid = true;

  if (!validateFirstName()) isValid = false;
  if (!validateMiddleInitial()) isValid = false;
  if (!validateLastName()) isValid = false;
  if (!validateDOBField()) isValid = false;
  if (!validateSSN()) isValid = false;
  if (!validateEmailField()) isValid = false;
  if (!validatePhone()) isValid = false;
  if (!validateAddr1()) isValid = false;
  if (!validateAddr2()) isValid = false;
  if (!validateCity()) isValid = false;
  if (!validateState()) isValid = false;
  if (!validateZip()) isValid = false;

  if (!validateRadioGroup("gender", "genderError", "Please select a gender.")) {
    isValid = false;
  }

  if (
    !validateRadioGroup("vaccinated", "vaccinatedError", "Please select yes or no.")
  ) {
    isValid = false;
  }

  if (
    !validateRadioGroup("insurance", "insuranceError", "Please select yes or no.")
  ) {
    isValid = false;
  }

  if (!validateUserId()) isValid = false;
  if (!validatePassword1()) isValid = false;
  if (!validatePassword2()) isValid = false;

  return isValid;
}

function updateSubmitVisibility() {
  if (allFieldsValid()) {
    showSubmitButton();
  } else {
    hideSubmitButton();
  }
}

function allFieldsValid() {
  return (
    validateFirstNameSilently() &&
    validateMiddleInitialSilently() &&
    validateLastNameSilently() &&
    validateDOBSilently() &&
    validateSSNSilently() &&
    validateEmailSilently() &&
    validatePhoneSilently() &&
    validateAddr1Silently() &&
    validateAddr2Silently() &&
    validateCitySilently() &&
    validateStateSilently() &&
    validateZipSilently() &&
    validateRadioSilently("gender") &&
    validateRadioSilently("vaccinated") &&
    validateRadioSilently("insurance") &&
    validateUserIdSilently() &&
    validatePassword1Silently() &&
    validatePassword2Silently()
  );
}

/* =========================
   INDIVIDUAL FIELD VALIDATION
========================= */
function validateFirstName() {
  var firstName = document.getElementById("firstName").value.trim();

  if (!/^[A-Za-z'-]{1,30}$/.test(firstName)) {
    showError(
      "firstNameError",
      "First name must be 1 to 30 letters only. Apostrophes and dashes are allowed."
    );
    return false;
  }

  showError("firstNameError", "");
  return true;
}

function validateMiddleInitial() {
  var middleInitial = document.getElementById("middleInitial").value.trim();

  if (middleInitial !== "" && !/^[A-Za-z]$/.test(middleInitial)) {
    showError("middleInitialError", "Middle initial must be one letter only.");
    return false;
  }

  showError("middleInitialError", "");
  return true;
}

function validateLastName() {
  var lastName = document.getElementById("lastName").value.trim();

  if (!/^[A-Za-z'-]{1,30}$/.test(lastName)) {
    showError(
      "lastNameError",
      "Last name must be 1 to 30 letters only. Apostrophes and dashes are allowed."
    );
    return false;
  }

  showError("lastNameError", "");
  return true;
}

function validateDOBField() {
  var dob = document.getElementById("dob").value.trim();

  if (!validateDOBValue(dob)) {
    return false;
  }

  showError("dobError", "");
  return true;
}

function validateSSN() {
  var ssn = document.getElementById("ssn").value.trim();

  if (!/^\d{3}-\d{2}-\d{4}$/.test(ssn)) {
    showError("ssnError", "Enter 9 digits in the format XXX-XX-XXXX.");
    return false;
  }

  showError("ssnError", "");
  return true;
}

function validateEmailField() {
  var emailField = document.getElementById("email");
  var email = emailField.value.trim().toLowerCase();
  emailField.value = email;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError("emailError", "Enter a valid email address in the format name@domain.tld.");
    return false;
  }

  showError("emailError", "");
  return true;
}

function validatePhone() {
  var phone = document.getElementById("phone").value.trim();

  if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
    showError("phoneError", "Phone number must be in the format 000-000-0000.");
    return false;
  }

  showError("phoneError", "");
  return true;
}

function validateAddr1() {
  var addr1 = document.getElementById("addr1").value.trim();

  if (addr1.length < 2 || addr1.length > 30) {
    showError("addr1Error", "Address Line 1 must be 2 to 30 characters.");
    return false;
  }

  showError("addr1Error", "");
  return true;
}

function validateAddr2() {
  var addr2 = document.getElementById("addr2").value.trim();

  if (addr2 !== "" && (addr2.length < 2 || addr2.length > 30)) {
    showError("addr2Error", "Address Line 2 must be 2 to 30 characters if entered.");
    return false;
  }

  showError("addr2Error", "");
  return true;
}

function validateCity() {
  var city = document.getElementById("city").value.trim();

  if (!/^[A-Za-z .'-]{2,30}$/.test(city)) {
    showError("cityError", "City must be 2 to 30 characters and contain valid letters only.");
    return false;
  }

  showError("cityError", "");
  return true;
}

function validateState() {
  var state = document.getElementById("state").value;

  if (state === "") {
    showError("stateError", "Please select a state, DC, or PR.");
    return false;
  }

  showError("stateError", "");
  return true;
}

function validateZip() {
  var zip = document.getElementById("zip").value.trim();

  if (!/^\d{5}$/.test(zip)) {
    showError("zipError", "ZIP code must be exactly 5 digits.");
    return false;
  }

  showError("zipError", "");
  return true;
}

function validateUserId() {
  var userIdField = document.getElementById("userId");
  var userId = userIdField.value.trim().toLowerCase();
  userIdField.value = userId;

  if (!/^[a-z][a-z0-9_-]{4,19}$/.test(userId)) {
    showError(
      "userIdError",
      "User ID must be 5 to 20 characters, start with a letter, and contain only letters, numbers, dashes, or underscores."
    );
    return false;
  }

  showError("userIdError", "");
  return true;
}

function validatePassword1() {
  var pw1 = document.getElementById("pw1").value;
  var userId = document.getElementById("userId").value.trim().toLowerCase();

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw1)) {
    showError(
      "pw1Error",
      "Password must be at least 8 characters and include 1 uppercase letter, 1 lowercase letter, and 1 number."
    );
    return false;
  }

  if (pw1.toLowerCase() === userId && userId !== "") {
    showError("pw1Error", "Password cannot be the same as your User ID.");
    return false;
  }

  showError("pw1Error", "");
  return true;
}

function validatePassword2() {
  var pw1 = document.getElementById("pw1").value;
  var pw2 = document.getElementById("pw2").value;

  if (pw2 === "") {
    showError("pw2Error", "Please re-enter your password.");
    return false;
  }

  if (pw1 !== pw2) {
    showError("pw2Error", "Passwords do not match.");
    return false;
  }

  showError("pw2Error", "");
  return true;
}

function validateRadioGroup(groupName, errorId, message) {
  var selected = getSelectedRadioValue(groupName);

  if (!selected) {
    showError(errorId, message);
    return false;
  }

  showError(errorId, "");
  return true;
}

/* =========================
   SILENT VALIDATION HELPERS
========================= */
function validateFirstNameSilently() {
  var firstName = document.getElementById("firstName").value.trim();
  return /^[A-Za-z'-]{1,30}$/.test(firstName);
}

function validateMiddleInitialSilently() {
  var middleInitial = document.getElementById("middleInitial").value.trim();
  return middleInitial === "" || /^[A-Za-z]$/.test(middleInitial);
}

function validateLastNameSilently() {
  var lastName = document.getElementById("lastName").value.trim();
  return /^[A-Za-z'-]{1,30}$/.test(lastName);
}

function validateDOBSilently() {
  var dob = document.getElementById("dob").value.trim();
  return validateDOBValueSilent(dob);
}

function validateSSNSilently() {
  var ssn = document.getElementById("ssn").value.trim();
  return /^\d{3}-\d{2}-\d{4}$/.test(ssn);
}

function validateEmailSilently() {
  var email = document.getElementById("email").value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhoneSilently() {
  var phone = document.getElementById("phone").value.trim();
  return /^\d{3}-\d{3}-\d{4}$/.test(phone);
}

function validateAddr1Silently() {
  var addr1 = document.getElementById("addr1").value.trim();
  return addr1.length >= 2 && addr1.length <= 30;
}

function validateAddr2Silently() {
  var addr2 = document.getElementById("addr2").value.trim();
  return addr2 === "" || (addr2.length >= 2 && addr2.length <= 30);
}

function validateCitySilently() {
  var city = document.getElementById("city").value.trim();
  return /^[A-Za-z .'-]{2,30}$/.test(city);
}

function validateStateSilently() {
  var state = document.getElementById("state").value;
  return state !== "";
}

function validateZipSilently() {
  var zip = document.getElementById("zip").value.trim();
  return /^\d{5}$/.test(zip);
}

function validateRadioSilently(groupName) {
  return getSelectedRadioValue(groupName) !== "";
}

function validateUserIdSilently() {
  var userId = document.getElementById("userId").value.trim().toLowerCase();
  return /^[a-z][a-z0-9_-]{4,19}$/.test(userId);
}

function validatePassword1Silently() {
  var pw1 = document.getElementById("pw1").value;
  var userId = document.getElementById("userId").value.trim().toLowerCase();

  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw1) &&
    !(pw1.toLowerCase() === userId && userId !== "");
}

function validatePassword2Silently() {
  var pw1 = document.getElementById("pw1").value;
  var pw2 = document.getElementById("pw2").value;

  return pw2 !== "" && pw1 === pw2;
}

/* =========================
   DATE OF BIRTH HELPERS
========================= */
function validateDOBValue(dob) {
  var dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

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

function validateDOBValueSilent(dob) {
  var dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  if (!dobPattern.test(dob)) {
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
    return false;
  }

  var today = new Date();
  var oldestDate = new Date();
  oldestDate.setFullYear(today.getFullYear() - 120);

  if (dobDate > today) {
    return false;
  }

  if (dobDate < oldestDate) {
    return false;
  }

  return true;
}

/* =========================
   SSN FORMATTING
========================= */
function formatSSNLive(input) {
  var digits = input.value.replace(/\D/g, "").substring(0, 9);

  if (digits.length > 5) {
    input.value =
      digits.substring(0, 3) +
      "-" +
      digits.substring(3, 5) +
      "-" +
      digits.substring(5, 9);
  } else if (digits.length > 3) {
    input.value =
      digits.substring(0, 3) +
      "-" +
      digits.substring(3, 5);
  } else {
    input.value = digits;
  }
}

function formatSSNForReview(ssn) {
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

/* =========================
   REVIEW DISPLAY
========================= */
function displayReview() {
  var firstName = document.getElementById("firstName").value.trim();
  var middleInitial = document.getElementById("middleInitial").value.trim();
  var lastName = document.getElementById("lastName").value.trim();
  var dob = document.getElementById("dob").value.trim();
  var ssn = document.getElementById("ssn").value.trim();
  var email = document.getElementById("email").value.trim().toLowerCase();
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

  document.getElementById("email").value = email;
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
  fullAddress += "<br>" + city + ", " + state + " " + zip;

  document.getElementById("reviewName").textContent = fullName;
  document.getElementById("reviewDob").textContent = dob;
  document.getElementById("reviewSsn").textContent = formatSSNForReview(ssn);
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
