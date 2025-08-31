import * as PIXI from "pixi.js"

import { Pages } from "../utils/Pages.js"
import { Scene } from "./Scene.js"
import { Player } from "./SceneNight/Player.js"
import { WIDTH, HEIGHT, CW, CH } from "./SceneNight/Constants.js"
import { G } from "./SceneNight/global.js"
import { Enemy0, Enemy1, Enemy2, Enemy3 } from "./SceneNight/Stages.js"
import { Timer } from "../utils/Timer.js"
import { Scenes } from "./Scenes.js"
import { ETyping } from "../utils/ETyping.js"
import { Awaits } from "../utils/Awaits.js"
import { Danmaku } from "./SceneNight/Danmaku.js"
import { SE } from "../SE.js"
import { OK } from "../utils/ok.js"
import { BGM } from "../utils/BGM"
import { State } from "../State.js"
import { Input } from "../utils/Input.js"

export class SceneNight extends Scene {
    readonly ready: Promise<void>

    readonly #rotatingLine = new PIXI.Graphics()
    #lineProgress: number = 0

    readonly #dawnLine = new PIXI.Graphics()
    readonly #dawnTimer = new Timer(720)

    readonly #danmaku = new Danmaku()

    #difficulty

    #page!: Pages

    constructor(difficulty: number) {
        super()

        this.#difficulty = difficulty

        G.bullets = []
        G.enemies = []
        G.app = new PIXI.Application()

        this.#dawnTimer.action()

        this.#danmaku.onDamage = (damage) => {
            this.#lineProgress = Math.max(this.#lineProgress - damage / 240, 0)
            SE.damage.play()
        }

        this.#danmaku.onGraze = () => {
            this.#lineProgress += 0.005
        }

        Input.isAvailable = true

        this.ready = this.#setup()
    }

    #update(ticker: PIXI.Ticker) {
        const ds = ticker.deltaMS / (1000 / 60)
        this.#danmaku.update(ds)

        this.#updateRotatingLine(ticker.deltaTime)
        this.#updateDawnLine()

        this.#updateGameOver(ticker)
    }

    #updateGameOver(ticker: PIXI.Ticker) {
        this.#dawnTimer.update()

        if (this.#dawnTimer.timer === 0) {
            ticker.destroy()
            Scenes.goto(() => new SceneFail())
            return
        }

        if (this.#lineProgress >= 1) {
            ticker.destroy()
            Scenes.goto(() => new SceneClear())
            return
        }
    }

    #updateRotatingLine(deltaTime: number) {
        const rotationDuration = 20.0
        const gap = 16

        this.#lineProgress += (deltaTime / (60 * rotationDuration)) * Math.sqrt(this.#difficulty + 1)

        this.#rotatingLine.clear()

        const frameX = (CW - WIDTH) / 2 - gap
        const frameY = (CH - HEIGHT) / 2 - gap
        const frameWidth = WIDTH + 2 * gap
        const frameHeight = HEIGHT + 2 * gap

        this.#rotatingLine.moveTo(frameX, frameY)

        const segments = [
            { start: 0.0, end: 0.25, to: (p: number) => [frameX + frameWidth * p, frameY] },
            { start: 0.25, end: 0.5, to: (p: number) => [frameX + frameWidth, frameY + frameHeight * p] },
            { start: 0.5, end: 0.75, to: (p: number) => [frameX + frameWidth * (1 - p), frameY + frameHeight] },
            { start: 0.75, end: 1.0, to: (p: number) => [frameX, frameY + frameHeight * (1 - p)] },
        ]

        const pr = this.#dawnTimer.progress()

        for (const seg of segments) {
            if (pr >= seg.start) {
                const p = Math.min((pr - seg.start) / (seg.end - seg.start), 1)
                const [x, y] = seg.to(p)
                this.#rotatingLine.lineTo(x, y)
            }
        }

        this.#rotatingLine.stroke({ width: 3, color: 0xff4444, cap: "square" })
    }

    #updateDawnLine() {
        this.#dawnLine.clear()

        const progress = 1 - this.#lineProgress

        this.#dawnLine
            .moveTo((CH - WIDTH) / 2 + 130, CH - 100)
            .lineTo((CH - WIDTH) / 2 + 130 + (WIDTH / 2) * progress, CH - 100)
            .stroke({
                color: 0xffff80,
                width: 24,
            })
    }

    async #setup() {
        await this.#setupPage()
        this.#setupFrame()
        this.#setupLines()
        this.#setupPlayer()

        const loadFont = PIXI.Assets.load({
            src: "assets/font/marukiya.ttf",
            data: {
                family: "dot",
            },
        })

        const Enemy = [Enemy0, Enemy1, Enemy2, Enemy3][State.day]

        await Promise.all([Enemy.loadTexture(), loadFont])

        G.enemies.push(new Enemy())
        G.app.stage.addChild(...G.enemies)

        const detune = State.dark ? -100 : 0

        await BGM.fetch("assets/sounds/bullet.mp3", { detune })
        BGM.play()

        this.#start()
    }

    async #setupPage() {
        const container = document.getElementById("container")!

        const html = await fetch("./pages/night.html").then((response) => response.text())
        this.#page = new Pages(container, "#night", html)

        State.display(container.querySelector("sub")!)

        const cvs = container.querySelector<HTMLCanvasElement>("canvas")!

        await G.app.init({
            antialias: false,
            width: CW,
            height: CH,
            canvas: cvs,
            resolution: window.devicePixelRatio || 1,
        })
    }

    #setupFrame() {
        const gr = new PIXI.Graphics()
        gr.rect((CW - WIDTH) / 2, (CH - HEIGHT) / 2, WIDTH, HEIGHT).stroke({ width: 6, color: 0xffffff })
        G.app.stage.addChild(gr)
    }

    #setupLines() {
        G.app.stage.addChild(this.#rotatingLine)
        G.app.stage.addChild(this.#dawnLine)

        const text = new PIXI.Text({
            text: "Awareness:",
            style: {
                fill: 0xf5f5f5,
                fontFamily: "dot",
            },
            x: (CW - WIDTH) / 2 + 30,
            y: CH - 100 - 4,
            anchor: 0.5,
        })
        G.app.stage.addChild(text)
    }

    #setupPlayer() {
        const graphic = new PIXI.Graphics()
        graphic.circle(0, 0, 20).stroke({ width: 3, color: 0xffffff, alpha: 0.9 })

        const texture = G.app.renderer.generateTexture(graphic)

        G.player = new Player(texture)
        G.app.stage.addChild(G.player)
    }

    async #start() {
        await Awaits.ok()
        await this.#page.goto("#game", { msIn: 600 })

        await this.#displayText()

        G.app.ticker.maxFPS = 30
        G.app.ticker.add(this.#update.bind(this))
    }

    async #displayText() {
        const text = new ETyping("しげきをさけて よあけまでに ねむれ!", SE.voice)
        text.style.position = "absolute"
        text.style.color = "whitesmoke"
        text.style.backgroundColor = "#000000"

        const container = document.querySelector("#container #game")!
        container.appendChild(text)

        await Awaits.key()

        text.classList.add("fade-out")
        text.onanimationend = () => {
            text.remove()
        }
    }
}

class SceneClear extends Scene {
    ready: Promise<void>

    #ok = new OK(async () => {
        State.day++

        if (State.day === 4) {
            const { SceneNovel } = await import("./SceneNovel.js")
            Scenes.goto(() => new SceneNovel(false), { msIn: 1000, msOut: 1000 })
        } else {
            const { SceneDay } = await import("./SceneDay.js")
            Scenes.goto(() => new SceneDay())
        }
    })

    constructor() {
        super()
        this.ready = this.#setPage()
    }

    async end(): Promise<void> {
        BGM.fadeOut(1000)
    }

    async #setPage() {
        const container = document.querySelector("#container #game")!

        container.innerHTML += `
            <i-typing se="assets/sounds/select.wav">ねむれた...</i-typing>
            <img src="assets/bed.png"/>

            <style>
                i-typing {
                    position: absolute;
                    color: whitesmoke;
                    top: 20dvh;
                }

                img {
                    position: absolute;
                    width: 25dvh;
                    height: 25dvh;
                }
            </style>
        `

        const text = container.querySelector<ETyping>("i-typing")!
        text.onEnd = () => {
            text.classList.add("text-end")
        }
    }
}

class SceneFail extends Scene {
    ready: Promise<void>

    constructor() {
        super()
        this.ready = Promise.resolve()

        if (State.dark) {
            this.#dark()
        } else {
            this.#setPage()
        }
    }

    async #next() {
        State.day++
        State.yami++

        if (State.day === 4) {
            const { SceneNovel } = await import("./SceneNovel.js")
            await Scenes.goto(() => new SceneNovel(false), { msIn: 1000, msOut: 1000 })
        } else {
            const { SceneDay } = await import("./SceneDay.js")
            await Scenes.goto(() => new SceneDay())
        }
    }

    async #dark() {
        await BGM.pause()

        SE.pakipaki.play()
        const vale = document.createElement("div")
        vale.classList.add("vale")
        document.body.appendChild(vale)

        await Awaits.sleep(1500)

        await this.#next()

        await Awaits.sleep(1000)

        vale.classList.add("fade-out")
        await Awaits.sleep(1000)
        vale.remove()
    }

    async end() {
        BGM.fadeOut(1000)
    }

    async #setPage() {
        const container = document.querySelector("#container main")!

        container.innerHTML += `
            <i-typing se="assets/sounds/select.wav">てつやして しまった...</i-typing>

            <style>
                i-typing {
                    position: absolute;
                    color: whitesmoke;
                }
            </style>
        `

        const text = container.querySelector<ETyping>("i-typing")!
        text.onEnd = () => {
            text.classList.add("text-end")
        }

        await Awaits.ok()

        this.#next()
    }
}
