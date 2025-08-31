export class Awaits {
    static fadeOut(container: HTMLElement, ms: number = 200): Promise<void> {
        container.style.pointerEvents = "none"
        container.style.transition = `opacity ${ms}ms steps(10, end)`
        container.style.opacity = "0"

        return this.sleep(ms)
    }

    static async fadeIn(container: HTMLElement, ms: number = 200) {
        container.style.pointerEvents = ""
        container.style.transition = `opacity ${ms}ms steps(10, end)`
        container.style.opacity = "1"

        return this.sleep(ms)
    }

    static sleep(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    static ok() {
        const abort = new AbortController()

        return new Promise<void>((resolve) => {
            document.addEventListener(
                "click",
                () => {
                    abort.abort()
                    resolve()
                },
                { signal: abort.signal },
            )

            document.addEventListener(
                "keydown",
                (e) => {
                    if (["KeyZ", "Enter", "Space"].includes(e.code)) {
                        abort.abort()
                        resolve()
                    }
                },
                { signal: abort.signal },
            )
        })
    }

    static key() {
        const abort = new AbortController()

        return new Promise<void>((resolve) => {
            document.addEventListener(
                "click",
                () => {
                    abort.abort()
                    resolve()
                },
                { signal: abort.signal },
            )

            document.addEventListener(
                "keydown",
                (e) => {
                    abort.abort()
                    resolve()
                },
                { signal: abort.signal },
            )
        })
    }
}
