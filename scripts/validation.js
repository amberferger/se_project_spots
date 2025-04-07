// displays input error
const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  errorElement.textContent = errorMessage; // changes error message
  inputElement.classList.add("modal__input_type_error"); // styles the box when error occurs
};

// hides input error
const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  errorElement.textContent = ""; // removes error message
  inputElement.classList.remove("modal__input_type_error");
};

// checks validity of input element
const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

// checks to see if any input is invalid
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

// disable button
const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
};

// disables button if 1+ input is invalid
const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement); // disable button if 1+ invalid inputs
    buttonElement.classList.add("modal__submit-button_type_inactive");
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove("modal__submit-button_type_inactive");
  }
};

// hide the validation errors for each input
const resetValidation = (formElement, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input);
  });
};

// set the event listeners on the inputs
const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector(".modal__submit-button");

  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

// adding validation to each form
const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".modal__form"));
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

enableValidation();
