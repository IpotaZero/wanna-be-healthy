export const vec = (x: number, y: number) => new Vec(x, y)
vec.arg = (angle: number) => vec(Math.cos(angle), Math.sin(angle))
vec.from = ({ x, y }: { x: number; y: number }) => vec(x, y)

export class Vec {
    constructor(public x: number, public y: number) {}

    add(v: { x: number; y: number }) {
        return new Vec(this.x + v.x, this.y + v.y)
    }

    sub(v: { x: number; y: number }) {
        return new Vec(this.x - v.x, this.y - v.y)
    }

    scale(c: number) {
        return new Vec(this.x * c, this.y * c)
    }

    magnitude() {
        return Math.hypot(this.x, this.y)
    }

    normalize() {
        const l = this.magnitude()
        return l === 0 ? new Vec(0, 0) : this.scale(1 / l)
    }
}
