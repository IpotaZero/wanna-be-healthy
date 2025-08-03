import { Actor } from "./Actor.js"
import { Bullet } from "./Bullet.js"
import { G } from "./global.js"

export const remodel = <T extends Actor>(actors: T[]): R<T> =>
    new Proxy(new Remodeler(actors), {
        get(t, p) {
            if (p in t) return (t as any)[p]

            return function (this: R<T>, value: unknown) {
                t.set(p as string, value)
                return this
            }
        },
    }) as R<T>

type R<T extends Actor> = Remodeler<T> & {
    [k in keyof Actor]: (value: Actor[k]) => R<T>
}

class Remodeler<T extends Actor> {
    actors: T[]
    margin: number = 0

    constructor(actors: T[]) {
        this.actors = actors.map((b) => b.clone())
    }

    rev(radian: number) {
        this.actors.forEach((b) => {
            b.rotation += radian
        })

        return this
    }

    ex(num: number) {
        this.actors = this.actors.flatMap((b) => {
            const bs: T[] = []

            for (let i = 0; i < num; i++) {
                const newB = b.clone()
                newB.rotation += 2 * Math.PI * (i / num)
                bs.push(newB)
            }

            return bs
        })

        return this
    }

    nway(num: number, radian: number) {
        this.actors = this.actors.flatMap((b) => {
            const bs: T[] = []

            for (let i = 0; i < num; i++) {
                const newB = b.clone()
                newB.rotation += radian * (i - (num - 1) / 2)
                bs.push(newB)
            }

            return bs
        })

        return this
    }

    aim({ x, y }: { x: number; y: number }) {
        this.actors.forEach((b) => {
            const radian = Math.atan2(y - b.p.y, x - b.p.x)
            b.rotation = radian
        })

        return this
    }

    set(key: string, value: unknown) {
        this.actors.forEach((b) => {
            ;(b as any)[key] = value
        })

        return this
    }

    g(g: (me: T) => Generator) {
        this.actors.forEach((b) => {
            b.pushGenerator(g.bind(b), this.margin)
        })

        return this
    }

    f(f: (me: T) => void) {
        return this.g(function* (me) {
            while (1) {
                f(me)
                yield
            }
        })
    }

    size(size: number) {
        this.actors.forEach((b) => {
            b.setSize(size)
        })

        return this
    }

    stack(margin: number) {
        this.margin = margin
        return this
    }

    accel(speed: number, frame: number, ease = (t: number) => 1 - (1 - t) ** 2) {
        return this.g(function* (me) {
            const s = me.speed

            for (let i = 0; i < frame; i++) {
                me.speed = s + ease((i + 1) / frame) * (speed - s)
                yield
            }
        })
    }

    fire() {
        if (!this.isBullets()) throw new TypeError("asdfghj")

        this.actors.forEach((b) => {
            ;(b as unknown as Bullet).fire()
        })

        G.bullets.push(...this.actors)
        G.app.stage.addChild(...this.actors)
    }

    isBullets(): this is this & { actors: Bullet[] } {
        return this.actors[0] && this.actors[0] instanceof Bullet
    }
}
