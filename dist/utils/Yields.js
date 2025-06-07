"use strict";
var Yields;
(function (Yields) {
    class Timer {
        #startTime = performance.now();
        #duration;
        #easingFunction;
        constructor(ms, easingFunction = (t) => 1 - (1 - t) ** 2) {
            this.#duration = ms;
            this.#easingFunction = easingFunction;
        }
        get progress() {
            const p = (performance.now() - this.#startTime) / this.#duration;
            if (p <= 0)
                return 0;
            if (1 <= p)
                return 1;
            return this.#easingFunction(p);
        }
    }
    Yields.Timer = Timer;
    function* wait(ms) {
        const startTime = performance.now();
        yield;
        while (performance.now() - startTime < ms) {
            yield;
        }
    }
    Yields.wait = wait;
})(Yields || (Yields = {}));
