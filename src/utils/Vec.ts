class Vec {
    static arg(angle: number): Vec {
        return new Vec(Math.cos(angle), Math.sin(angle))
    }

    constructor(public x: number, public y: number) {}

    get l(): [number, number] {
        return [this.x, this.y]
    }

    add(v: Vec): Vec {
        return new Vec(this.x + v.x, this.y + v.y)
    }

    sub(v: Vec): Vec {
        return new Vec(this.x - v.x, this.y - v.y)
    }

    scale(scalar: number): Vec {
        return new Vec(this.x * scalar, this.y * scalar)
    }

    hadamard(v: Vec): Vec {
        return new Vec(this.x * v.x, this.y * v.y)
    }

    dot(v: Vec): number {
        return this.x * v.x + this.y * v.y
    }

    argument(): number {
        return Math.atan2(this.y, this.x)
    }

    rotate(angle: number): Vec {
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        return new Vec(this.x * cos - this.y * sin, this.x * sin + this.y * cos)
    }

    mirror(xy: "x" | "y"): Vec {
        if (xy === "x") {
            return new Vec(this.x, -this.y)
        } else if (xy === "y") {
            return new Vec(-this.x, this.y)
        } else {
            throw new Error("Invalid axis for mirroring. Use 'x' or 'y'.")
        }
    }

    magnitude(): number {
        return Math.hypot(this.x, this.y)
    }

    normalize(): Vec {
        const mag = this.magnitude()

        if (mag === 0) {
            return new Vec(0, 0)
        }

        return new Vec(this.x / mag, this.y / mag)
    }
}
