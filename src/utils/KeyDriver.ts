import { SE } from "../SE"

export class KeyDriver {
    readonly #signal = new AbortController()
    #index = 0
    #buttons: HTMLButtonElement[] = []
    #pressingKeys = new Set<string>()
    direction: "horizontal" | "vertical"
    isAvailable = true

    constructor(direction: "horizontal" | "vertical") {
        this.direction = direction
        this.update()

        window.addEventListener("keydown", this.#onKeyDown, { signal: this.#signal.signal })
        window.addEventListener("keyup", this.#onKeyUp, { signal: this.#signal.signal })
    }

    update() {
        this.#buttons = Array.from(document.querySelectorAll("button")).filter(
            this.#isElementVisible,
        ) as HTMLButtonElement[]

        const selectedIndex = this.#buttons.findIndex((b) => b.classList.contains("selected"))
        this.#index = Math.max(selectedIndex, 0)

        this.#setupHover()
        this.#updateButtonClass()
    }

    discard() {
        this.#signal.abort()
    }

    #isElementVisible = (el: Element): boolean => {
        while (el) {
            const style = getComputedStyle(el)
            if (style.display === "none" || style.visibility === "hidden") return false
            el = el.parentElement!
        }
        return true
    }

    #setupHover() {
        this.#buttons.forEach((b, i) => {
            b.onmouseover = () => {
                this.#index = i
                this.#updateButtonClass()
            }
        })
    }

    #onKeyDown = (e: KeyboardEvent) => {
        if (!this.isAvailable || this.#pressingKeys.has(e.code)) return
        this.#pressingKeys.add(e.code)

        SE.key.play()

        const l = this.#buttons.length
        if (l === 0) return

        const next = this.direction === "horizontal" ? "ArrowRight" : "ArrowDown"
        const back = this.direction === "horizontal" ? "ArrowLeft" : "ArrowUp"

        if (e.code === next) {
            this.#index = (this.#index + 1) % l
            this.#updateButtonClass()
        } else if (e.code === back) {
            this.#index = (this.#index + l - 1) % l
            this.#updateButtonClass()
        } else if (["Enter", "Space", "KeyZ"].includes(e.code)) {
            this.#buttons[this.#index].click()
        } else if (["Escape", "Backspace", "KeyX"].includes(e.code)) {
            this.#buttons.find((b) => b.hasAttribute("data-back"))?.click()
        }
    }

    #onKeyUp = (e: KeyboardEvent) => {
        this.#pressingKeys.delete(e.code)
    }

    #updateButtonClass() {
        this.#buttons.forEach((button, i) => {
            button.classList.toggle("selected", i === this.#index)
            if (i === this.#index) button.focus()
        })
    }
}
