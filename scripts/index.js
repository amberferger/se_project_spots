/****************************
CARD INFORMATION
****************************/
const initialCards = [
  {
    name: "Banff",
    link: "https://unsplash.com/photos/scenery-of-mountain-oMneOBYhJxY",
  },
  {
    name: "Lisbon",
    link: "https://unsplash.com/photos/yellow-and-white-tram-on-road-during-daytime-ljhCEaHYWJ8",
  },
  {
    name: "London",
    link: "https://unsplash.com/photos/aerial-photography-of-london-skyline-during-daytime-Oja2ty_9ZLM",
  },
  {
    name: "Dublin",
    link: "https://unsplash.com/photos/brown-and-white-concrete-houses-tnzzr8HpLhs",
  },
  {
    name: "Munich",
    link: "https://unsplash.com/photos/aerial-view-of-city-buildings-during-sunset-MEUvVqkU3QI",
  },
  {
    name: "Edinburgh",
    link: "https://unsplash.com/photos/brown-concrete-building-near-river-during-daytime-TmDEY0DtQd0",
  },
];

/****************************
 OPEN AND CLOSE THE MODAL
****************************/
const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const profileCloseButton = editProfileModal.querySelector(
  ".modal__close-button"
);

const nameInput = editProfileModal.querySelector("#profile-name-input");
const jobInput = editProfileModal.querySelector("#profile-description-input");
const profileName = document.querySelector(".profile__name");
const profileJob = document.querySelector(".profile__description");

function openModalProfile() {
  editProfileModal.classList.add("modal__opened");
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
}

function closeModalProfile() {
  editProfileModal.classList.remove("modal__opened");
}

// open modal
profileEditButton.addEventListener("click", openModalProfile);

// close modal
profileCloseButton.addEventListener("click", closeModalProfile);
