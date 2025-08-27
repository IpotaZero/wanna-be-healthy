import * as PIXI from "pixi.js"
import { Vec, vec } from "../../utils/Vec"
import { Actor } from "./Actor"

type FunctionSetting = {
    loop: number
    margin: number
}

export abstract class Enemy extends Actor {
    static texture: PIXI.Texture

    static async loadTexture() {}

    frame = 0

    constructor(texture?: PIXI.Texture) {
        super(texture)
        this.anchor.set(0.5)

        this.#setupGenerators()
    }

    #setupGenerators() {
        const generatorNames = ["G", "H", "I", "J"] as const

        const s = [(this as any).g, (this as any).h, (this as any).i, (this as any).j] as FunctionSetting[]

        generatorNames.forEach((k, j) => {
            if (k in this) {
                let l = s[j] ? s[j].loop ?? Infinity : Infinity
                const m = s[j] ? s[j].margin ?? 0 : 0
                const g = (this as any)[k].bind(this)

                this.gs.push(
                    function* () {
                        yield* Array(m)

                        while (l--) {
                            yield* g()
                        }
                    }.bind(this)(),
                )
            }
        })
    }

    update(deltaScaler: number) {
        super.update(deltaScaler)
        this.frame++
    }

    protected $moveTo(p: { x: number; y: number }, frame: number, ease = (t: number) => 1 - (1 - t) ** 2) {
        const o = vec(this.p.x, this.p.y)
        const t = vec(p.x, p.y)

        this.gs.push(
            function* (this: Enemy) {
                for (let i = 0; i < frame; i++) {
                    this.p = t
                        .sub(o)
                        .scale(ease((i + this.$deltaScaler) / frame))
                        .add(o)
                    yield
                }
            }.bind(this)(),
        )

        return Array(frame)
    }
}
