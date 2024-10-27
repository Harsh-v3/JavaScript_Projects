"use strict";

// Buttons :
const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
// Other Elements :
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists :
const itemLists = document.querySelectorAll(".drag-item-list");
const inProgressList = document.getElementById("progress-list");
const completedList = document.getElementById("completed-list");

// Items :
let updatedOnLoad = false;
let currConatiner;
let draggedItem;

// Console :
// console.log(
//   addBtns,
//   saveItemBtns,
//   addItemContainers,
//   addItems,
//   itemLists,
//   inProgressList,
//   completedList
// );

// Initializing Arrays :
let inProgressListArray = [];
let completedListArray = [];
let listArrays = [];

// Drag Functionality :

// Get Arrays from localStorage if avalable, set default values if not :
function getSavedItems() {
  if (localStorage.getItem("inProgressListArrayInLocalStorage")) {
    inProgressListArray = JSON.parse(
      localStorage.inProgressListArrayInLocalStorage
    );
    completedListArray = JSON.parse(
      localStorage.completeListArrayInLocalStorage
    );
  } else {
    inProgressListArray = ["Enjoying Life 🕺", "Higher Studies 🧑‍🎓"];
    completedListArray = ["20 Years On 🌏", "Marvel Series 🎥"];
  }
}

// Set localStorage Arrays :
function updateSavedItems() {
  const listArrays = [inProgressListArray, completedListArray];
  const listNames = [
    "inProgressListArrayInLocalStorage",
    "completeListArrayInLocalStorage",
  ];
  listNames.forEach((el, i) => {
    console.log(el);
    localStorage.setItem(el, JSON.stringify(listArrays[i]));
  });
}

// updateSavedItems();

// Create DOM Elements for each list items
function createItemEl(
  itemsContainer,
  itemsContainerIndex,
  itemsContent,
  itemsIndex
) {
  // List Item :
  const itemEl = document.createElement("li");
  itemEl.classList.add("drag-item");
  itemEl.textContent = itemsContent;
  itemEl.setAttribute("ondragstart", "drag(event)");
  itemEl.draggable = true;
  // Append :
  itemsContainer.appendChild(itemEl);
}

// Update Items in DOM - Reset HTML , Filter Array , Update local Storage
function updateUI() {
  // Check localStorage once :
  if (!updatedOnLoad) {
    getSavedItems();
  }
  // Progress Column :
  inProgressList.textContent = "";
  inProgressListArray.forEach((el, i) => {
    createItemEl(inProgressList, 0, el, i);
  });
  // Complete Column :
  completedList.textContent = "";
  completedListArray.forEach((el, i) => {
    createItemEl(completedList, 1, el, i);
  });
}

updateUI();

// When Item Starts Dragging :
function drag(e) {
  draggedItem = e.target;
  console.log("dragged Item : ", draggedItem);
}

// Items Container allows Items to Drop :
function allowDrop(e) {
  e.preventDefault();
}

// When Item Enters Container Area :
function dragEnter(containerIndex) {
  itemLists[containerIndex].classList.add("over");
  currConatiner = containerIndex;
}

// Dropping Items in Container :
function drop(e) {
  e.preventDefault();
  // Remove Effects :
  itemLists.forEach((el) => {
    el.classList.remove("over");
  });
  // Add Items to Container :
  const parentEl = itemLists[currConatiner];
  parentEl.appendChild(draggedItem);
}
