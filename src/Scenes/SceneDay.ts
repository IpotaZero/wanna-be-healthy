import { SE } from "../SE"
import { Awaits } from "../utils/Awaits"
import { BGM } from "../utils/BGM"
import { ETyping } from "../utils/ETyping"
import { Input, keyboard } from "../utils/Input"
import { Pages } from "../utils/Pages"
import { Scene } from "./Scene"
import { Typing } from "./SceneDay/Typing"
import { SceneNight } from "./SceneNight"
import { Scenes } from "./Scenes"

export class SceneDay extends Scene {
    ready: Promise<void>

    #pages!: Pages

    #interval!: number

    #typing!: Typing

    constructor() {
        super()

        this.ready = this.#setup()
    }

    async end(): Promise<void> {
        // clearInterval(this.#interval)
    }

    async #setup() {
        const [html, _, csv] = await Promise.all([
            fetch("pages/day.html"),
            BGM.fetch("assets/sounds/stage-1.mp3", false),
            fetch("assets/typing/stage-0.csv"),
        ])

        this.#pages = new Pages(document.getElementById("container")!, "#day", await html.text())

        this.#start(await csv.text())
    }

    async #start(csv: string) {
        let score = 0
        const scoreElm = document.getElementById("score")!

        const t = new ETyping("ノートをとれ!", SE.voice)
        t.classList.add("text")
        document.getElementById("container")!.appendChild(t)

        this.#typing = new Typing(csv.split("\n"))

        this.#typing.onStart = () => {
            t.remove()
        }

        const nemu = document.getElementById("nemu")!

        this.#typing.onClear = () => {
            score++
            scoreElm.textContent = `Score: ${score}`

            scoreElm.classList.remove("up")
            nemu.classList.remove("up")

            requestAnimationFrame(async () => {
                scoreElm.classList.add("up")
                nemu.classList.add("up")

                await Awaits.sleep(400)

                nemu.classList.remove("up")
            })
        }

        await this.#typing.ready

        BGM.play()
        BGM.audio!.onended = () => {
            this.#typing.finish()
            this.#finish(score)
        }

        const gauge = document.getElementById("gauge")!
        gauge.style.transition = `transform ${BGM.audio?.duration}s linear`
        gauge.style.transform = "scaleX(0)"
    }

    async #finish(score: number) {
        const t = new ETyping(`ねむけレベル: ${score}`, SE.voice)
        t.classList.add("text")
        document.getElementById("container")!.appendChild(t)

        await Awaits.ok()

        Scenes.goto(() => new SceneNight())
    }
}
