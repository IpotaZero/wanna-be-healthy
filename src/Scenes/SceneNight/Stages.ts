import * as PIXI from "pixi.js"
import { Bullet } from "./Bullet.js"
import { CH, CW, HEIGHT } from "./Constants.js"
import { Enemy } from "./Enemy.js"
import { remodel } from "./Remodeler.js"
import { G } from "./global.js"
import { vec } from "../../utils/Vec.js"

export class Enemy0 extends Enemy {
    static #bulletTexture: PIXI.Texture

    static async loadTexture() {
        this.texture = await PIXI.Assets.load("./assets/energy.png")
        this.#bulletTexture = await PIXI.Assets.load("./assets/bullet0.png")
    }

    constructor() {
        super(Enemy0.texture)
        this.y = HEIGHT / 4
        this.setSize(120)
    }

    *G() {
        yield* this.$moveTo(vec(CW / 2 + 100, CH / 8), 60)
        yield* Array(60)
        yield* this.$moveTo(vec(CW / 2 - 100, CH / 8), 60)
        yield* Array(60)
    }

    *H() {
        remodel([new Bullet(Enemy0.#bulletTexture)])
            .p(this.p)
            .aim(G.player.p)
            .g(function* (me) {
                while (me.p.sub(G.player.p).magnitude() >= 100) yield

                remodel([new Bullet(Enemy0.#bulletTexture)])
                    .r(me.r * (2 / 3))
                    .size(me.getSize().width * (2 / 3))
                    .p(me.p)
                    .speed(me.speed / 4)
                    .accel(me.speed, 120)
                    .rotation(me.rotation)
                    .ex(7)
                    .fire()

                me.life = 0
            })
            .ex(13)
            .fire()
        yield* Array(60)
    }
}
