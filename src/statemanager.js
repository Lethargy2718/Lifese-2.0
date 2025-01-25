export { StateManager };

class StateManager {
    constructor(addQuest, editQuest) {
        this.currentType = "quests";
        this.currentTab = "quests";
        this.currentAction = "new";
        this.currentQuestName;
        this.actions = {
            "new": addQuest,
            "edit": editQuest,
        };
    };
};