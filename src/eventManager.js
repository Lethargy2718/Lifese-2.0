import { userInit } from "./localStorageInit";
import { DialogManager } from "./dialog";
import { buttonConfig } from "./buttonConfig";
import { StateManager } from "./stateManager";
import { feedback } from "./Feedback";
import { pointsToTime } from "./utils/pointsToTime";

const user = userInit();

const content = document.querySelector("#content");
const dialogEl = document.querySelector("dialog");
const dialogHeader = dialogEl.querySelector("h1");
const formEl = dialogEl.querySelector("form");
const submitBtn = formEl.querySelector("#submit");
const nameEl = formEl.querySelector("#name");
const descEl = formEl.querySelector("#desc");
const rewardEl = formEl.querySelector("#reward");
const penaltyEl = formEl.querySelector("#penalty");
const headerButtonsContainer = document.querySelector(".header-buttons-container");
const sidebarButtonsContainer = document.querySelector(".sidebar-buttons-container");
const dropdownBtn = document.querySelector("#dropdownBtn");
const aside = document.querySelector("aside");
const sidebarButtons = document.querySelectorAll(".sidebar-button");

const dialogManager = new DialogManager(dialogEl, formEl, dialogHeader, nameEl, descEl, rewardEl, penaltyEl);

const cardButtonConfig = {
    delete: { callback: () => deleteQuest() },
    edit: { callback: () => prepareEditDialog() },
    complete: { callback: () => finishQuest("complete"), type: "success" },
    fail: { callback: () => finishQuest("fail"), type: "failure" },
    "fail-task": { callback: () => finishQuest("fail-task"), type: "failure" },
    "complete-task": {
        callback: () => finishQuest("complete-task"),
        type: "success",
    },
};

const stateManager = new StateManager(addQuest, editQuest);

/*****************event listeners*******************/

headerButtonsContainer.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (button.getAttribute("data-type") === "dropdown") {
        dropdown();
        return;
    }

    stateManager.currentType = button.getAttribute("data-type");
    stateManager.currentTab = stateManager.currentType;
    stateManager.currentAction = "new";
    openCurrDialog();
});

// For all card button clicks.
content.addEventListener("click", (e) => {
    if (e.target.closest("#spendFormBtn")) {
        e.preventDefault();
        spend();
        return;
    }

    const button = e.target.closest(".card-button-general");
    if (!button) return;

    const card = button.closest(".card");
    stateManager.currentType = card.getAttribute("data-type"); // Updated currentType
    stateManager.currentQuestName = card.querySelector("h1").textContent; // Get questName from card title (An alternate approach would be data-* attributes. Will think about it.)
    stateManager.currentCardButton = button.getAttribute("data-type"); // Button type (complete/fail/edit/delete)
    cardButtonConfig[stateManager.currentCardButton].callback();
});

submitBtn.addEventListener("click", (e) => {
    if (!formEl.checkValidity()) return;
    e.preventDefault();
    doCurrentAction();
    dialogManager.close();
    buttonConfig[stateManager.currentTab].displayFunc(user);
    activateSideButton();
});

// To check if a quest already exists.
nameEl.addEventListener("input", () => {
    // If editing a quest, ignore if the name written is its current name.
    if (stateManager.currentAction === "edit" && stateManager.currentQuestName.toLowerCase() === nameEl.value.toLowerCase()) return;

    // Otherwise, it is invalid if the name already exists.
    if (user.questManager.findQuest(stateManager.currentType, nameEl.value)) {
        nameEl.setCustomValidity("This already exists in your " + stateManager.currentType + "!");
    } else nameEl.setCustomValidity("");
});

sidebarButtonsContainer.addEventListener("click", (e) => {
    const button = e.target.closest("li");
    if (!button) return;
    const tab = button.getAttribute("data-type");
    buttonConfig[tab].displayFunc(user);
    stateManager.currentTab = tab;
    activateSideButton();
});

/******************helpers******************/

// Calls addQuest or editQuest.
function doCurrentAction() {
    stateManager.actions[stateManager.currentAction]();
}

// Adds a quest using form data.
function addQuest() {
    user.questManager.addQuest(stateManager.currentType, nameEl.value, descEl.value, +rewardEl.value, +penaltyEl.value);
}

// Edits the current chosen quest using form data.
function editQuest() {
    findCurrQuest().edit({
        name: nameEl.value,
        desc: descEl.value,
        reward: +rewardEl.value,
        penalty: +penaltyEl.value,
    });
}

// Prepares and opens the dialog for editing a quest.
function prepareEditDialog() {
    stateManager.currentAction = "edit";
    openCurrDialog();
    const quest = findCurrQuest();
    dialogManager.setFields(quest.name, quest.desc, quest.reward ?? "", quest.penalty ?? "");
}

// Deletes the quest picked by pressing on its card.
function deleteQuest() {
    user.questManager.deleteQuest(stateManager.currentType, stateManager.currentQuestName);
    buttonConfig[stateManager.currentTab].displayFunc(user);
}

// Returns the current quest being modified if it exists, otherwise returns undefined.
function findCurrQuest() {
    return user.questManager.findQuest(stateManager.currentType, stateManager.currentQuestName);
}

// Opens the dialog.
function openCurrDialog() {
    dialogManager.open(stateManager.currentType, buttonConfig[stateManager.currentType], stateManager.currentAction);
}

// Deactivates/Activates sidebar buttons based on the current tab.
function activateSideButton() {
    sidebarButtonsContainer.querySelector(".active").classList.remove("active");
    Array.from(sidebarButtonsContainer.children)
        .find((button) => button.getAttribute("data-type") === stateManager.currentTab)
        .classList.add("active");
}

// Finishes the chosen quest based on the button clicked.
function finishQuest(buttonType) {
    user.endQuest(buttonType, stateManager.currentType, stateManager.currentQuestName);
    showFeedback();
}

function checkSuccess() {
    return cardButtonConfig[stateManager.currentCardButton].type === "success";
}

function showFeedback() {
    const quest = findCurrQuest();
    if (checkSuccess()) feedback.show("You gained " + quest.reward + " points!", true);
    else feedback.show("You lost " + quest.penalty + " points.", false);
}

// Dropdown

dropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    aside.classList.toggle("active");
});

sidebarButtons.forEach((button) => {
    button.addEventListener("click", () => {
        aside.classList.remove("active");
    });
});

document.addEventListener("click", (e) => {
    if (!aside.contains(e.target) && !dropdownBtn.contains(e.target)) {
        aside.classList.remove("active");
    }
});

aside.addEventListener("click", (e) => {
    e.stopPropagation();
});

// Spend

function spend() {
    const pointsInput = content.querySelector(".points-input");
    const pointsInputVal = pointsInput.value;
    if (pointsInputVal === "") return;
    const pointsToSpend = +pointsInputVal;
    if (pointsToSpend === 0) {
        feedback.show("You can't spend 0 points!", false);
        return;
    }
    if (pointsToSpend > 0 && pointsToSpend <= user.points) {
        user.spendPoints(pointsToSpend);
        feedback.show(`You spent ${pointsToSpend} ${pointsToSpend === 1 ? "point" : "points"}! Remember to set a timer on ${pointsToTime(pointsToSpend)}.`, true);
    } else {
        feedback.show("You don't have enough points!", false);
    }
    buttonConfig[stateManager.currentTab].displayFunc(user);
}
