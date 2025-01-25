export { displayAll, displayTasks, displayMissions, displayOffenses, displayStats, resetContent };

import pencil from "./assets/SVGs/pencil.svg";
import trash from "./assets/SVGs/delete.svg";

const content = document.querySelector("#content");

const mapping = {
    "mission": {type: "Reward", classOne: "complete-mission-button", classTwo: "success", buttonText: "Complete"},
    "offense": {type: "Penalty", classOne: "commit-offense-button", classTwo: "failure", buttonText: "Commit"},
};

function createCardTemplate(name, desc, type) {
    // The card itself
    const card = document.createElement("div");
    card.classList.add("card", type);

    // Corner buttons (edit and delete)
    const cornerButtonsContainer = document.createElement("div");
    cornerButtonsContainer.classList.add("corner-buttons-container");
    
    const editButton = document.createElement("img");
    editButton.classList.add("corner-button");
    editButton.src = pencil;

    const deleteButton = document.createElement("img");
    deleteButton.classList.add("corner-button");

    deleteButton.src = trash;

    cornerButtonsContainer.appendChild(editButton);
    cornerButtonsContainer.appendChild(deleteButton);

    card.appendChild(cornerButtonsContainer);

    // Card header (name and type)
    const cardHeaderContainer = document.createElement("div");
    cardHeaderContainer.classList.add("card-header");
    const cardHeader = document.createElement("h1");
    cardHeader.textContent = name;
    const cardType = document.createElement("p");
    cardType.id = "cardType";
    cardType.textContent = type;

    cardHeaderContainer.appendChild(cardHeader);
    cardHeaderContainer.appendChild(cardType);

    card.appendChild(cardHeaderContainer);

    // Card description
    const description = document.createElement("p");
    description.textContent = desc;

    card.appendChild(description);

    return card;
}

function createTask(name, desc, reward, penalty) {
    const card = createCardTemplate(name, desc, "task");
    
    // Reward/Penalty text
    const rewardText = document.createElement("p");
    const penaltyText = document.createElement("p");
    rewardText.textContent = `Reward: ${reward} points`;
    penaltyText.textContent = `Penalty: ${penalty} points`;

    card.appendChild(rewardText);
    card.appendChild(penaltyText);

    // Complete/Fail buttons
    const cardButtonsContainer = document.createElement("div");
    cardButtonsContainer.classList.add("card-buttons-container");

    const completeBtn = document.createElement("button");
    const failBtn = document.createElement("button");

    completeBtn.classList.add("card-button", "success");
    failBtn.classList.add("card-button", "failure");

    completeBtn.textContent = "Complete";
    failBtn.textContent = "Fail";
    
    cardButtonsContainer.appendChild(completeBtn);
    cardButtonsContainer.appendChild(failBtn);

    card.appendChild(cardButtonsContainer);
    

    return card
}

function createOtherCard(name, desc, points, type) {
    const card = createCardTemplate(name, desc, type);
    const info = mapping[type];

    const pointsText = document.createElement("p");
    pointsText.textContent = `${info.type}: ${points} points`;
    card.appendChild(pointsText);

    const cardButtonsContainer = document.createElement("div");
    cardButtonsContainer.classList.add("card-buttons-container");

    const button = document.createElement("button");
    button.classList.add(`${info.classOne}`, `${info.classTwo}`, `card-button`);
    button.textContent = info.buttonText;

    cardButtonsContainer.appendChild(button);
    card.appendChild(cardButtonsContainer);

    return card;
}

function displayAll(user) {
    resetContent();
    displayTasks(user, false);
    displayMissions(user, false);
    displayOffenses(user, false);
}

function displayTasks(user, reset = true) {
    if (reset) resetContent();
    user.questManager.tasks.forEach(task => {
        const taskCard = createTask(task.name, task.desc, task.reward, task.penalty);
        content.appendChild(taskCard);
    })
}

function displayMissions(user) {
    user.questManager.missions.forEach(mission => {
        const missionCard = createOtherCard(mission.name, mission.desc, mission.reward, "mission");
        content.appendChild(missionCard);
    })
}

function displayOffenses(user) {
    user.questManager.offenses.forEach(offense => {
        const offenseCard = createOtherCard(offense.name, offense.desc, offense.penalty, "offense");
        content.appendChild(offenseCard);
    })
}

function resetContent() {
    content.innerHTML = "";
}

function displayStats() {
    //TODO
    return 1;
}