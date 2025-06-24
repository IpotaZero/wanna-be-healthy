class Awaits {
    static #cancels: (() => void)[] = []

    static cancel() {
        Awaits.#cancels.forEach((c) => c())
        Awaits.#cancels = []
    }

    static sleep(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms)
        })
    }

    static async ok() {
        await Promise.race([this.click(), this.keydown()])
        this.cancel()
    }

    static click() {
        return new Promise<void>((resolve) => {
            const removeEventListener = () => {
                document.removeEventListener("click", handler)
            }

            const handler = () => {
                removeEventListener()
                resolve()
            }

            Awaits.#cancels.push(() => {
                removeEventListener()
                resolve()
            })

            document.addEventListener("click", handler)
        })
    }

    static keydown() {
        return new Promise<void>((resolve) => {
            const removeEventListener = () => {
                document.removeEventListener("keydown", handler)
            }

            const validKeys = ["Enter", "Space", "KeyZ"]

            const handler = (e: KeyboardEvent) => {
                if (validKeys.includes(e.code)) {
                    removeEventListener()
                    resolve()
                }
            }

            this.#cancels.push(() => {
                removeEventListener()
                resolve()
            })

            document.addEventListener("keydown", handler)
        })
    }

    static fade(ms: number): Promise<void> {
        return new Promise<void>((resolve) => {
            document.body.style.transition = `opacity ${ms}ms`
            document.body.style.opacity = "0"

            setTimeout(() => {
                document.body.style.opacity = "1"
                resolve()
            }, ms)
        })
    }
}
