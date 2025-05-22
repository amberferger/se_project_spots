import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/validation.js";

import "./index.css";
import { Api } from "../utils/Api.js";
import { apiKey } from "../utils/constants.js";
import { setButtonText } from "../utils/helpers.js";

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
const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = document.forms["edit-profile"];
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const profileName = document.querySelector(".profile__name");
const profileJob = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__avatar");
const profileNameInput = editProfileModal.querySelector("#profile-name-input");
const profileJobInput = editProfileModal.querySelector(
  "#profile-description-input"
);

// edit avatar variables
const editAvatarButton = document.querySelector(".profile__avatar-button");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.forms["edit-avatar"];
const editAvatarInput = editAvatarModal.querySelector("#profile-avatar-input");
const editAvatarSubmitButton = editAvatarModal.querySelector(
  ".modal__submit-button"
);
const editAvatarCloseButton = editAvatarModal.querySelector(
  ".modal__close-button"
);

// new post variables
const newPostButton = document.querySelector(".profile__new-post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = document.forms["new-post"];
const newPostSubmitButton = newPostForm.querySelector(".modal__submit-button");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostLinkInput = newPostModal.querySelector("#image-link-input");
const newPostCaptionInput = newPostModal.querySelector("#caption-input");

// card template variables
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

// delete post
const deletePostModal = document.querySelector("#delete-modal");
const deletePostForm = document.forms["delete-post"];

// preview image elements
const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button_type_preview"
);

// variables to hold the selected card and ID -- will be defined when a user clicks on a card
let selectedCard;
let selectedCardID;

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

  const submitButton = evt.submitter;
  // Display "Saving..." when request being sent
  setButtonText(submitButton, true);

  api
    .editUserInfo({
      name: profileNameInput.value,
      about: profileJobInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileJob.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      // change back to "Save" once complete
      setButtonText(submitButton, false);
    });
}

// update avatar
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  // Display "Saving..." when request being sent
  setButtonText(submitButton, true);

  api
    .editProfilePicture(editAvatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => {
      // change back to "Save" once complete
      setButtonText(submitButton, false);
    });
}

// add new card
function handlePostFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  // Display "Saving..." when request being sent
  setButtonText(submitButton, true);

  api
    .addCard({ name: newPostCaptionInput.value, link: newPostLinkInput.value })
    .then((data) => {
      const newData = {
        name: data.name,
        link: data.link,
        _id: data._id,
      };

      // add card to browser
      const newCardContent = getCardElement(newData);
      cardsList.prepend(newCardContent);

      // reset input values
      evt.target.reset();

      // disable submit button
      disableButton(newPostSubmitButton, settings);

      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      // change back to "Save" once complete
      setButtonText(submitButton, false);
    });
}

// delete card from screen
function handleDeleteFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  // Display "Saving..." when request being sent
  setButtonText(submitButton, true, "Deleting...", "Delete");

  api
    .deleteCard(selectedCardID)
    .then(() => {
      // remove the card from the DOM
      selectedCard.remove();
      // close the modal
      closeModal(deletePostModal);
    })
    .catch(console.error)
    .finally(() => {
      // change back to "Save" once complete
      setButtonText(submitButton, false, "Deleting...", "Delete");
    });
}

// open delete confirmation modal
function handleDeleteCard(cardElement, cardId) {
  // set the selected card & id to what was clicked
  selectedCard = cardElement;
  selectedCardID = cardId;
  openModal(deletePostModal);
}

// toggle like button
function handleLike(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__like-button-liked");
  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button-liked");
    })
    .catch(console.error);
}

// get card element details
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

  // set liked status to last saved
  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button-liked");
  }

  // card like button
  cardLikeButton.addEventListener("click", (evt) => {
    handleLike(evt, data._id);
  });

  // card trash button
  cardTrashButton.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
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
OPEN MODALS
****************************/

// open profile modal
editProfileButton.addEventListener("click", () => {
  profileNameInput.value = profileName.textContent;
  profileJobInput.value = profileJob.textContent;
  resetValidation(
    editProfileForm,
    [profileNameInput, profileJobInput],
    settings
  ); // clear the validation errors
  openModal(editProfileModal);
});

// open new post modal
newPostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

// open edit avatar modal
editAvatarButton.addEventListener("click", () => {
  // clear validation errors
  resetValidation(editAvatarForm, [editAvatarInput], settings);
  openModal(editAvatarModal);
});

/****************************
CLOSE MODALS
****************************/

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

/****************************
SUBMIT FORM CONTENT
****************************/

// save new name & description in profile modal
editProfileForm.addEventListener("submit", handleProfileFormSubmit);

// save new profile picture
editAvatarForm.addEventListener("submit", handleAvatarFormSubmit);

// save image & caption form
newPostForm.addEventListener("submit", handlePostFormSubmit);

// delete the card when clicking on the
deletePostForm.addEventListener("submit", handleDeleteFormSubmit);

enableValidation(settings);
