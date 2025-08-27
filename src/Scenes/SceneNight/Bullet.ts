import * as PIXI from "pixi.js"
import { vec } from "../../utils/Vec.js"
import { CH, CW } from "./Constants.js"
import { Actor } from "./Actor.js"

export class Bullet extends Actor {
    speed: number = 6
    life: number = 1
    r: number = 12
    damage = 24

    constructor(texture?: PIXI.Texture, size = 32) {
        super(texture)
        this.anchor.set(0.5)
        this.rotation = 0
        // this.setSize(size)
    }

    fire() {
        this.gs = this.Gs.map((g) => g(this))
    }

    update(deltaScaler: number) {
        super.update(deltaScaler)

        const v = vec.arg(this.rotation).scale(this.speed * this.$deltaScaler)
        this.x += v.x
        this.y += v.y

        if (this.x < -this.r || CW + this.r <= this.x || this.y < -this.r || CH + this.r <= this.y) this.life = 0
    }
}
