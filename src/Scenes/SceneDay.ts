import { Pages } from "../utils/Pages"
import { Scene } from "./Scene"

export class SceneDay extends Scene {
    ready: Promise<void>

    #pages!: Pages

    constructor() {
        super()

        this.ready = this.#setup()
    }

    async #setup() {
        const container = document.getElementById("container")!

        const html = await fetch("./pages/day.html").then((response) => response.text())
        this.#pages = new Pages(container, "#day", html)
    }
}
