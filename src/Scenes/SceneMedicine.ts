import { State } from "../State"
import { Awaits } from "../utils/Awaits"
import { ETyping } from "../utils/ETyping"
import { KeyDriver } from "../utils/KeyDriver"
import { Pages } from "../utils/Pages"
import { Scene } from "./Scene"
import { Scenes } from "./Scenes"

export class SceneMedicine extends Scene {
    ready: Promise<void>
    #page!: Pages
    #useButton!: HTMLElement
    #notUseButton!: HTMLElement
    #dame!: ETyping
    #count = 0

    #selected = false

    #keyDriver!: KeyDriver

    constructor(difficulty: number) {
        super()
        this.ready = this.#setup(difficulty)
    }

    async end(): Promise<void> {
        this.#keyDriver.discard()
    }

    async #setup(difficulty: number) {
        const container = document.querySelector<HTMLElement>("#container")!
        const html = await fetch("pages/medicine.html").then((res) => res.text())
        this.#page = new Pages(container, "#medicine", html)

        await this.#page.ready

        await Awaits.sleep(100)
        this.#keyDriver = new KeyDriver("horizontal")

        this.#cacheElements(container)
        this.#attachEventHandlers(difficulty)
    }

    #cacheElements(container: HTMLElement) {
        this.#useButton = container.querySelector<HTMLElement>("button:nth-child(1)")!
        this.#notUseButton = container.querySelector<HTMLElement>("button:nth-child(2)")!
        this.#dame = container.querySelector("#dame")!
    }

    #attachEventHandlers(difficulty: number) {
        this.#useButton.onclick = () => this.#handleUse(difficulty)
        this.#notUseButton.onclick = () => this.#handleNotUse(difficulty)
    }

    async #handleUse(difficulty: number) {
        if (this.#selected) return

        if (this.#count === 10) {
            this.#selected = true

            this.#count++

            this.#keyDriver.isAvailable = false

            State.dark = true
            State.day++

            const container = document.querySelector<HTMLElement>("#container")!

            const vale = document.createElement("div")
            vale.classList.add("vale")
            document.body.appendChild(vale)

            await Awaits.sleep(2000)

            container.style.transform = "rotate(2deg)"
            document.querySelector<HTMLElement>("#cover")!.style.transform = "rotate(2deg)"

            const { SceneDay } = await import("./SceneDay")
            await Scenes.goto(() => new SceneDay())
            vale.classList.add("fade-out")

            await Awaits.sleep(2000)

            vale.remove()

            return
        }

        if (State.usedMedicine) {
            this.#showDame()
            this.#count++
        } else {
            this.#selected = true

            State.usedMedicine = true
            State.day++
            this.#keyDriver.isAvailable = false
            const { SceneDay } = await import("./SceneDay")
            Scenes.goto(() => new SceneDay())
        }
    }

    async #handleNotUse(difficulty: number) {
        this.#selected = true

        this.#keyDriver.isAvailable = false
        const { SceneNight } = await import("./SceneNight")
        Scenes.goto(() => new SceneNight(difficulty))
    }

    #showDame() {
        this.#dame.classList.remove("transparent")
        this.#dame.reset()

        console.log(this.#count)

        this.#dame.style.color = `rgb(${(this.#count / 20) * 255}, 0, 0)`
    }
}
