export class KeyDriver {
    readonly #signal = new AbortController()
    #index = 0
    #buttons: HTMLButtonElement[] = []

    direction: "horizontal" | "vertical"

    constructor(direction: "horizontal" | "vertical") {
        this.direction = direction
        this.update()

        window.addEventListener("keydown", this.#handler.bind(this), { signal: this.#signal.signal })
    }

    update() {
        this.#buttons = [...document.querySelectorAll("button")].filter((b) => this.#isElementVisible(b))

        const selectedIndex = this.#buttons.findIndex((b) => b.classList.contains("selected"))
        this.#index = Math.max(selectedIndex, 0)

        this.#setupHover()
        this.#updateButtonClass()
    }

    discard() {
        this.#signal.abort()
    }

    #isElementVisible(el: Element): boolean {
        while (el) {
            const style = getComputedStyle(el)
            if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
                return false
            }

            if (!el.parentElement) return true

            el = el.parentElement
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

    #handler(e: KeyboardEvent) {
        const l = this.#buttons.length

        const next = this.direction === "horizontal" ? "ArrowRight" : "ArrowDown"
        const back = this.direction === "horizontal" ? "ArrowLeft" : "ArrowUp"

        if (e.code === next) {
            this.#index = (this.#index + 1) % l
            this.#updateButtonClass()
        }

        if (e.code === back) {
            this.#index = (this.#index + l - 1) % l
            this.#updateButtonClass()
        }

        if (["Enter", "Space", "KeyZ"].includes(e.code)) {
            this.#buttons[this.#index].click()
        }

        if (["Escape", "Backspace", "KeyX"].includes(e.code)) {
            this.#buttons.find((b) => b.hasAttribute("data-back"))?.click()
        }
    }

    #updateButtonClass() {
        this.#buttons.forEach((button, i) => {
            button.classList.toggle("selected", i === this.#index)
            if (i === this.#index) button.focus()
        })
    }
}
