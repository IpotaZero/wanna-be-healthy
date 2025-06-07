"use strict";
class Vec {
    x;
    y;
    static arg(angle) {
        return new Vec(Math.cos(angle), Math.sin(angle));
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get l() {
        return [this.x, this.y];
    }
    add(v) {
        return new Vec(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vec(this.x - v.x, this.y - v.y);
    }
    scale(scalar) {
        return new Vec(this.x * scalar, this.y * scalar);
    }
    hadamard(v) {
        return new Vec(this.x * v.x, this.y * v.y);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    argument() {
        return Math.atan2(this.y, this.x);
    }
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vec(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
    mirror(xy) {
        if (xy === "x") {
            return new Vec(this.x, -this.y);
        }
        else if (xy === "y") {
            return new Vec(-this.x, this.y);
        }
        else {
            throw new Error("Invalid axis for mirroring. Use 'x' or 'y'.");
        }
    }
    magnitude() {
        return Math.hypot(this.x, this.y);
    }
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            return new Vec(0, 0);
        }
        return new Vec(this.x / mag, this.y / mag);
    }
    lerp(end, progress) {
        return this.add(end.sub(this).scale(progress));
    }
}
