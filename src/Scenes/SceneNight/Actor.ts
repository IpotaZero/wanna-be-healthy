import * as PIXI from "pixi.js"
import { vec, Vec } from "../../utils/Vec"

export abstract class Actor extends PIXI.Sprite {
    /**当たり判定 */
    r: number = 12
    speed: number = 5
    Gs: ((me: Actor) => Generator)[] = []
    gs: Generator[] = []

    protected $deltaScaler = 1

    get p() {
        return vec.from(this.position)
    }

    set p({ x, y }: Vec) {
        this.position.set(x, y)
    }

    clone(): typeof this {
        const c = Object.getPrototypeOf(this).constructor

        const actor = new c(this.texture) as typeof this
        actor.x = this.x
        actor.y = this.y
        actor.rotation = this.rotation
        actor.speed = this.speed
        actor.Gs = [...this.Gs]

        actor.width = this.width
        actor.height = this.height

        return actor
    }

    pushGenerator(g: (me: typeof this) => Generator, margin: number = 0) {
        this.Gs.push(
            function* (me: any) {
                if (margin > 0) yield* Array(margin)
                yield* g(me)
            }.bind(this),
        )
    }

    update(deltaScaler: number) {
        this.$deltaScaler = deltaScaler

        const done: (boolean | undefined)[] = []
        this.gs.forEach((g) => done.push(g.next().done))
        this.gs = this.gs.filter((_, i) => !done[i])
    }
}
