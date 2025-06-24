class ScenePreTitle extends Scene {
    constructor() {
        super()
        this.#start()
    }

    async #start() {
        const text = new Itext(DOM.container, "Presented by MCR" + "\u200B".repeat(10) + "<br><br>Please Click...", {
            css: {
                height: "3em",

                textAlign: "center",
            },
        })

        text.ready.then(() => {
            text.querySelector(".i-text-wrapper")?.classList.add("blink-triangle")
        })

        await Awaits.ok()

        const click = new Audio("assets/sounds/クリック.mp3")
        click.play()

        await Awaits.sleep(400)

        const se = new Audio("assets/sounds/MCR.wav")
        se.volume = 0.4
        se.play()

        await Awaits.fade(1500)

        currentScene = new SceneTitle()
    }
}
