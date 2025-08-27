import { SE } from "../SE"
import { State } from "../State"
import { Awaits } from "../utils/Awaits"
import { ETyping } from "../utils/ETyping"
import { Pages } from "../utils/Pages"
import { Scene } from "./Scene"
import { Scenes } from "./Scenes"
import { SceneTitle } from "./SceneTitle"

export class SceneNovel extends Scene {
    ready: Promise<void>

    #page!: Pages

    constructor() {
        super()
        this.ready = this.#setup()
    }

    async #setup() {
        const html = await (await fetch("pages/novel.html")).text()

        this.#page = new Pages(document.querySelector("#container")!, "#novel", html)

        this.#loop()
    }

    async #loop() {
        const bottom = document.querySelector("#bottom")!

        const story = texts[Math.min(State.yami, 4)]

        for (const text of story) {
            const t = new ETyping(text, SE.voice)
            bottom.appendChild(t)

            await Promise.race([t.end, Awaits.ok()])
            t.classList.add("text-end")

            if (!t.isEnd) {
                t.finish()
            }

            await Awaits.ok()

            t.remove()
        }

        State.reset()
        Scenes.goto(() => new SceneTitle())
    }
}

const texts = [[""]]
