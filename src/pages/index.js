import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";

import "./index.css";
import { Api } from "../utils/Api.js";
import { apiKey } from "../utils/constants.js";

/****************************
CARD INFORMATION
****************************/
// const initialCards = [
//   {
//     name: "Banff",
//     link: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     name: "Lisbon",
//     link: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     name: "London",
//     link: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     name: "Dublin",
//     link: "https://images.unsplash.com/photo-1518005068251-37900150dfca?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     name: "Munich",
//     link: "https://images.unsplash.com/photo-1595867818082-083862f3d630?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     name: "Edinburgh",
//     link: "https://images.unsplash.com/photo-1610991136128-838ca3c5497b?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
// ];

/****************************
VARIABLES
****************************/
// all modals
const allModals = Array.from(document.querySelectorAll(".modal"));

// edit profile variables
const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileFormElement = document.forms["edit-profile"];
const profileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const profileName = document.querySelector(".profile__name");
const profileJob = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const nameInput = editProfileModal.querySelector("#profile-name-input");
const jobInput = editProfileModal.querySelector("#profile-description-input");

// new post variables
const newPostButton = document.querySelector(".profile__new-post-button");
const createPostModal = document.querySelector("#new-post-modal");
const postFormElement = document.forms["new-post"];
const newPostSubmitButton = postFormElement.querySelector(
  ".modal__submit-button"
);
const postCloseButton = createPostModal.querySelector(".modal__close-button");
const postLinkInput = createPostModal.querySelector("#image-link-input");
const postCaptionInput = createPostModal.querySelector("#caption-input");

// card template variables
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// variables to hold the selected card and ID -- will be defined when a user clicks on a card
let selectedCard;
let selectedCardID;

// delete post
const deleteModal = document.querySelector("#delete-modal");
const deleteFormElement = document.forms["delete-post"];

// preview image elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button_type_preview"
);

/****************************
PAGE SETUP
****************************/

// create class to call the API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: apiKey,
    "Content-Type": "application/json",
  },
});

// create card content
api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    // render initial cards
    cards.forEach((item) => {
      const cardContent = getCardElement(item);
      cardsList.prepend(cardContent);
    });

    // set user profile
    profileName.textContent = userInfo.name;
    profileJob.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;
  })
  // if error when rendering cards, log to console
  .catch(console.error);

/****************************
FUNCTIONS
****************************/

// escape button to close modal
function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedPopup = document.querySelector(".modal_opened");
    closeModal(openedPopup);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscape); // allow modal to be closed when escape button is pressed
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscape); // remove escape button functionality
}

// update profile name and description
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  api
    .editUserInfo({ name: nameInput.value, about: jobInput.value })
    .then((data) => {
      profileName.textContent = data.name;
      profileJob.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error);
}

// add new card
function handlePostFormSubmit(evt) {
  evt.preventDefault();

  api
    .addCard({ name: postCaptionInput.value, link: postLinkInput.value })
    .then((data) => {
      const newData = {
        name: data.name,
        link: data.link,
      };

      // add card to browser
      const newCardContent = getCardElement(newData);
      cardsList.prepend(newCardContent);

      // reset input values
      evt.target.reset();

      // disable submit button
      disableButton(newPostSubmitButton, settings);

      closeModal(createPostModal);
    })
    .catch(console.error);
}

// delete card from screen
function handleDeleteSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardID)
    .then(() => {
      // remove the card from the DOM
      selectedCard.remove();
      // close the modal
      closeModal(deleteModal);
    })
    .catch(console.error);
}

// open delete confirmation modal
function handleDeleteCard(cardElement, cardId) {
  // set the selected card & id to what was clicked
  selectedCard = cardElement;
  selectedCardID = cardId;
  openModal(deleteModal);
}

function getCardElement(data) {
  // clone the template
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardTrashButton = cardElement.querySelector(".card__trash-button");

  // change image link, image alt text, and card title
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  // card like button
  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button-liked");
  });

  // card trash button
  cardTrashButton.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
    //cardElement.remove();
  });

  // card preview
  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
  });

  return cardElement;
}

/****************************
ACTIONS
****************************/

// open profile modal
profileEditButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  resetValidation(profileFormElement, [nameInput, jobInput], settings); // clear the validation errors
  openModal(editProfileModal);
});

// open new post modal
newPostButton.addEventListener("click", () => {
  openModal(createPostModal);
});

// Find all close buttons
const closeButtons = document.querySelectorAll(".modal__close-button");

// close all modals
closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

// close when clicking anywhere in the overlay
allModals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    // Close only if clicking the overlay (modal background)
    if (event.target === event.currentTarget) {
      closeModal(modal);
    }
  });
});

// save new name & description in profile modal
profileFormElement.addEventListener("submit", handleProfileFormSubmit);

// save image & caption form
postFormElement.addEventListener("submit", handlePostFormSubmit);

// delete the card when clicking on the
deleteFormElement.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);
