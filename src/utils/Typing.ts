export class Typing extends HTMLElement {
    #interval: number

    #text

    constructor() {
        super()

        this.#text = this.innerText
        this.innerText = ""

        this.#interval = setInterval(this.#update.bind(this), 1000 / 30)
    }

    #update() {
        this.innerText += this.#text[this.innerText.length] ?? ""

        if (this.innerText.length >= this.#text.length) {
            clearInterval(this.#interval)
        }
    }
}

customElements.define("i-typing", Typing)
