class ScenePreTitle extends Scene {
    constructor() {
        super()
        this.#start()
    }

    async #start() {
        const html = await (await fetch("pretitle.html")).text()
        page(DOM.container, "pretitle", html)

        const text = document.querySelector("i-typing") as Typing

        text.ready.then(() => {
            text.querySelector(".typing-wrapper")?.classList.add("blink-triangle")
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
