class Typing extends HTMLElement {
    #intervalId: number | undefined
    #wrapper = document.createElement("div")

    #voice: SE | null = null
    #speed: number | null = null

    #frame = 0
    #currentStyle: CSSStyleDeclaration

    #resolve!: () => void

    isEnd = false
    ready!: Promise<void>

    constructor(html?: string, speed?: number, voice?: SE) {
        super()

        this.#currentStyle = getComputedStyle(this)

        this.#initVoice(voice)
        this.#speed = speed ?? null

        const text = html ?? this.innerHTML
        this.innerHTML = ""
        this.#setupText(text)

        this.#wrapper.className = "typing-wrapper"
        this.appendChild(this.#wrapper)

        this.ready = new Promise((resolve) => (this.#resolve = resolve))
        this.#startInterval()
    }

    #initVoice(voice?: SE) {
        const voiceSrc = this.dataset["voice"]
        if (voiceSrc) {
            const audio = new Audio(voiceSrc)
            audio.volume = 0.5
            this.#voice = audio
        } else if (voice) {
            this.#voice = voice
        }
    }

    #validationText(text: string) {
        return text.replace(/\s{2,}/g, " ").replace(/\n/g, "")
    }

    #setupText(text: string) {
        this.#wrapper.innerHTML = this.#validationText(text)
        this.#processTextNodes(this.#wrapper)
    }

    #processTextNodes(element: Node) {
        Array.from(element.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent) {
                element.replaceChild(new Typing.Char(node.textContent), node)
            } else if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "RUBY") {
                const temp = document.createElement("span")
                temp.innerHTML = (node as HTMLElement).innerHTML
                const rt = temp.querySelector("rt")!
                const ruby = rt.innerText
                rt.remove()
                const text = temp.innerText
                element.replaceChild(new Typing.Ruby(text, ruby), node)
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                this.#processTextNodes(node)
            }
        })
    }

    #emitVoice() {
        if (
            this.#currentStyle.display !== "none" &&
            +this.#currentStyle.opacity > 0.5 &&
            this.#voice &&
            this.#frame++ % 2 === 0
        ) {
            if (this.#voice instanceof Audio) this.#voice.currentTime = 0
            this.#voice.play()
        }
    }

    #updateText() {
        this.#emitVoice()

        const chars = Array.from(this.#wrapper.querySelectorAll(".typing-component")) as Typing.Component[]

        const nextChar = chars.find((char) => !char.isEnd)

        if (!nextChar) {
            this.finish()
            return
        }

        nextChar.update()
    }

    #startInterval() {
        const speed = this.#speed ?? (this.dataset["speed"] ? parseFloat(this.dataset["speed"]) : 24)
        this.#intervalId = window.setInterval(() => this.#updateText(), 1000 / speed)
    }

    finish() {
        if (this.#intervalId) clearInterval(this.#intervalId)
        this.isEnd = true
        this.#resolve?.()

        const chars = Array.from(this.#wrapper.querySelectorAll(".typing-component")) as Typing.Component[]
        chars.forEach((char) => char.finish())
    }

    override remove(): void {
        super.remove()
        if (this.#intervalId) clearInterval(this.#intervalId)
        this.#resolve?.()
        this.isEnd = true
    }

    restart() {
        this.ready = new Promise((resolve) => (this.#resolve = resolve))

        const chars = Array.from(this.#wrapper.querySelectorAll(".typing-component")) as Typing.Component[]
        chars.forEach((char) => char.restart())

        if (this.#intervalId) clearInterval(this.#intervalId)
        this.#startInterval()
        this.isEnd = false
    }
}

customElements.define("i-typing", Typing)

namespace Typing {
    export type Component = HTMLElement & {
        update(): void
        restart(): void
        finish(): void
        isEnd: boolean
    }

    export class Char extends HTMLElement implements Component {
        isEnd = false
        #text: string
        #i = 0

        constructor(text: string) {
            super()
            this.#text = text
            this.className = "typing-component"
        }

        update() {
            this.innerText = this.#text.slice(0, this.#i)
            this.#i++
            this.isEnd = this.#i - 1 === this.#text.length
        }

        restart() {
            this.#i = 0
            this.isEnd = false
            this.update()
        }

        finish() {
            this.isEnd = true
            this.innerText = this.#text
        }
    }

    customElements.define("typing-char", Char)

    export class Ruby extends HTMLElement implements Component {
        isEnd = false
        #text: string
        #ruby: string
        #i = 0

        constructor(text: string, ruby: string) {
            super()
            this.#text = text
            this.#ruby = ruby
            this.className = "typing-component"
        }

        update() {
            this.innerHTML = `<ruby>${this.#text.slice(0, this.#i)}<rt>${this.#ruby.slice(0, this.#i)}</rt></ruby>`
            this.#i++
            this.isEnd = this.#i - 1 === Math.max(this.#text.length, this.#ruby.length)
        }

        restart() {
            this.#i = 0
            this.isEnd = false
            this.update()
        }

        finish() {
            this.isEnd = true
            this.innerHTML = `<ruby>${this.#text}<rt>${this.#ruby}</rt></ruby>`
        }
    }

    customElements.define("typing-ruby", Ruby)
}
