/****************************
CARD INFORMATION
****************************/
const initialCards = [
  {
    name: "Banff",
    link: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Lisbon",
    link: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "London",
    link: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Dublin",
    link: "https://images.unsplash.com/photo-1518005068251-37900150dfca?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Munich",
    link: "https://images.unsplash.com/photo-1595867818082-083862f3d630?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Edinburgh",
    link: "https://images.unsplash.com/photo-1610991136128-838ca3c5497b?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

/****************************
VARIABLES
****************************/
const profileEditButton = document.querySelector(".profile__edit-button");
const newPostButton = document.querySelector(".profile__new-post-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const createPostModal = document.querySelector("#new-post-modal");
const profileFormElement = editProfileModal.querySelector(".modal__form");
const profileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);
const postFormElement = createPostModal.querySelector(".modal__form");
const postCloseButton = createPostModal.querySelector(".modal__close-button");

const nameInput = editProfileModal.querySelector("#profile-name-input");
const jobInput = editProfileModal.querySelector("#profile-description-input");
const profileName = document.querySelector(".profile__name");
const profileJob = document.querySelector(".profile__description");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

/****************************
FUNCTIONS
****************************/

function openModalProfile(modal) {
  modal.classList.add("modal_opened");
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
}

function closeModalProfile(modal) {
  modal.classList.remove("modal_opened");
}

function handleProfileFormSubmit(evt, modal) {
  evt.preventDefault();

  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closeModalProfile(modal);
}

function getCardElement(data) {
  // clone the template
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  // change image link, image alt text, and card title
  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;
  return cardElement;
}

/****************************
ACTIONS
****************************/

// open profile modal
profileEditButton.addEventListener("click", () => {
  openModalProfile(editProfileModal);
});

// open new post modal
newPostButton.addEventListener("click", () => {
  openModalProfile(createPostModal);
});

// close profile modal
profileCloseButton.addEventListener("click", () => {
  closeModalProfile(editProfileModal);
});

// close new post modal
postCloseButton.addEventListener("click", () => {
  closeModalProfile(createPostModal);
});

// save new name & description in profile modal
profileFormElement.addEventListener("submit", function (evt) {
  handleProfileFormSubmit(evt, editProfileModal);
});

// create card content
initialCards.forEach(function (item) {
  const cardContent = getCardElement(item);
  cardsList.prepend(cardContent);
});
