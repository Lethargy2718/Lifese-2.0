import pencil from "./assets/SVGs/pencil.svg";
import trash from "./assets/SVGs/delete.svg";

const content = document.querySelector("#content");

const mapping = {
    missions: {
        type: "Reward",
        classOne: "complete-mission-button",
        classTwo: "success",
        buttonText: "Complete",
        data: "complete",
    },
    offenses: {
        type: "Penalty",
        classOne: "commit-offense-button",
        classTwo: "failure",
        buttonText: "Commit",
        data: "fail",
    },
};

function createCardTemplate(name, desc, type) {
    // The card itself
    const card = document.createElement("div");
    card.classList.add("card", type);
    card.setAttribute("data-type", type);

    // Corner buttons (edit and delete)
    const cornerButtonsContainer = document.createElement("div");
    cornerButtonsContainer.classList.add("corner-buttons-container");

    const editButton = document.createElement("img");
    editButton.classList.add("corner-button", "card-button-general");
    editButton.setAttribute("data-type", "edit");
    editButton.src = pencil;

    const deleteButton = document.createElement("img");
    deleteButton.classList.add("corner-button", "card-button-general");
    deleteButton.setAttribute("data-type", "delete");
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
    cardType.textContent = type.substring(0, type.length - 1);

    cardHeaderContainer.appendChild(cardHeader);
    cardHeaderContainer.appendChild(cardType);

    card.appendChild(cardHeaderContainer);

    // Card description
    const description = document.createElement("p");
    description.textContent = "\u25CB " + desc;

    card.appendChild(description);
    return card;
}

function createTask(name, desc, reward, penalty) {
    const card = createCardTemplate(name, desc, "tasks");

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

    completeBtn.classList.add("card-button", "success", "card-button-general");
    failBtn.classList.add("card-button", "failure", "card-button-general");

    completeBtn.setAttribute("data-type", "complete-task");
    failBtn.setAttribute("data-type", "fail-task");

    completeBtn.textContent = "Complete";
    failBtn.textContent = "Fail";

    cardButtonsContainer.appendChild(completeBtn);
    cardButtonsContainer.appendChild(failBtn);

    card.appendChild(cardButtonsContainer);

    return card;
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
    button.classList.add(`${info.classOne}`, `${info.classTwo}`, "card-button", "card-button-general");
    button.setAttribute("data-type", info.data);
    button.textContent = info.buttonText;

    cardButtonsContainer.appendChild(button);
    card.appendChild(cardButtonsContainer);

    return card;
}

export function displayAll(user) {
    resetContent();
    displayTasks(user, false);
    displayMissions(user, false);
    displayOffenses(user, false);
}

export function displayTasks(user, reset = true) {
    if (reset) resetContent();
    user.questManager.tasks.forEach((task) => {
        const taskCard = createTask(task.name, task.desc, task.reward, task.penalty);
        content.appendChild(taskCard);
    });
}

export function displayMissions(user, reset = true) {
    if (reset) resetContent();
    user.questManager.missions.forEach((mission) => {
        const missionCard = createOtherCard(mission.name, mission.desc, mission.reward, "missions");
        content.appendChild(missionCard);
    });
}

export function displayOffenses(user, reset = true) {
    if (reset) resetContent();
    user.questManager.offenses.forEach((offense) => {
        const offenseCard = createOtherCard(offense.name, offense.desc, offense.penalty, "offenses");
        content.appendChild(offenseCard);
    });
}

export function displayStats(user, reset = true) {
    if (reset) resetContent();

    const statsEmbed = document.createElement("div");
    statsEmbed.classList.add("stats-embed");

    const statsTitle = document.createElement("h1");
    statsTitle.id = "statsTitle";
    statsTitle.textContent = "Your Statistics";
    statsEmbed.appendChild(statsTitle);

    const statsTable = document.createElement("table");
    statsTable.id = "stats";

    const tbody = document.createElement("tbody");

    const rows = [
        { label: "Points:", id: "points" },
        { label: "Total Points Earned:", id: "totalEarnedPoints" },
        { label: "Total Points Lost:", id: "totalLostPoints" },
        { label: "Completed Tasks:", id: "completedTasks" },
        { label: "Failed Tasks:", id: "failedTasks" },
        { label: "Completed Missions:", id: "completedMissions" },
        { label: "Committed Offenses:", id: "committedOffenses" },
    ];

    rows.forEach((row) => {
        const tr = document.createElement("tr");

        const tdLabel = document.createElement("td");
        tdLabel.textContent = row.label;
        tr.appendChild(tdLabel);

        const tdValue = document.createElement("td");
        tdValue.id = row.id;
        tdValue.textContent = user[row.id];
        tr.appendChild(tdValue);

        tbody.appendChild(tr);
    });

    statsTable.appendChild(tbody);

    statsEmbed.appendChild(statsTable);

    content.appendChild(statsEmbed);
}

export function displaySpend(user, reset = true) {
    if (reset) resetContent();

    const container = document.createElement("div");
    container.classList.add("spend-embed");

    // Title
    const title = document.createElement("h1");
    title.textContent = "Spend Your Points";
    container.appendChild(title);

    // Points Container
    const pointsContainer = document.createElement("div");
    pointsContainer.classList.add("points-container");

    // Display points and time
    const pointsDisplay = document.createElement("p");
    pointsDisplay.classList.add("points-display");
    pointsDisplay.textContent = `You have ${user.points} points (${user.points * 10} minutes)`;
    pointsContainer.appendChild(pointsDisplay);

    // Points Input
    const pointsInput = document.createElement("input");
    pointsInput.classList.add("points-input");
    pointsInput.type = "number";
    pointsInput.placeholder = "Enter points to spend";
    pointsInput.min = 0;
    pointsInput.max = user.points;
    pointsContainer.appendChild(pointsInput);

    // Form
    const pointsForm = document.createElement("form");
    pointsForm.classList.add("points-form");
    pointsForm.appendChild(pointsContainer);

    // Button
    const spendBtn = document.createElement("button");
    spendBtn.textContent = "Spend Points";
    spendBtn.classList.add("card-button", "success");
    spendBtn.id = "spendFormBtn";
    pointsForm.appendChild(spendBtn);

    // Append the form to the container
    container.appendChild(pointsForm);

    // Append the container to the content
    content.appendChild(container);
}



export function resetContent() {
    content.innerHTML = "";
}