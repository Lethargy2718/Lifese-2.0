export { User, QuestManager };

class Quest {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
    }

    edit(obj, type) {
        this.editLocalStorage(obj, type);
        this.name = obj.name;
        this.desc = obj.desc;
    }

    editLocalStorage(obj, type) {
        const arr = JSON.parse(localStorage.getItem(type));
        const questToEdit = arr.find((questObj) => questObj.name === this.name);
        questToEdit.name = obj.name;
        questToEdit.desc = obj.desc;
        questToEdit.reward = obj.reward;
        questToEdit.penalty = obj.penalty;
        localStorage.setItem(type, JSON.stringify(arr));
    }
}

class Task extends Quest {
    constructor(name, desc, reward, penalty) {
        super(name, desc);
        this.reward = reward;
        this.penalty = penalty;
    }

    edit(obj) {
        super.edit(obj, "tasks");
        this.reward = obj.reward;
        this.penalty = obj.penalty;
    }
}

class Mission extends Quest {
    constructor(name, desc, reward) {
        super(name, desc);
        this.reward = reward;
    }

    edit(obj) {
        super.edit(obj, "missions");
        this.reward = obj.reward;
    }
}

class Offense extends Quest {
    constructor(name, desc, penalty) {
        super(name, desc);
        this.penalty = penalty;
    }

    edit(obj) {
        super.edit(obj, "offenses");
        this.penalty = obj.penalty;
    }
}

class QuestFactory {
    static createQuest(type, name, desc, reward, penalty) {
        switch (type.toLowerCase()) {
            case "tasks":
                return new Task(name, desc, reward, penalty);
            case "missions":
                return new Mission(name, desc, reward);
            case "offenses":
                return new Offense(name, desc, penalty);
            default:
                throw new Error(`Error: ${type} is not a valid quest type.`);
        }
    }
}

class QuestManager {
    constructor(tasks = [], missions = [], offenses = []) {
        this.tasks = tasks;
        this.missions = missions;
        this.offenses = offenses;
    }

    addQuest(type, name, desc, reward, penalty, addToLocal = true) {
        this[type].push(
            QuestFactory.createQuest(type, name, desc, reward, penalty),
        );

        if (addToLocal) {
            const typeArr = JSON.parse(localStorage.getItem(type)) || [];
            typeArr.push({ name, desc, reward, penalty });
            localStorage.setItem(type, JSON.stringify(typeArr));
        }
    }

    deleteQuest(type, questName) {
        const quests = this[type];
        const index = quests.findIndex((q) => q.name === questName);
        if (index === -1) throw new Error("Quest not found.");
        this[type].splice(index, 1);
        this.deleteQuestFromStorage(type, questName);
    }

    findQuest(type, questName) {
        return this[type].find(
            (quest) => quest.name.toLowerCase() === questName.toLowerCase(),
        );
    }

    deleteQuestFromStorage(type, questName) {
        const arr = JSON.parse(localStorage.getItem(type));
        const index = arr.findIndex((obj) => obj.name === questName);
        arr.splice(index, 1);
        console.log(index, arr);
        localStorage.setItem(type, JSON.stringify(arr));
    }
}

class User {
    constructor(
        points = 0,
        totalEarnedPoints = 0,
        totalLostPoints = 0,
        completedTasks = 0,
        failedTasks = 0,
        completedMissions = 0,
        committedOffenses = 0,
        questManager = new QuestManager(),
    ) {
        this.points = points;
        this.totalEarnedPoints = totalEarnedPoints;
        this.totalLostPoints = totalLostPoints;
        this.completedTasks = completedTasks;
        this.failedTasks = failedTasks;
        this.completedMissions = completedMissions;
        this.committedOffenses = committedOffenses;

        this.buttonMapping = {
            "complete-task": (quest) => this.completeTask(quest),
            "fail-task": (quest) => this.failTask(quest),
            complete: (quest) => this.completeMission(quest),
            fail: (quest) => this.commitOffense(quest),
        };

        this.questManager = questManager;
        // this.questDataManager = new QuestDataManager(this);
    }

    addPoints(extraPoints) {
        this.points += extraPoints;
        this.totalEarnedPoints += extraPoints;
    }

    removePoints(lostPoints) {
        this.points = Math.max(0, this.points - lostPoints);
        this.totalLostPoints += lostPoints;
    }

    displayData() {
        const data = {
            points: this.points,
            totalEarnedPoints: this.totalEarnedPoints,
            totalLostPoints: this.totalLostPoints,
            completedTasks: this.completedTasks,
            failedTasks: this.failedTasks,
            completedMissions: this.completedMissions,
            committedOffenses: this.committedOffenses,
        };

        console.log(JSON.stringify(data, null, 4));
    }

    completeTask(task) {
        this.addPoints(task.reward);
        this.completedTasks++;
    }

    failTask(task) {
        this.removePoints(task.penalty);
        this.failedTasks++;
    }

    completeMission(mission) {
        this.addPoints(mission.reward);
        this.completedMissions++;
    }

    commitOffense(offense) {
        this.removePoints(offense.penalty);
        this.committedOffenses++;
    }

    endQuest(buttonType, questType, name) {
        this.buttonMapping[buttonType](
            this.questManager.findQuest(questType, name),
        );
        this.updateLocalStorage();
    }

    updateLocalStorage() {
        localStorage.setItem("points", this.points);
        localStorage.setItem("totalEarnedPoints", this.totalEarnedPoints);
        localStorage.setItem("totalLostPoints", this.totalLostPoints);
        localStorage.setItem("completedTasks", this.completedTasks);
        localStorage.setItem("failedTasks", this.failedTasks);
        localStorage.setItem("completedMissions", this.completedMissions);
        localStorage.setItem("committedOffenses", this.committedOffenses);
    }
}

/*
class QuestDataManager {
    constructor(user) {
        this.user = user;
        this.buttonMapping = {
            "complete-task": (quest) => this.completeTask(quest),
            "fail-task": (quest) => this.failTask(quest),
            "complete": (quest) => this.completeMission(quest),
            "fail": (quest) => this.commitOffense(quest)
        };
    }

    completeTask(task) {
        this.user.addPoints(task.reward);
        this.user.completedTasks++;
    }

    failTask(task) {
        this.user.removePoints(task.penalty);
        this.user.failedTasks++;
    }

    completeMission(mission) {
        this.user.addPoints(mission.reward);
        this.user.completedMissions++;
    }

    commitOffense(offense) {
        this.user.removePoints(offense.penalty);
        this.user.committedOffenses++;
    }

    endQuest(buttonType, questType, name) {
        this.buttonMapping[buttonType](this.user.questManager.findQuest(questType, name));
    }
}
*/
