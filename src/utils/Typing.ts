export class Typing extends HTMLElement {
    #interval: number

    #i = 0
    #text

    onEnd = () => {}

    constructor() {
        super()

        this.#text = this.innerText
        this.innerText = ""

        this.#interval = setInterval(this.#update.bind(this), 1000 / 30)
    }

    #update() {
        this.innerText += this.#text[this.#i++] ?? ""

        if (this.#i >= this.#text.length) {
            this.onEnd()
            clearInterval(this.#interval)
        }
    }
}

customElements.define("i-typing", Typing)
