"use strict";
class SceneDay extends Scene {
    #awakeness = 100;
    #mode = "game-over";
    #musicData = [];
    #startTime = NaN;
    #goalElement;
    constructor() {
        super();
        this.#musicData = this.#createMusicData();
        this.#start();
    }
    loop(elapsedTime) {
        if (this.#mode !== "main")
            return;
        this.#musicData = this.#musicData.filter(this.#processMusicData.bind(this));
        this.#updateAwakeness(elapsedTime);
        if (this.#musicData.length === 0) {
            this.#study();
        }
        else if (this.#awakeness < 0) {
            this.#sleep();
        }
        Input.update();
    }
    #updateAwakeness(elapsedTime) {
        this.#awakeness -= elapsedTime / 120;
        DOM.awakeness.style.width = `${this.#awakeness}%`;
    }
    #processMusicData({ element, time }) {
        const elapsed = performance.now() - this.#startTime;
        const progress = (elapsed - time * 1000) / 15;
        element.style.right = `${progress}%`;
        if (this.#isNoteHit(progress)) {
            element.remove();
            return false;
        }
        if (progress > 105) {
            this.#handleMiss(element);
            return false;
        }
        return true;
    }
    #isNoteHit(progress) {
        const isHit = mouse.clicked.has("left") ||
            keyboard.pushed.has("KeyZ") ||
            keyboard.pushed.has("Enter") ||
            keyboard.pushed.has("Space");
        if (!isHit)
            return false;
        const gap = Math.abs(100 - progress);
        if (2 <= gap && gap <= 4) {
            this.#showScore("good");
            return true;
        }
        if (gap <= 2) {
            this.#awakeness = Math.min(100, this.#awakeness + 5);
            this.#swapCharacter("assets/hand-up.png");
            this.#showScore("great");
            return true;
        }
        return false;
    }
    #showScore(score) {
        this.#goalElement.dataset.score = "";
        requestAnimationFrame(() => {
            this.#goalElement.dataset.score = score;
        });
    }
    #swapCharacter(imagePath) {
        document.querySelector(".character")?.remove();
        new Iimage(DOM.container, imagePath, {
            css: {
                position: "absolute",
                top: "30%",
                left: "10%",
                height: "50%",
            },
            className: "character",
        });
    }
    #handleMiss(element) {
        this.#awakeness = Math.max(0, this.#awakeness - 5);
        this.#swapCharacter("assets/classroom.png");
        this.#showScore("bad");
        element.remove();
    }
    async #start() {
        const loadBGM = BGM.fetch({ src: "assets/sounds/stage-0.mp3", loop: false });
        const text = new Itext(DOM.container, "ひる", {
            css: {
                fontSize: "16vh",
            },
        });
        await Awaits.sleep(2000);
        await Awaits.fade(1000);
        text.remove();
        this.#initDOM();
        await loadBGM;
        await BGM.play();
        this.#startTime = performance.now();
        this.#mode = "main";
    }
    #createMusicData() {
        const { bpm, notes } = musicDataList[0];
        return notes.map((tick) => ({
            time: (tick / 480) * (60 / bpm) - 1.2755,
            element: document.createElement("span"),
        }));
    }
    #initDOM() {
        DOM.setParameter();
        DOM.awakeness.style.width = "100%";
        this.#swapCharacter("assets/classroom.png");
        const layer = new Ielement(DOM.container, {
            css: {
                position: "absolute",
                right: "0",
                width: "75%",
                height: "24vh",
                zIndex: "100",
            },
        });
        this.#goalElement = document.createElement("span");
        this.#goalElement.id = "goal";
        this.#goalElement.className = "note";
        this.#goalElement.style.right = "100%";
        layer.appendChild(this.#goalElement);
        this.#musicData.forEach(({ element }) => {
            element.className = "note";
            element.style.right = "200%";
            layer.appendChild(element);
        });
        new Itext(DOM.container, "よき タイミングで クリック して いしきを たもて!", {
            css: {
                top: "20vh",
            },
        });
    }
    async #study() {
        this.#mode = "game-over";
        await Awaits.sleep(1000);
        const text = new Itext(DOM.container, "いねむりせず べんきょう した......!", {
            css: {
                bottom: "8vh",
            },
        });
        await text.ready;
        text.classList.add("blink-triangle");
        await Awaits.ok();
        await Awaits.fade(1000);
        currentScene = new SceneNight(false);
    }
    async #sleep() {
        BGM.fadeOut(1);
        this.#mode = "game-over";
        await Awaits.sleep(1000);
        const text = new Itext(DOM.container, "いねむり して しまった......", {
            css: {
                bottom: "8vh",
            },
        });
        await text.ready;
        text.classList.add("blink-triangle");
        await Awaits.ok();
        await Awaits.fade(1000);
        currentScene = new SceneNight(true);
    }
}
const musicDataList = [
    {
        bpm: 125,
        notes: [
            3840 + 0,
            3840 + 480,
            3840 + 960,
            3840 + 1200,
            3840 + 1680,
            //
            5760 + 240,
            5760 + 480,
            5760 + 960,
            5760 + 1440,
            //
            3840 * 2 + 3840 + 0,
            3840 * 2 + 3840 + 480,
            3840 * 2 + 3840 + 720,
            3840 * 2 + 3840 + 960,
            3840 * 2 + 3840 + 1200,
            3840 * 2 + 3840 + 1440,
            3840 * 2 + 3840 + 1680,
            //
            3840 * 2 + 5760 + 240,
            3840 * 2 + 5760 + 480,
            3840 * 2 + 5760 + 600,
            3840 * 2 + 5760 + 720,
            3840 * 2 + 5760 + 960,
            3840 * 2 + 5760 + 1200,
            3840 * 2 + 5760 + 1440,
        ],
    },
];
