import * as PIXI from "pixi.js"
import { keyboard } from "../../utils/Input"
import { Vec, vec } from "../../utils/Vec"
import { WIDTH, HEIGHT, CH, CW } from "./Constants"
import { Actor } from "./Actor"

export class Player extends Actor {
    readonly r = 12
    readonly speed = 5.5

    gs: Generator[] = []

    constructor(texture: PIXI.Texture) {
        super(texture)
        this.x = CW / 2
        this.y = CH / 4 + 100
        this.setSize(24)
        this.anchor.set(0.5)
    }

    update(deltaScaler: number) {
        super.update(deltaScaler)

        const v = vec(0, 0)

        if (keyboard.pressed.has("ArrowRight")) {
            v.x++
        } else if (keyboard.pressed.has("ArrowLeft")) {
            v.x--
        }

        if (keyboard.pressed.has("ArrowUp")) {
            v.y--
        } else if (keyboard.pressed.has("ArrowDown")) {
            v.y++
        }

        let s = this.speed
        if (keyboard.pressed.has("ShiftLeft")) s /= 2

        const u = v.normalize().scale(s * this.$deltaScaler)
        this.x += u.x
        this.y += u.y

        const gap = (CW - WIDTH) / 2
        const size = this.getSize().width
        const r = size / 2

        if (this.x < gap + r) this.x = gap + r
        if (this.x > WIDTH + gap - r) this.x = WIDTH + gap - r
        if (this.y < gap + r) this.y = gap + r
        if (this.y > HEIGHT + gap - r) this.y = HEIGHT + gap - r
    }
}
