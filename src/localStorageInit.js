import { User, QuestManager } from "./system";
import { displayAll } from "./domCreator";
export { userInit };

function userInit() {
    let user;
    if (localStorage.user) {
        const questManager = new QuestManager();
        addQuestsFromLocalStorage(questManager);

        user = new User(
            +localStorage.points,
            +localStorage.totalEarnedPoints,
            +localStorage.totalLostPoints,
            +localStorage.completedTasks,
            +localStorage.failedTasks,
            +localStorage.completedMissions,
            +localStorage.committedOffenses,
            questManager,
        );

        console.log("loaded user from localstorage. welcome back.");
    } else {
        user = new User();

        localStorage.setItem("user", true);
        localStorage.setItem("points", 0);
        localStorage.setItem("totalEarnedPoints", 0);
        localStorage.setItem("totalLostPoints", 0);
        localStorage.setItem("completedTasks", 0);
        localStorage.setItem("failedTasks", 0);
        localStorage.setItem("completedMissions", 0);
        localStorage.setItem("committedOffenses", 0);
        localStorage.setItem("tasks", JSON.stringify([]));
        localStorage.setItem("missions", JSON.stringify([]));
        localStorage.setItem("offenses", JSON.stringify([]));

        console.log(
            "created a new user and loaded into localstorage. welcome.",
        );
    }

    // console.log(JSON.stringify(user, null, 4));
    displayAll(user);
    return user;
}

function addQuestsFromLocalStorage(questManager) {
    const types = ["tasks", "missions", "offenses"];
    types.forEach((type) => {
        JSON.parse(localStorage.getItem(type)).forEach((quest) => {
            questManager.addQuest(
                type,
                quest.name,
                quest.desc,
                quest.reward,
                quest.penalty,
                false,
            );
        });
    });
}
