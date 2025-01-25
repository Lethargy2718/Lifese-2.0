import { User } from "./system";
import { DialogManager } from "./dialog";
import { buttonConfig } from "./button-config";
import { StateManager } from "./statemanager";
import { displayAll } from "./dom-creator"; // DEBUGGING; REMOVE LATER;


const user = new User();
const content = document.querySelector("#content");
const dialogEl = document.querySelector("dialog");
const dialogHeader = dialogEl.querySelector("h1");
const formEl = dialogEl.querySelector("form")
const submitBtn = formEl.querySelector("#submit");
const nameEl = formEl.querySelector("#name");
const descEl = formEl.querySelector("#desc");
const rewardEl = formEl.querySelector("#reward");
const penaltyEl = formEl.querySelector("#penalty");
const headerButtonsContainer = document.querySelector(".header-buttons-container");
const sidebarButtonsContainer = document.querySelector(".sidebar-buttons-container");

const dialogManager = new DialogManager(dialogEl, formEl, dialogHeader, nameEl, descEl, rewardEl, penaltyEl);

const cardButtonConfig = {
    "delete": { callback: () => deleteQuest() },
    "edit": { callback: () => prepareEditDialog() },
    "complete": { callback: () => console.log("complete") },
    "fail": { callback: () => console.log("fail") },
}

const stateManager = new StateManager(addQuest, editQuest);

/******************DEBUGGGG******************/
function init() {
    // Creating tasks
    user.questManager.addQuest("tasks", "Morning Routine", "Complete your morning routine without distractions", 5, 3);
    user.questManager.addQuest("tasks", "Workout", "Finish a full-body workout session", 4, 5);

    // Creating missions
    user.questManager.addQuest("missions", "Study for Exam", "Prepare for and take the exam", 5, 7);
    user.questManager.addQuest("missions", "Complete Project", "Finish and submit the coding project", 6, 8);

    // Creating offenses
    user.questManager.addQuest("offenses", "Overeat", "Overeat and disrupt your meal plan", 5, 7);
    user.questManager.addQuest("offenses", "Skip Prayer", "Skip one or more of your prayers", 2, 3);

    displayAll(user);
}

init();
/*****************event listeners*******************/
headerButtonsContainer.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (button.getAttribute("data-type") === "spend") return; // TODO

    stateManager.currentType = button.getAttribute("data-type");
    stateManager.currentTab = stateManager.currentType;
    stateManager.currentAction = "new";
    openCurrDialog();
});

content.addEventListener("click", (e) => {
    const button = e.target.closest(".card-button-general");
    if (!button) return;
    const card = button.closest(".card"); 
    stateManager.currentType = card.getAttribute("data-type"); // Updated currentType
    stateManager.currentQuestName = card.querySelector("h1").textContent; // Get questName from card title (An alternate approach would be data-* attributes. Will think about it.)
    const buttonType = button.getAttribute("data-type"); // Button type (complete/fail/edit/delete)
    cardButtonConfig[buttonType].callback();
});

submitBtn.addEventListener("click", (e) => {
    if (!formEl.checkValidity()) return;
    e.preventDefault();
    doCurrentAction();
    dialogManager.close();
    buttonConfig[stateManager.currentTab].displayFunc(user);
});

nameEl.addEventListener("input", () => {
    // If editing a quest, ignore if the name written is its current name.
    if (stateManager.currentAction === "edit" && stateManager.currentQuestName.toLowerCase() === nameEl.value.toLowerCase()) return;
    console.log("not ignored");
    // Otherwise, it is invalid if the name already exists.
    if (user.questManager.findQuest(stateManager.currentType, nameEl.value)) {
        nameEl.setCustomValidity("This already exists in your " + stateManager.currentType + "!");
    }
    else nameEl.setCustomValidity("");  
});

sidebarButtonsContainer.addEventListener("click", (e) => {
    const button = e.target.closest("li");
    if (!button) return;
    const tab = button.getAttribute("data-type");
    buttonConfig[tab].displayFunc(user);
    stateManager.currentTab = tab;
    activateSideButton();
})
/******************helpers******************/
function addQuest() {
    user.questManager.addQuest(stateManager.currentType, nameEl.value, descEl.value, +rewardEl.value, +penaltyEl.value);
    activateSideButton();
};

function editQuest() {
    findCurrQuest().edit({
        name: nameEl.value,
        desc: descEl.value,
        reward: +rewardEl.value,
        penalty: +penaltyEl.value,
    });
};

function prepareEditDialog() {
    stateManager.currentAction = "edit";
    openCurrDialog();
    const quest = findCurrQuest();
    dialogManager.setFields(quest.name, quest.desc, quest.reward??"", quest.penalty??"");
};

function deleteQuest() {
    // currentQuestName, currentType
    user.questManager[stateManager.currentType].splice(
        user.questManager[stateManager.currentType].findIndex(
            questObj => questObj.name === stateManager.currentQuestName
        )
    , 1);
    buttonConfig[stateManager.currentTab].displayFunc(user);
};

function doCurrentAction() {
    stateManager.actions[stateManager.currentAction]();
};

function findCurrQuest() {
    return user.questManager.findQuest(stateManager.currentType, stateManager.currentQuestName);
}

function openCurrDialog() {
    dialogManager.open(stateManager.currentType, buttonConfig[stateManager.currentType], stateManager.currentAction); 
}

function activateSideButton() {
    sidebarButtonsContainer.querySelector(".active").classList.remove("active");
    Array.from(sidebarButtonsContainer.children).find(button => button.getAttribute("data-type") === stateManager.currentTab).classList.add("active");
}