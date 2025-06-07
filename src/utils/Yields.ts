namespace Yields {
    export class Timer {
        #startTime: number = performance.now()
        #duration: number
        #easingFunction: (t: number) => number

        constructor(ms: number, easingFunction = (t: number) => 1 - (1 - t) ** 2) {
            this.#duration = ms
            this.#easingFunction = easingFunction
        }

        get progress(): number {
            const p = (performance.now() - this.#startTime) / this.#duration

            if (p <= 0) return 0

            if (1 <= p) return 1

            return this.#easingFunction(p)
        }
    }

    export function* wait(ms: number) {
        const startTime = performance.now()
        yield
        while (performance.now() - startTime < ms) {
            yield
        }
    }
}
