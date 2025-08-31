import { State } from "../State"
import { SE } from "../SE"
import { Awaits } from "../utils/Awaits"
import { BGM } from "../utils/BGM"
import { ETyping } from "../utils/ETyping"
import { Input, keyboard } from "../utils/Input"
import { Pages } from "../utils/Pages"
import { Scene } from "./Scene"
import { Typing } from "./SceneDay/Typing"
import { Scenes } from "./Scenes"

export class SceneDay extends Scene {
    ready: Promise<void>

    #pages!: Pages

    #interval!: number

    #typing!: Typing

    constructor() {
        super()

        Input.isAvailable = false

        this.ready = this.#setup()
    }

    async end(): Promise<void> {
        // clearInterval(this.#interval)
    }

    async #setup() {
        const detune = State.dark ? -100 : 0

        const [html, _, csv] = await Promise.all([
            fetch("pages/day.html"),
            BGM.fetch(`assets/sounds/stage-${~~(State.day / 2)}.mp3`, { loop: false, detune }),
            fetch(`assets/typing/stage-${State.day}.csv`),
        ])

        const container = document.getElementById("container")!
        this.#pages = new Pages(container, "#day", await html.text())
        State.display(container.querySelector("sub")!)

        this.#start(await csv.text())
    }

    async #start(csv: string) {
        await Awaits.ok()

        await this.#pages.goto("#game", { msIn: 600 })

        let score = 0
        const scoreElm = document.getElementById("score")!

        const t = new ETyping("ノートをとれ!", SE.voice)
        t.classList.add("text")
        document.querySelector("#container #game")!.appendChild(t)

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
        BGM.source!.onended = () => {
            this.#typing.finish()
            this.#finish(score)
        }

        const gauge = document.getElementById("gauge")!
        gauge.style.transition = `transform ${BGM.source?.buffer?.duration ?? 1}s linear`
        gauge.style.transform = "scaleX(0)"
    }

    async #finish(score: number) {
        const t = new ETyping(`ねむけレベル: ${score}`, SE.voice)
        t.classList.add("text")
        document.querySelector("#container #game")!.appendChild(t)

        await Promise.race([Awaits.sleep(1000), Awaits.ok()])
        await Awaits.ok()

        if (State.dark) {
            const { SceneNight } = await import("./SceneNight")
            Scenes.goto(() => new SceneNight(0))
        } else {
            const { SceneMedicine } = await import("./SceneMedicine")
            Scenes.goto(() => new SceneMedicine(score))
        }
    }
}
