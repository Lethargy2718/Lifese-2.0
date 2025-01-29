import {
    displayAll,
    displayTasks,
    displayMissions,
    displayOffenses,
    displayStats,
} from "./domCreator";
export { buttonConfig };

const sidebarBtnContainer = document.querySelector(
    ".sidebar-buttons-container",
);
const questsBtn = sidebarBtnContainer.querySelector("#allQuestsBtn");
const tasksBtn = sidebarBtnContainer.querySelector("#tasksBtn");
const missionsBtn = sidebarBtnContainer.querySelector("#missionsBtn");
const offensesBtn = sidebarBtnContainer.querySelector("#offensesBtn");
const statsBtn = sidebarBtnContainer.querySelector("#statsBtn");

const buttonConfig = {
    tasks: {
        rewardEnabled: true,
        penaltyEnabled: true,
        displayFunc: displayTasks,
        sideBtn: tasksBtn,
    },
    missions: {
        rewardEnabled: true,
        penaltyEnabled: false,
        displayFunc: displayMissions,
        sideBtn: missionsBtn,
    },
    offenses: {
        rewardEnabled: false,
        penaltyEnabled: true,
        displayFunc: displayOffenses,
        sideBtn: offensesBtn,
    },
    quests: { displayFunc: displayAll, sideBtn: questsBtn },
    stats: { displayFunc: displayStats, sideBtn: statsBtn },
};
