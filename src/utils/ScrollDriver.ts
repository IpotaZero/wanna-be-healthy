export class ScrollDriver {
    page: HTMLElement

    constructor(page: HTMLElement) {
        this.page = page
        window.addEventListener("keydown", this.#handler.bind(this))
    }

    #handler(e: KeyboardEvent) {
        if (e.key === "ArrowDown") {
            this.page.scrollBy({ top: this.#getEmHeight(), behavior: "instant" })
            e.preventDefault()
        } else if (e.key === "ArrowUp") {
            this.page.scrollBy({ top: -this.#getEmHeight(), behavior: "instant" })
            e.preventDefault()
        }
    }

    #getEmHeight(): number {
        const em = getComputedStyle(this.page).fontSize
        return parseFloat(em) || 16
    }

    discard() {
        window.removeEventListener("keydown", this.#handler)
    }
}
