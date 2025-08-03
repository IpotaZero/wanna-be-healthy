import * as PIXI from "pixi.js"

import { Input } from "../utils/Input.js"
import { Pages } from "../utils/Pages.js"
import { Scene } from "./Scene.js"
import { Player } from "./SceneNight/Player.js"
import { WIDTH, HEIGHT, CW, CH } from "./SceneNight/Constants.js"
import { G } from "./SceneNight/global.js"
import { Enemy0 } from "./SceneNight/Stages.js"
import { Timer } from "../utils/Timer.js"
import { Scenes } from "./Scenes.js"
import { Typing } from "../utils/Typing.js"

export class SceneNight extends Scene {
    readonly ready: Promise<void>
    readonly #rotatingLine = new PIXI.Graphics()

    readonly #grazeCoolTimer = new Timer(30)
    readonly #dawnTimer = new Timer(1440)

    #lineProgress: number = 0

    constructor() {
        super()

        G.enemies = []
        G.app = new PIXI.Application()

        this.#dawnTimer.action()

        this.ready = this.#setup()
    }

    #update(ticker: PIXI.Ticker) {
        const ds = ticker.deltaMS / (1000 / 60)
        this.#updateDanmaku(ds)

        this.#updateRotatingLine(ticker.deltaTime)

        this.#updateGameOver(ticker)
    }

    #updateDanmaku(ds: number) {
        for (let i = 0; i < Math.round(ds); i++) {
            G.player.update(1)
            G.enemies.forEach((e) => e.update(1))
            G.bullets.forEach((b) => b.update(1))
            this.#damage()
        }

        G.bullets.forEach((b) => {
            if (b.life <= 0) G.app.stage.removeChild(b)
        })
        G.bullets = G.bullets.filter((b) => b.life > 0)

        Input.update()
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

    #damage() {
        G.bullets.forEach((b) => {
            if (this.#grazeCoolTimer.timer === 0) {
                if (b.p.sub(G.player.p).magnitude() * 0.5 > b.r + G.player.r) return
                this.#lineProgress += 0.01
                this.#grazeCoolTimer.action()
            }

            if (b.p.sub(G.player.p).magnitude() * 1.5 > b.r + G.player.r) return

            b.life = 0

            this.#lineProgress = Math.max(this.#lineProgress - 0.1, 0)
        })

        this.#grazeCoolTimer.update()
    }

    #updateRotatingLine(deltaTime: number) {
        const rotationDuration = 12.0
        const gap = 16

        this.#lineProgress += deltaTime / (60 * rotationDuration)

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

        for (const seg of segments) {
            if (this.#lineProgress >= seg.start) {
                const p = Math.min((this.#lineProgress - seg.start) / (seg.end - seg.start), 1)
                const [x, y] = seg.to(p)
                this.#rotatingLine.lineTo(x, y)
            }
        }

        this.#rotatingLine.stroke({ width: 3, color: 0xff4444, cap: "square" })
    }

    async #setup() {
        await this.#setupPage()
        this.#setupFrame()
        this.#setupRotatingLine()
        this.#setupPlayer()

        await Promise.all([Enemy0.loadTexture()])

        G.enemies.push(new Enemy0())
        G.app.stage.addChild(...G.enemies)

        G.app.ticker.maxFPS = 60
        G.app.ticker.add(this.#update.bind(this))
    }

    async #setupPage() {
        const container = document.getElementById("container")!

        const html = await fetch("./pages/night.html").then((response) => response.text())
        new Pages(container, ".page", html)

        const cvs = container.querySelector<HTMLCanvasElement>("canvas")!

        await G.app.init({
            antialias: false,
            width: CW,
            height: CH,
            canvas: cvs,
        })
    }

    #setupFrame() {
        const gr = new PIXI.Graphics()
        gr.rect((CW - WIDTH) / 2, (CH - HEIGHT) / 2, WIDTH, HEIGHT).stroke({ width: 6, color: 0xffffff })
        G.app.stage.addChild(gr)
    }

    #setupRotatingLine() {
        G.app.stage.addChild(this.#rotatingLine)
    }

    #setupPlayer() {
        const graphic = new PIXI.Graphics()
        graphic.circle(0, 0, 20).stroke({ width: 3, color: 0xffffff, alpha: 0.9 })

        const texture = G.app.renderer.generateTexture(graphic)

        G.player = new Player(texture)
        G.app.stage.addChild(G.player)
    }
}

class SceneClear extends Scene {
    ready: Promise<void>

    constructor() {
        super()
        this.ready = this.#setPage()
    }

    async #setPage() {
        const container = document.getElementById("container")!

        container.innerHTML += `
            <i-typing>ねむれた...</i-typing>

            <style>
                i-typing {
                    position: absolute;
                    color: whitesmoke;
                }
            </style>
        `

        const text = container.querySelector<Typing>("i-typing")!
        text.onEnd = () => {
            text.classList.add("text-end")
        }
    }
}

class SceneFail extends Scene {
    ready: Promise<void>

    constructor() {
        super()
        this.ready = this.#setPage()
    }

    async #setPage() {
        const container = document.getElementById("container")!

        container.innerHTML += `
            <i-typing>てつやして しまった...</i-typing>

            <style>
                i-typing {
                    position: absolute;
                    color: whitesmoke;
                }
            </style>
        `

        const text = container.querySelector<Typing>("i-typing")!
        text.onEnd = () => {
            text.classList.add("text-end")
        }
    }
}
