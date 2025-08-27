import { SE } from "../SE"
import { Awaits } from "../utils/Awaits"
import { Pages } from "../utils/Pages"
import { Scene } from "./Scene"
import { Scenes } from "./Scenes"
import { SceneTitle } from "./SceneTitle"

export class ScenePretitle extends Scene {
    ready: Promise<void>

    #pages!: Pages

    constructor() {
        super()

        this.ready = this.#setup()
    }

    async #setup() {
        const container = document.getElementById("container")!

        const html = await fetch("./pages/pretitle.html").then((response) => response.text())
        this.#pages = new Pages(container, "#pretitle", html)

        this.#start()
    }

    async #start() {
        await Awaits.ok()

        SE.key.play()
        await Awaits.sleep(SE.key.duration * 1000)
        SE.MCR.play()

        Scenes.goto(() => new SceneTitle(), { msIn: 2000, msOut: 1000 })
    }
}
