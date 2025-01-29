export { DialogManager };

class DialogManager {
    constructor(
        dialog,
        form,
        dialogHeader,
        nameEl,
        descEl,
        rewardEl,
        penaltyEl,
    ) {
        this.dialog = dialog;
        this.form = form;
        this.dialogHeader = dialogHeader;
        this.nameEl = nameEl;
        this.descEl = descEl;
        this.rewardEl = rewardEl;
        this.penaltyEl = penaltyEl;

        form.querySelector("#cancel").addEventListener("click", (e) => {
            e.preventDefault();
            this.close();
        });
    }

    open(currentType, config, currentAction) {
        this.setTitle(currentType, currentAction);
        this.dialog.classList.add("show");
        this.dialog.showModal();
        this.configureDisabledFields(config);
    }

    close() {
        this.dialog.classList.remove("show");
        this.dialog.close();
        this.reset();
    }

    configureDisabledFields(config) {
        this.rewardEl.disabled = !config.rewardEnabled;
        this.penaltyEl.disabled = !config.penaltyEnabled;

        if (this.rewardEl.disabled) this.rewardEl.textContent = "";
        if (this.penaltyEl.disabled) this.penaltyEl.textContent = "";
    }

    reset() {
        this.form.reset();
        this.nameEl.setCustomValidity("");
    }

    setFields(name, desc, reward, penalty) {
        this.nameEl.value = name;
        this.descEl.value = desc;
        this.rewardEl.value = reward;
        this.penaltyEl.value = penalty;
    }

    setTitle(currentType, currentAction) {
        const typeText = currentType.substring(0, currentType.length - 1);
        let actionText;

        switch (currentAction) {
            case "new":
                actionText = "Add a new ";
                break;
            case "edit":
                actionText = "Edit this ";
                break;
            default:
                throw new Error(
                    `${currentAction} is not a valid action. Valid actions are "new" and "edit" (strings).`,
                );
        }

        this.dialogHeader.textContent = actionText + typeText;
    }
}
