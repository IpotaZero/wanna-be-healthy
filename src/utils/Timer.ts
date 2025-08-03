export class Timer {
    readonly length
    timer = 0

    constructor(length: number) {
        this.length = length
    }

    update() {
        if (this.timer > 0) {
            this.timer--
        }
    }

    action() {
        this.timer = this.length
    }
}
