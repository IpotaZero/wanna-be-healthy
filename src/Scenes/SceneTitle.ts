import { BGM } from "../utils/BGM.js"
import { KeyDriver } from "../utils/KeyDriver.js"
import { MusicVisualizer } from "../utils/MusicVisualizer.js"
import { Pages } from "../utils/Pages.js"
import { ScrollDriver } from "../utils/ScrollDriver.js"
import { Timer } from "../utils/Timer.js"
import { Scene } from "./Scene.js"
import { Scenes } from "./Scenes.js"

export class SceneTitle extends Scene {
    ready: Promise<void>
    #keyDriver!: KeyDriver
    #scrollDriver!: ScrollDriver
    #pages!: Pages

    #mv!: MusicVisualizer
    #i!: number
    #timer = performance.now()

    constructor() {
        super()

        this.ready = this.#setup()
    }

    async #setup() {
        const container = document.getElementById("container")!

        const html = await fetch("./pages/title.html").then((response) => response.text())
        this.#pages = new Pages(container, "#normal", html)

        await this.#pages.ready

        await BGM.fetch("assets/sounds/title.mp3", { loopStart: 42, volume: 2 })
        BGM.play()

        const cvs = container.querySelector("canvas")!
        this.#mv = new MusicVisualizer(cvs, BGM.gain, BGM.context)

        this.#pages.after = () => {
            this.#keyDriver.update()
            this.#scrollDriver.page = this.#pages.currentPage
        }

        this.#keyDriver = new KeyDriver("horizontal")

        this.#scrollDriver = new ScrollDriver(this.#pages.currentPage)

        this.#setupButtons()

        this.#i = setInterval(this.#update.bind(this))
    }

    #setupButtons() {
        document.querySelector<HTMLElement>("#game")!.onclick = async () => {
            // const { SceneDay: Scene } = await import("./SceneDay.js")
            // const { SceneNight: Scene } = await import("./SceneNight.js")
            const { SceneNovel: Scene } = await import("./SceneNovel.js")
            // const { SceneMedicine: Scene } = await import("./SceneMedicine.js")

            BGM.fadeOut(1000)

            Scenes.goto(() => new Scene(), { msIn: 1000, msOut: 1000 })
        }
    }

    async end() {
        this.#keyDriver.discard()
        this.#scrollDriver.discard()

        clearInterval(this.#i)
    }

    #update() {
        if (performance.now() - this.#timer >= 25500) {
            this.#mv.update()
        }
    }
}
