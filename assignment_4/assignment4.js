/*
Program name: assignment4.js
Author: Athulya Nair
Date created: 05/08/2026
Description: JavaScript for Assignment 4 Patient Registration Form.
Includes validation, review button, Fetch API, cookies, and local storage.
*/

document.addEventListener("DOMContentLoaded", function () {
  setBannerDate();
  loadStates();
  setupSlider();
  setupLiveValidation();
  setupReviewButton();
  setupValidateButton();
  setupResetButton();
  setupFormSubmit();
  hideSubmitButtonInitially();
  checkReturningUser();
});

/* =========================
   DATE / HEADER
========================= */
function setBannerDate() {
  var today = new Date();
  document.getElementById("todayDate").textContent = today.toDateString();
}

/* =========================
   FETCH API - STATE LIST
========================= */
async function loadStates() {
  var stateDropdown = document.getElementById("state");

  if (!stateDropdown) return;

  try {
    const response = await fetch("states.json");

    if (!response.ok) {
      throw new Error("Could not load states.json");
    }

    const states = await response.json();

    states.forEach(function (state) {
      var option = document.createElement("option");
      option.value = state.abbreviation;
      option.textContent = state.name;
      stateDropdown.appendChild(option);
    });

    loadLocalData();

  } catch (error) {
    console.log("Fetch error:", error);
  }
}

/* =========================
   COOKIES
========================= */
function setCookie(name, value, hours) {
  var date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  document.cookie =
    name + "=" + encodeURIComponent(value) +
    "; expires=" + date.toUTCString() +
    "; path=/";
}

function getCookie(name) {
  var cookieName = name + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookies = decodedCookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var c = cookies[i].trim();

    if (c.indexOf(cookieName) === 0) {
      return c.substring(cookieName.length, c.length);
    }
  }

  return "";
}

function deleteCookie(name) {
  document.cookie =
    name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function checkReturningUser() {
  var savedName = getCookie("firstName");
  var welcomeMessage = document.getElementById("welcomeMessage");
  var newUserBox = document.getElementById("newUserBox");
  var notUserText = document.getElementById("notUserText");

  if (savedName !== "") {
    welcomeMessage.textContent = "Welcome back, " + savedName;
    document.getElementById("firstName").value = savedName;

    if (newUserBox && notUserText) {
      newUserBox.style.display = "block";
      notUserText.textContent =
        "Not " + savedName + "? Click here to start as a new user.";
    }

  } else {
    welcomeMessage.textContent = "Welcome New User";

    if (newUserBox) {
      newUserBox.style.display = "none";
    }
  }
}

function startNewUser() {
  deleteCookie("firstName");
  localStorage.clear();

  var form = document.getElementById("patientForm");
  if (form) {
    form.reset();
  }

  clearAllErrors();
  clearReview();
  hideSubmitButton();

  document.getElementById("welcomeMessage").textContent = "Welcome New User";

  var newUserBox = document.getElementById("newUserBox");
  if (newUserBox) {
    newUserBox.style.display = "none";
  }
}

/* =========================
   LOCAL STORAGE
========================= */
function saveLocalData() {
  var rememberMe = document.getElementById("rememberMe");

  if (rememberMe && !rememberMe.checked) {
    deleteCookie("firstName");
    localStorage.clear();
    return;
  }

  var firstName = document.getElementById("firstName").value.trim();

  if (firstName !== "") {
    setCookie("firstName", firstName, 48);
  }

  saveValue("middleInitial");
  saveValue("lastName");
  saveValue("email");
  saveValue("phone");
  saveValue("addr1");
  saveValue("addr2");
  saveValue("city");
  saveValue("state");
  saveValue("zip");
  saveValue("symptoms");
  saveValue("userId");
  saveValue("healthScale");

  saveCheckboxGroup("history");
  saveRadioGroup("gender");
  saveRadioGroup("vaccinated");
  saveRadioGroup("insurance");
}

function saveValue(id) {
  var field = document.getElementById(id);

  if (field) {
    localStorage.setItem(id, field.value);
  }
}

function loadLocalData() {
  loadValue("middleInitial");
  loadValue("lastName");
  loadValue("email");
  loadValue("phone");
  loadValue("addr1");
  loadValue("addr2");
  loadValue("city");
  loadValue("state");
  loadValue("zip");
  loadValue("symptoms");
  loadValue("userId");
  loadValue("healthScale");

  loadCheckboxGroup("history");
  loadRadioGroup("gender");
  loadRadioGroup("vaccinated");
  loadRadioGroup("insurance");

  var slider = document.getElementById("healthScale");
  var healthValue = document.getElementById("healthValue");

  if (slider && healthValue) {
    healthValue.textContent = slider.value;
  }
}

function loadValue(id) {
  var saved = localStorage.getItem(id);
  var field = document.getElementById(id);

  if (saved !== null && field) {
    field.value = saved;
  }
}

function saveCheckboxGroup(name) {
  var checkboxes = document.getElementsByName(name);
  var selected = [];

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      selected.push(checkboxes[i].value);
    }
  }

  localStorage.setItem(name, JSON.stringify(selected));
}

function loadCheckboxGroup(name) {
  var saved = localStorage.getItem(name);

  if (!saved) return;

  var selected = JSON.parse(saved);
  var checkboxes = document.getElementsByName(name);

  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = selected.includes(checkboxes[i].value);
  }
}

function saveRadioGroup(name) {
  var selected = getSelectedRadioValue(name);
  localStorage.setItem(name, selected);
}

function loadRadioGroup(name) {
  var saved = localStorage.getItem(name);
  var radios = document.getElementsByName(name);

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].value === saved) {
      radios[i].checked = true;
    }
  }
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
      saveLocalData();
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
   VALIDATION SETUP
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
      saveLocalData();
      updateSubmitVisibility();
    });

    field.addEventListener("blur", function () {
      validationFunction();
      saveLocalData();
      updateSubmitVisibility();
    });
  }
}

function setupRadioValidation(groupName, errorId) {
  var radios = document.getElementsByName(groupName);

  for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", function () {
      validateRadioGroup(groupName, errorId, "Please select an option.");
      saveLocalData();
      updateSubmitVisibility();
    });
  }
}

/* =========================
   BUTTONS
========================= */
function setupReviewButton() {
  var reviewBtn = document.getElementById("reviewBtn");

  if (reviewBtn) {
    reviewBtn.addEventListener("click", function () {
      if (validateForm()) {
        displayReview();
      }
    });
  }
}

function setupValidateButton() {
  var validateBtn = document.getElementById("validateBtn");

  if (validateBtn) {
    validateBtn.addEventListener("click", function () {
      if (validateForm()) {
        displayReview();
        showSubmitButton();
      } else {
        hideSubmitButton();
      }
    });
  }
}

function setupResetButton() {
  var form = document.getElementById("patientForm");

  if (form) {
    form.addEventListener("reset", function () {
      setTimeout(function () {
        clearAllErrors();
        clearReview();
        hideSubmitButton();
        localStorage.clear();
        deleteCookie("firstName");
        document.getElementById("welcomeMessage").textContent = "Welcome New User";
      }, 0);
    });
  }
}

function setupFormSubmit() {
  var form = document.getElementById("patientForm");

  if (form) {
    form.addEventListener("submit", function () {
      saveLocalData();
    });
  }
}

function showSubmitButton() {
  document.getElementById("submitBtn").style.display = "inline-block";
}

function hideSubmitButton() {
  document.getElementById("submitBtn").style.display = "none";
}

/* =========================
   VALIDATE FORM
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

  if (!validateRadioGroup("gender", "genderError", "Please select a gender.")) isValid = false;
  if (!validateRadioGroup("vaccinated", "vaccinatedError", "Please select yes or no.")) isValid = false;
  if (!validateRadioGroup("insurance", "insuranceError", "Please select yes or no.")) isValid = false;

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
   FIELD VALIDATION
========================= */
function validateFirstName() {
  var firstName = document.getElementById("firstName").value.trim();

  if (!/^[A-Za-z'-]{1,30}$/.test(firstName)) {
    showError("firstNameError", "First name must be 1 to 30 letters only.");
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
    showError("lastNameError", "Last name must be 1 to 30 letters only.");
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
    showError("ssnError", "Enter SSN in the format XXX-XX-XXXX.");
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
    showError("emailError", "Enter a valid email address.");
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
    showError("cityError", "City must be 2 to 30 valid characters.");
    return false;
  }

  showError("cityError", "");
  return true;
}

function validateState() {
  var state = document.getElementById("state").value;

  if (state === "") {
    showError("stateError", "Please select a state.");
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
    showError("userIdError", "User ID must be 5 to 20 characters and start with a letter.");
    return false;
  }

  showError("userIdError", "");
  return true;
}

function validatePassword1() {
  var pw1 = document.getElementById("pw1").value;
  var userId = document.getElementById("userId").value.trim().toLowerCase();

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw1)) {
    showError("pw1Error", "Password must include uppercase, lowercase, and a number.");
    return false;
  }

  if (pw1.toLowerCase() === userId && userId !== "") {
    showError("pw1Error", "Password cannot be the same as User ID.");
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
  if (!getSelectedRadioValue(groupName)) {
    showError(errorId, message);
    return false;
  }

  showError(errorId, "");
  return true;
}

/* =========================
   SILENT VALIDATION
========================= */
function validateFirstNameSilently() {
  return /^[A-Za-z'-]{1,30}$/.test(document.getElementById("firstName").value.trim());
}

function validateMiddleInitialSilently() {
  var value = document.getElementById("middleInitial").value.trim();
  return value === "" || /^[A-Za-z]$/.test(value);
}

function validateLastNameSilently() {
  return /^[A-Za-z'-]{1,30}$/.test(document.getElementById("lastName").value.trim());
}

function validateDOBSilently() {
  return validateDOBValueSilent(document.getElementById("dob").value.trim());
}

function validateSSNSilently() {
  return /^\d{3}-\d{2}-\d{4}$/.test(document.getElementById("ssn").value.trim());
}

function validateEmailSilently() {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById("email").value.trim());
}

function validatePhoneSilently() {
  return /^\d{3}-\d{3}-\d{4}$/.test(document.getElementById("phone").value.trim());
}

function validateAddr1Silently() {
  var value = document.getElementById("addr1").value.trim();
  return value.length >= 2 && value.length <= 30;
}

function validateAddr2Silently() {
  var value = document.getElementById("addr2").value.trim();
  return value === "" || (value.length >= 2 && value.length <= 30);
}

function validateCitySilently() {
  return /^[A-Za-z .'-]{2,30}$/.test(document.getElementById("city").value.trim());
}

function validateStateSilently() {
  return document.getElementById("state").value !== "";
}

function validateZipSilently() {
  return /^\d{5}$/.test(document.getElementById("zip").value.trim());
}

function validateRadioSilently(groupName) {
  return getSelectedRadioValue(groupName) !== "";
}

function validateUserIdSilently() {
  return /^[a-z][a-z0-9_-]{4,19}$/.test(document.getElementById("userId").value.trim());
}

function validatePassword1Silently() {
  var pw1 = document.getElementById("pw1").value;
  var userId = document.getElementById("userId").value.trim().toLowerCase();

  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pw1) &&
    !(pw1.toLowerCase() === userId && userId !== "");
}

function validatePassword2Silently() {
  return document.getElementById("pw1").value === document.getElementById("pw2").value &&
    document.getElementById("pw2").value !== "";
}

/* =========================
   DOB HELPERS
========================= */
function validateDOBValue(dob) {
  var dobPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;

  if (!dobPattern.test(dob)) {
    showError("dobError", "Date of birth must be in MM/DD/YYYY format.");
    return false;
  }

  var parts = dob.split("/");
  var dobDate = new Date(parts[2], parts[0] - 1, parts[1]);
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

  if (!dobPattern.test(dob)) return false;

  var parts = dob.split("/");
  var dobDate = new Date(parts[2], parts[0] - 1, parts[1]);
  var today = new Date();
  var oldestDate = new Date();
  oldestDate.setFullYear(today.getFullYear() - 120);

  return dobDate <= today && dobDate >= oldestDate;
}

/* =========================
   SSN / REVIEW
========================= */
function formatSSNLive(input) {
  var digits = input.value.replace(/\D/g, "").substring(0, 9);

  if (digits.length > 5) {
    input.value = digits.substring(0, 3) + "-" + digits.substring(3, 5) + "-" + digits.substring(5);
  } else if (digits.length > 3) {
    input.value = digits.substring(0, 3) + "-" + digits.substring(3);
  } else {
    input.value = digits;
  }
}

function formatSSNForReview(ssn) {
  return ssn;
}

function displayReview() {
  var firstName = document.getElementById("firstName").value.trim();
  var middleInitial = document.getElementById("middleInitial").value.trim();
  var lastName = document.getElementById("lastName").value.trim();

  var fullName = firstName;
  if (middleInitial !== "") {
    fullName += " " + middleInitial + ".";
  }
  fullName += " " + lastName;

  var addr1 = document.getElementById("addr1").value.trim();
  var addr2 = document.getElementById("addr2").value.trim();
  var city = document.getElementById("city").value.trim();
  var state = document.getElementById("state").value;
  var zip = document.getElementById("zip").value.trim();

  var fullAddress = addr1;
  if (addr2 !== "") {
    fullAddress += "<br>" + addr2;
  }
  fullAddress += "<br>" + city + ", " + state + " " + zip;

  document.getElementById("reviewName").textContent = fullName;
  document.getElementById("reviewDob").textContent = document.getElementById("dob").value;
  document.getElementById("reviewSsn").textContent = formatSSNForReview(document.getElementById("ssn").value);
  document.getElementById("reviewEmail").textContent = document.getElementById("email").value;
  document.getElementById("reviewPhone").textContent = document.getElementById("phone").value;
  document.getElementById("reviewAddress").innerHTML = fullAddress;
  document.getElementById("reviewHistory").textContent = getCheckedValues("history");
  document.getElementById("reviewGender").textContent = getSelectedRadioValue("gender");
  document.getElementById("reviewVaccinated").textContent = getSelectedRadioValue("vaccinated");
  document.getElementById("reviewInsurance").textContent = getSelectedRadioValue("insurance");
  document.getElementById("reviewHealthScale").textContent = document.getElementById("healthScale").value;
  document.getElementById("reviewSymptoms").textContent =
    document.getElementById("symptoms").value.trim() || "None entered";
  document.getElementById("reviewUserId").textContent = document.getElementById("userId").value;
  document.getElementById("reviewPassword").textContent = maskPassword(document.getElementById("pw1").value);

  saveLocalData();
}

/* =========================
   HELPERS
========================= */
function getCheckedValues(name) {
  var checkboxes = document.getElementsByName(name);
  var selected = [];

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      selected.push(checkboxes[i].value);
    }
  }

  return selected.length === 0 ? "None selected" : selected.join(", ");
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
  return "*".repeat(password.length);
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
  var reviewIds = [
    "reviewName",
    "reviewDob",
    "reviewSsn",
    "reviewEmail",
    "reviewPhone",
    "reviewHistory",
    "reviewGender",
    "reviewVaccinated",
    "reviewInsurance",
    "reviewHealthScale",
    "reviewSymptoms",
    "reviewUserId",
    "reviewPassword"
  ];

  for (var i = 0; i < reviewIds.length; i++) {
    document.getElementById(reviewIds[i]).textContent = "";
  }

  document.getElementById("reviewAddress").innerHTML = "";
}
