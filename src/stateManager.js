export class StateManager {
    constructor(addQuest, editQuest) {
        this.currentType = "quests";
        this.currentTab = "quests";
        this.currentAction = "new";
        this.currentCardButton;
        this.currentQuestName;
        this.actions = {
            new: addQuest,
            edit: editQuest,
        };
    }
}
