import { KeyDriver } from "../utils/KeyDriver.js"
import { Pages } from "../utils/Pages.js"
import { Scene } from "./Scene.js"
import { Scenes } from "./Scenes.js"

export class SceneTitle extends Scene {
    ready: Promise<void>
    #keyDriver!: KeyDriver
    #pages!: Pages

    constructor() {
        super()

        this.ready = this.#setup()
    }

    async #setup() {
        const container = document.getElementById("container")!

        const html = await fetch("./pages/title.html").then((response) => response.text())
        this.#pages = new Pages(container, "#normal", html)

        this.#pages.on(".*", () => {
            this.#keyDriver.update()
        })

        this.#keyDriver = new KeyDriver("horizontal")

        this.#setupButtons()
    }

    #setupButtons() {
        document.querySelector<HTMLElement>("#game")!.onclick = async () => {
            const { SceneNight } = await import("./SceneNight.js")
            Scenes.goto(() => new SceneNight())
        }
    }

    end(): void {
        this.#keyDriver.discard()
    }
}
