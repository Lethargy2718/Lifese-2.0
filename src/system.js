export { User };

class User {
    constructor(questManager = new QuestManager(), points = 0, totalEarnedPoints = 0, totalLostPoints = 0, completedTasks = 0, failedTasks = 0, completedMissions = 0, committedOffenses = 0) {
        this.questManager = questManager;
        this.points = points;
        this.totalEarnedPoints = totalEarnedPoints;
        this.totalLostPoints = totalLostPoints;
        this.completedTasks = completedTasks;
        this.failedTasks = failedTasks;
        this.completedMissions = completedMissions;
        this.committedOffenses = committedOffenses;
    }
    
    addPoints(extraPoints) {
        this.points += extraPoints;
        this.totalEarnedPoints += extraPoints;
    }

    removePoints(lostPoints) {
        this.points = Math.max(0, this.points - lostPoints);
        this.totalLostPoints -= lostPoints;
    }

    completeTask(task) {
        this.addPoints(task.pointsWin);
        this.completedTasks++;
    }

    failTask(task) {
        this.removePoints(task.removePoints);
        this.failedTasks++;
    }

    completeMission(mission) {
        this.addPoints(mission.points);
        this.completedMissions++;
    }

    commitOffense(offense) {
        this.removePoints(offense.points);
        this.committedOffenses++;
    }
}

class QuestManager {
    constructor(tasks = [], missions = [], offenses = []) {
        this.tasks = tasks;
        this.missions = missions;
        this.offenses = offenses;
    }
    
    addQuest(type, name, desc, reward, penalty) {
        this[type].push(QuestFactory.createQuest(type, name, desc, reward, penalty));
    }

    deleteQuest(type, questName) {
        const quests = this[type];
        const index = quests.findIndex(q => q.name === questName);
        if (index === -1) throw new Error("Quest not found.");
        this.types[type].splice(index, 1)
    }

    findQuest(type, questName) {
        return this[type].find(quest => quest.name.toLowerCase() === questName.toLowerCase());
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
};

class Quest {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
    }

    edit(obj) {
        this.name = obj.name;
        this.desc = obj.desc;
    }
}

class Task extends Quest {
    constructor(name, desc, reward, penalty) {
        super(name, desc);
        this.reward = reward;
        this.penalty = penalty;
    }

    edit(obj) {
        super.edit(obj);
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
        super.edit(obj);
        this.reward = obj.reward;
    }
}

class Offense extends Quest {
    constructor(name, desc, penalty) {
        super(name, desc);
        this.penalty = penalty;
    }

    edit(obj) {
        super.edit(obj);
        this.penalty = obj.penalty;
    }
}