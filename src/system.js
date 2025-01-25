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
        this.types = [this.tasks, this.missions, this.offenses];
    }
    
    addQuest(type, name, desc, points, points2 = 0) {
        let quest;
        switch (type.toLowerCase()) {
            case "task":
                quest = new Task(name, desc, points, points2);
                this.tasks.push(quest);
                break;
            case "mission":
                quest = new Mission(name, desc, points);
                this.missions.push(quest);
                break;
            case "offense":
                quest = new Offense(name, desc, points);
                this.offenses.push(quest);
                break;
            default:
                throw new Error(`${type} is not a valid types. Valid types are "task", "mission", and "offense".`);
        }
    }
    
    delete(type, quest) {
        const quests = this.types[type];
        const index = quests.findIndex(q => q === quest);
        if (index === -1) throw new Error("Quest not found.");
        this.types[type].splice(index, 1)
    }
}

class Quest {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
    }
}

class Task extends Quest {
    constructor(name, desc, reward, penalty) {
        super(name, desc);
        this.reward = reward;
        this.penalty = penalty;
    }
}

class Mission extends Quest {
    constructor(name, desc, reward) {
        super(name, desc);
        this.reward = reward;
    }
}

class Offense extends Quest {
    constructor(name, desc, penalty) {
        super(name, desc);
        this.penalty = penalty;
    }
}

/********************************/

