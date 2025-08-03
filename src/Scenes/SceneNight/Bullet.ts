import * as PIXI from "pixi.js"
import { Vec, vec } from "../../utils/Vec.js"
import { CH, CW } from "./Constants.js"
import { Actor } from "./Actor.js"

export class Bullet extends Actor {
    speed: number = 7
    life: number = 1
    r: number = 12

    gs: Generator[] = []

    constructor(texture?: PIXI.Texture) {
        super(texture)
        this.anchor.set(0.5)
        this.rotation = 0
        this.setSize(32)
    }

    fire() {
        this.gs = this.Gs.map((g) => g(this))
    }

    update(deltaScaler: number) {
        const v = vec.arg(this.rotation).scale(this.speed * deltaScaler)
        this.x += v.x
        this.y += v.y

        const size = this.getSize().width
        if (this.x < -size || CW + size <= this.x || this.y < -size || CH + size <= this.y) this.life = 0

        const done: (boolean | undefined)[] = []
        this.gs.forEach((g) => done.push(g.next().done))
        this.gs = this.gs.filter((_, i) => !done[i])
    }
}
