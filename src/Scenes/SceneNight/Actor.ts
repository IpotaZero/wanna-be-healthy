import * as PIXI from "pixi.js"
import { vec, Vec } from "../../utils/Vec"

export abstract class Actor extends PIXI.Sprite {
    r: number = 12
    speed: number = 5
    Gs: ((me: Actor) => Generator)[] = []

    get p() {
        return vec.from(this.position)
    }

    set p({ x, y }: Vec) {
        this.position.set(x, y)
    }

    clone(): typeof this {
        const c = Object.getPrototypeOf(this).constructor

        const bullet = new c(this.texture)
        bullet.x = this.x
        bullet.y = this.y
        bullet.rotation = this.rotation
        bullet.speed = this.speed
        bullet.Gs = [...this.Gs]
        return bullet
    }

    pushGenerator(g: (me: typeof this) => Generator, margin: number = 0) {
        this.Gs.push(
            function* (me: any) {
                if (margin > 0) yield* Array(margin)
                yield* g(me)
            }.bind(this),
        )
    }
}
