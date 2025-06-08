"use strict";
class ScenePreTitle extends Scene {
    constructor() {
        super();
        this.#start();
    }
    async #start() {
        const text = new Itext(DOM.container, "Presented by MCR" + "\u200B".repeat(15) + "<br><br>Please Click...", {
            css: {
                height: "3em",
                textAlign: "center",
            },
        });
        text.ready.then(() => {
            text.querySelector(".i-text-wrapper")?.classList.add("blink-triangle");
        });
        await Awaits.ok();
        await Awaits.fade(1000);
        currentScene = new SceneTitle();
    }
}
