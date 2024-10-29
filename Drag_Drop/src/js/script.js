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

// variables :
let updatedOnLoad = false;

// One Time Warning :
function warning() {
  const note = `
  <div class="overlay" onclick="hideWarning()"></div>
  <div class="warning">
  <h1>NOTE</h1>
  <p>The Drag and Drop functionality of the page <b>Only Works on PC's and Desktop's Not on touch screens !</b></p>
  </div>
  `;
  document.querySelector("body").insertAdjacentHTML("beforeend", note);
}

// remove warning :
function hideWarning() {
  console.log("called!");
  document.querySelector(".overlay").classList.add("hidden");
  document.querySelector(".warning").classList.add("hidden");
}

// Drag Functionality variables :
let dragging = false;
let currConatiner;
let draggedItem;

// Initializing Arrays :
let inProgressListArray = [];
let completedListArray = [];
let listArrays = [];

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
    warning();
    inProgressListArray = ["Enjoying Life 🕺", "Higher Studies 🧑‍🎓"];
    completedListArray = ["20 Years On 🌏", "Marvel Series 🎥"];
  }
}

// Set localStorage Arrays :
function updateSavedItems() {
  listArrays = [inProgressListArray, completedListArray];
  const listNames = [
    "inProgressListArrayInLocalStorage",
    "completeListArrayInLocalStorage",
  ];
  listNames.forEach((el, i) => {
    localStorage.setItem(el, JSON.stringify(listArrays[i]));
  });
}

// Filter Arrays to remove empty items :
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list items
function createItemEl(
  itemsContainer,
  itemsContainerIndex,
  itemsContent,
  itemsIndex
) {
  const html = `
  <li class="drag-item" ondragstart="drag(event)" draggable="true" contenteditable="true" id="${itemsIndex}" onfocusout="updateItem(${itemsIndex},${itemsContainerIndex})">${itemsContent}</li>
  `;
  // Append / insert :
  itemsContainer.insertAdjacentHTML("beforeend", html);
}

// Update Items in DOM - Reset HTML , Filter Array , Update local Storage
function updateUI() {
  // Check localStorage once :
  if (!updatedOnLoad) {
    getSavedItems();
  }
  const lists = [
    [inProgressList, inProgressListArray],
    [completedList, completedListArray],
  ];
  lists.forEach((mainEl, index) => {
    mainEl[0].textContent = "";
    mainEl[1].forEach((el, i) => {
      createItemEl(mainEl[0], index, el, i);
    });
  });
  inProgressListArray = filterArray(inProgressListArray);
  completedListArray = filterArray(completedListArray);

  // Run getSavedItems() only once , Update Local Storage
  updatedOnLoad = true;
  updateSavedItems();
}

// Add to ItemsContainer , Reset Textbox :
function addToContainer(itemsContainerIndex) {
  if (!addItems[itemsContainerIndex].textContent) return;
  const newItemContent = addItems[itemsContainerIndex].textContent;
  const selectedArray = listArrays[itemsContainerIndex];
  selectedArray.push(newItemContent);
  addItems[itemsContainerIndex].textContent = "";
  updateUI();
}

// Allow arrays to reflect drag and drop :
function rebuildArrays() {
  inProgressListArray = Array.from(inProgressList.children).map(
    (item) => item.textContent
  );
  completedListArray = Array.from(completedList.children).map(
    (item) => item.textContent
  );
  updateUI();
}

// Onclick Functions :

// Update Item -  update Array Value :
function updateItem(id, itemsContainerIndex) {
  const selectedArray = listArrays[itemsContainerIndex];
  const selectedItemEl = itemLists[itemsContainerIndex].children;
  if (!dragging) {
    if (!selectedItemEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedItemEl[id].textContent;
    }
    updateUI();
  }
}

// Show Add Item Input Box :
function showInputBox(itemsContainerIndex) {
  addBtns[itemsContainerIndex].style.visibility = "hidden";
  saveItemBtns[itemsContainerIndex].style.display = "flex";
  addItemContainers[itemsContainerIndex].style.display = "flex";
}

// Hide Item Input Box :
function hideInputBox(itemsContainerIndex) {
  addBtns[itemsContainerIndex].style.visibility = "visible";
  saveItemBtns[itemsContainerIndex].style.display = "none";
  addItemContainers[itemsContainerIndex].style.display = "none";
  addToContainer(itemsContainerIndex);
}

// When Item Starts Dragging :
function drag(e) {
  draggedItem = e.target;
  dragging = true;
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
  // Dragging Complete :
  dragging = false;
  rebuildArrays();
}

updateUI();
