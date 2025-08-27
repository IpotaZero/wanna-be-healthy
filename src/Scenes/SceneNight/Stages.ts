import * as PIXI from "pixi.js"
import * as PIXIFilter from "pixi-filters"

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
            .size(32)
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

export class Enemy1 extends Enemy {
    static #bulletTexture0: PIXI.Texture
    static #bulletTexture1: PIXI.Texture

    static async loadTexture() {
        this.texture = await PIXI.Assets.load("./assets/smartphone.png")
        this.#bulletTexture0 = await PIXI.Assets.load("./assets/bullet0.png")
        this.#bulletTexture1 = await PIXI.Assets.load("./assets/bullet1.png")
    }

    constructor() {
        super(Enemy1.texture)
        this.y = HEIGHT / 4
        this.setSize(120)
    }

    *G() {
        yield* this.$moveTo(vec(G.player.p.x, HEIGHT / 4), 60)

        for (let i = 0; i < 60; i++) {
            remodel([new Bullet(Enemy1.#bulletTexture1)])
                .size(32)
                .p(this.p)
                .rotation(Math.PI / 2)
                .accel(24, 120)
                .fire()

            yield
        }
    }

    *H() {
        for (let i = 0; i < 4; i++) {
            yield* this.#ex()
        }

        for (let i = 0; i < 2; i++) {
            yield* this.#nway()
        }
    }

    *#ex() {
        remodel([new Bullet(Enemy1.#bulletTexture0)])
            .size(32)
            .p(this.p)
            .ex(13)
            .accel(0, 120)
            .sleep(30)
            .accel(12, 120)
            .spin(0.01)
            .fire()
        yield* Array(30)

        remodel([new Bullet(Enemy1.#bulletTexture0)])
            .size(32)
            .p(this.p)
            .ex(13)
            .accel(0, 120)
            .sleep(30)
            .accel(12, 120)
            .spin(-0.01)
            .fire()
        yield* Array(30)
    }

    *#nway() {
        for (let i = 0; i < 3; i++) {
            remodel([new Bullet(Enemy1.#bulletTexture0)])
                .size(32)
                .p(this.p)
                .aim(G.player.p)
                .accel(0, 120)
                .sleep(30)
                .accel(12, 120)
                .nway(3, Math.PI / 12)
                .fire()

            yield* Array(10)
        }

        yield* Array(60)

        for (let i = 0; i < 3; i++) {
            remodel([new Bullet(Enemy1.#bulletTexture0)])
                .size(32)
                .p(this.p)
                .aim(G.player.p)
                .accel(0, 120)
                .sleep(30)
                .accel(12, 120)
                .nway(4, Math.PI / 12)
                .fire()

            yield* Array(10)
        }
    }
}

export class Enemy2 extends Enemy {
    static #bulletTexture0: PIXI.Texture
    static #bulletTexture2: PIXI.Texture

    static async loadTexture() {
        this.texture = await PIXI.Assets.load("./assets/gamepad.png")
        this.#bulletTexture0 = await PIXI.Assets.load("./assets/bullet0.png")
        this.#bulletTexture2 = await PIXI.Assets.load("./assets/bullet2.png")
    }

    constructor() {
        super(Enemy2.texture)
        this.y = HEIGHT / 4
        this.setSize(120)
    }

    *G() {
        yield* this.$moveTo(vec(Math.sin(this.frame / 24) * 200 + CW / 2, HEIGHT / 4), 60)

        yield* this.#spiral()

        yield* Array(60)

        for (let i = 0; i < 3; i++) {
            remodel([new Bullet(Enemy2.#bulletTexture0)])
                .size(32)
                .p(this.p)
                .aim(G.player.p)
                .nway(3, Math.PI / 12)
                .sim(5, 12)
                .fire()

            yield* this.$moveTo(vec(Math.sin(this.frame / 24) * 200 + CW / 2, HEIGHT / 4), 40)
        }

        yield* Array(60)
    }

    *#spiral() {
        const num = 30

        for (let i = 0; i < num; i++) {
            remodel([new Bullet(Enemy2.#bulletTexture2)])
                .p(this.p)
                .rotation(Math.PI * 2 * (i / num))

                .accel(1, 30)
                .accel(6, 15, (t) => t ** 2)
                .sleep(45)
                .accel(3, 15)
                .for(15)
                .spin(0.2 * (2 * (i % 2) - 1))
                .accel(6, 15)

                .fire()
            yield
        }
    }
}

export class Enemy3 extends Enemy {
    static #bulletTexture0: PIXI.Texture
    static #bulletTexture1: PIXI.Texture

    static async loadTexture() {
        this.texture = await PIXI.Assets.load("./assets/heart.png")
        this.#bulletTexture0 = await PIXI.Assets.load("./assets/bullet0.png")
        this.#bulletTexture1 = await PIXI.Assets.load("./assets/bullet1.png")
    }

    constructor() {
        super(Enemy3.texture)
        this.x = CW / 2
        this.y = HEIGHT / 4
        this.setSize(120)
    }

    *G() {
        const num = 12

        for (let i = 0; i < num; i++) {
            remodel([new Bullet(Enemy3.#bulletTexture0)])
                .r(8)
                .size(24)
                .p(this.p.add(vec.arg(this.frame + i / num).scale(100)))
                .ex(23)
                .accel(1, 30)
                .accel(2, 30)
                .sleep(120)
                .accel(4, 30)
                .fire()

            yield* Array(10)
        }

        yield* Array(60)
    }

    *H() {
        this.y = Math.sin(this.frame / 24) * 24 + HEIGHT / 4
        yield
    }
}
