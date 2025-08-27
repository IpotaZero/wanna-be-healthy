import { Sound } from "../SE"

export class ETyping extends HTMLElement {
    #interval!: number

    #i = 0
    #text

    #se?: { play(): void }

    onEnd = () => {}

    #resolve!: () => void

    end!: Promise<void>

    isEnd = false

    constructor(text?: string, se?: { play(): void }) {
        super()

        if (this.hasAttribute("se")) {
            this.#se = new Sound(this.getAttribute("se")!)
        } else {
            this.#se = se
        }

        this.#text = text ?? this.innerText
        this.innerText = ""

        this.reset()
    }

    reset() {
        this.#i = 0
        this.innerText = ""
        this.#interval = setInterval(this.#update.bind(this), 1000 / 30)

        this.isEnd = false

        this.end = new Promise((resolve) => {
            this.#resolve = resolve
        })
    }

    finish() {
        this.textContent = this.#text
        this.#onEnd()
    }

    #onEnd() {
        this.onEnd()
        this.isEnd = true
        this.#resolve()
        clearInterval(this.#interval)
    }

    #update() {
        this.textContent += this.#text[this.#i++] ?? ""

        this.#i % 2 === 0 && this.#se?.play()

        if (this.#i >= this.#text.length) {
            this.#onEnd()
        }
    }
}

customElements.define("i-typing", ETyping)
