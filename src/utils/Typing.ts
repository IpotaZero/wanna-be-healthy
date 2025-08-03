import { Sound } from "../SE"

export class Typing extends HTMLElement {
    #interval: number

    #i = 0
    #text

    #se?: { play(): void }

    onEnd = () => {}

    constructor(text?: string, se?: { play(): void }) {
        super()

        if (this.hasAttribute("se")) {
            this.#se = new Sound(this.getAttribute("se")!)
        } else {
            this.#se = se
        }

        this.#text = text ?? this.innerText
        this.innerText = ""

        this.#interval = setInterval(this.#update.bind(this), 1000 / 30)
    }

    #update() {
        this.innerText += this.#text[this.#i++] ?? ""

        this.#i % 2 === 0 && this.#se?.play()

        if (this.#i >= this.#text.length) {
            this.onEnd()
            clearInterval(this.#interval)
        }
    }
}

customElements.define("i-typing", Typing)
