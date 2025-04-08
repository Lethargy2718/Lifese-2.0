const feedbackEl = document.querySelector(".feedback");

class Feedback {
    constructor(feedbackEl, time = 4000) {
        this.feedbackEl = feedbackEl;
        this.time = time;
        this.feedbackTimer = null;
    }

    startTimeout() {
        if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
        this.feedbackTimer = setTimeout(() => feedbackEl.classList.remove("visible"), 4000);
    }

    show(text, success = true) {
        this.feedbackEl.classList.add("visible");
        this.setText(text);
        this.setState(success);
    }

    setText(text) {
        this.feedbackEl.textContent = text;
    }

    setState(success) {
        if (success) this.feedbackEl.classList.remove("fail");
        else this.feedbackEl.classList.add("fail");
    }
}

export const feedback = new Feedback(feedbackEl);