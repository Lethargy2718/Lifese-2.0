import "./style.css";
import { displayAll, displayTasks, displayMissions, displayOffenses, displayStats, resetContent } from "./dom-creator.js";
import { User } from "./system.js";

const user = new User();
user.questManager.addQuest("task", "Sample task", "This is just a sample task", 1, 2);
resetContent();
displayAll(user);


/******************DOM*****************/
const headerButtonsContainer = document.querySelector(".header-buttons-container");

const dialogEl = document.querySelector("dialog");
const formEl = dialogEl.querySelector("form");
const nameEl = formEl.querySelector("#name");
const descEl = formEl.querySelector("#desc");
const rewardEl = formEl.querySelector("#reward");
const penaltyEl = formEl.querySelector("#penalty");
const submitBtn = dialogEl.querySelector("#submit");
const cancelBtn = dialogEl.querySelector("#cancel");

const sidebarBtnContainer = document.querySelector(".sidebar-buttons-container");
const questsBtn = sidebarBtnContainer.querySelector("#allQuestsBtn");
const tasksBtn = sidebarBtnContainer.querySelector("#tasksBtn");
const missionsBtn = sidebarBtnContainer.querySelector("#missionsBtn");
const offensesBtn = sidebarBtnContainer.querySelector("#offensesBtn");
const statsBtn = sidebarBtnContainer.querySelector("#statsBtn");
/**************************************/

const buttonConfig = {
    "task": { rewardEnabled: true, penaltyEnabled: true, displayFunc: displayTasks, sideBtn: tasksBtn },
    "mission": { rewardEnabled: true, penaltyEnabled: false, displayFunc: displayMissions, sideBtn: missionsBtn },
    "offense": { rewardEnabled: false, penaltyEnabled: true, displayFunc: displayOffenses, sideBtn: offensesBtn },
    "quest": { displayFunc: displayAll, sideBtn: questsBtn },
    "stats": { displayFunc: displayStats, sideBtn: statsBtn },
};

let currentBtn;
let activeSideBtn = questsBtn;

nameEl.addEventListener("input", checkPresence);

headerButtonsContainer.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    // TODO
    if (button.getAttribute("data-type") === "spend") {
        return;
    }

    currentBtn = button.getAttribute("data-type");
    activateSideButton(currentBtn);
    const config = buttonConfig[currentBtn];
    DialogManager.open(config);
});

cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    DialogManager.close();
});

submitBtn.addEventListener("click", (e) => {
    if (!formEl.checkValidity()) return;
    
    user.questManager.addQuest(currentBtn, nameEl.value, descEl.value, rewardEl.value, penaltyEl.value);
    e.preventDefault();
    DialogManager.close(true);
});

//debug
document.addEventListener("keydown", (e) => {
    if (e.key === "/") {
        resetContent();
        displayAll(user);
    }
});

class DialogManager {
    static dialog = dialogEl;

    static open(config) {
        this.reset();
        this.dialog.classList.add("show");
        this.dialog.showModal();
        rewardEl.disabled = !config.rewardEnabled;
        penaltyEl.disabled = !config.penaltyEnabled;

        if (rewardEl.disabled) rewardEl.textContent = "";
        if (penaltyEl.disabled) penaltyEl.textContent = "";
    }

    static close(display = false) {
        this.dialog.classList.remove("show");
        this.dialog.close();

        if (display) {
            resetContent();
            buttonConfig[currentBtn].displayFunc(user);
        }
    }

    static reset() {
        nameEl.value = "";
        descEl.value = "";
        rewardEl.value = "";
        penaltyEl.value = "";
    }
};

function checkPresence() {
    const quests = user.questManager[currentBtn + "s"];
   
    if (quests.some(questObj => questObj.name.toLowerCase() === nameEl.value.toLowerCase())) {
        nameEl.setCustomValidity("You have already added this " + currentBtn + "!");
    }
    else {
        nameEl.setCustomValidity("");
    }
}

sidebarBtnContainer.addEventListener("click", (e) => {
    const button = e.target.closest("li");
    if (!button) return;
    const tab = button.getAttribute("data-type");
    activateSideButton(tab);
    resetContent();
    buttonConfig[tab].displayFunc(user);
});

function activateSideButton(btnName) {
    activeSideBtn.classList.remove("active");
    activeSideBtn = buttonConfig[btnName].sideBtn;
    activeSideBtn.classList.add("active");
};