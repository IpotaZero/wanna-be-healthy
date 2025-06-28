class Typing extends HTMLElement {
    #interval!: ReturnType<typeof setTimeout>
    #originalHTML!: string
    #wrapper = document.createElement("div")

    #voice: SE | null = null
    #frame = 0

    isEnd = false
    ready!: Promise<void>

    #currentStyle: CSSStyleDeclaration = getComputedStyle(this)

    #resolve!: Function

    constructor(html?: string, speed?: number, voice?: SE) {
        super()

        if (this.dataset["voice"]) {
            const audio = new Audio(this.dataset["voice"])
            audio.volume = 0.5

            this.#voice = audio
        } else if (voice) {
            this.#voice = voice
        }

        const text = html ?? this.innerHTML
        this.innerHTML = ""

        this.#wrapper.className = "typing-wrapper"
        this.appendChild(this.#wrapper)

        this.#setupText(text)

        this.ready = new Promise((resolve) => {
            this.#resolve = resolve
        })

        const s = speed ?? (this.dataset["speed"] ? parseFloat(this.dataset["speed"]) : 24)

        // アニメーション開始
        this.#interval = setInterval(() => {
            this.#updateText()
        }, 1000 / s)
    }

    #validationText(text: string) {
        return text.replace(/\s{2,}/g, " ").replace(/\n/g, "")
    }

    #setupText(text: string) {
        this.#originalHTML = this.#validationText(text)

        this.#wrapper.innerHTML = this.#originalHTML
        this.#processTextNodes(this.#wrapper)
    }

    // テキストノードを再帰的に処理
    #processTextNodes(element: Node) {
        const childNodes = [...element.childNodes]

        childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent
                if (text) {
                    element.replaceChild(new Typing.Char(text), node)
                }
            } else if ((node as HTMLElement).tagName === "RUBY") {
                const temp = document.createElement("span")
                temp.innerHTML = (node as HTMLElement).innerHTML

                const rt = temp.querySelector("rt")!

                const ruby = rt.innerText

                rt.remove()

                const text = temp.innerText

                element.replaceChild(new Typing.Ruby(text, ruby), node)
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 要素ノードの場合は、その子要素も処理
                this.#processTextNodes(node)
            }
        })
    }

    #emitVoice() {
        // ボイス再生
        if (this.#currentStyle.display !== "none" && +this.#currentStyle.opacity > 0.5) {
            if (this.#voice && this.#frame++ % 2 == 0) {
                if (this.#voice instanceof Audio) {
                    this.#voice.currentTime = 0
                }

                this.#voice.play()
            }
        }
    }

    #updateText() {
        this.#emitVoice()

        const spans = (
            [...this.#wrapper.querySelectorAll(".typing-component")] as (Typing.Char | Typing.Ruby)[]
        ).filter((char) => !char.isEnd)

        if (spans.length === 0) {
            this.finish()
            return
        }

        const mainSpan = spans[0]

        mainSpan && mainSpan.update()
    }

    // アニメーションを即座に完了
    finish() {
        clearInterval(this.#interval)
        // this.#wrapper.innerHTML = this.#originalHTML
        this.isEnd = true
        this.#resolve()

        const chars = [...this.#wrapper.querySelectorAll(".typing-component")] as (Typing.Char | Typing.Ruby)[]
        chars.forEach((char) => {
            if (char instanceof Typing.Char) {
                char.finish()
            } else if (char instanceof Typing.Ruby) {
                char.finish()
            }
        })
    }

    override remove(): void {
        super.remove()
        clearInterval(this.#interval)
        this.#resolve()
        this.isEnd = true
    }

    restart() {
        // this.#wrapper.innerHTML = this.#originalHTML
        // this.#processTextNodes(this.#wrapper)

        this.ready = new Promise((resolve) => {
            this.#resolve = resolve
        })

        const chars = [...this.#wrapper.querySelectorAll(".typing-component")] as (Typing.Char | Typing.Ruby)[]
        chars.forEach((char) => char.restart())

        this.isEnd = false

        clearInterval(this.#interval)

        const speed = this.dataset["speed"] ? parseFloat(this.dataset["speed"]) : 24
        this.#interval = setInterval(() => {
            this.#updateText()
        }, 1000 / speed)
    }
}

customElements.define("i-typing", Typing)

namespace Typing {
    export class Char extends HTMLElement {
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

            this.isEnd = this.#text.length === this.#i - 1
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

    customElements.define("i-char", Char)

    export class Ruby extends HTMLElement {
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

            if (Math.max(this.#text.length, this.#ruby.length) === this.#i - 1) {
                this.isEnd = true
            }
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

    customElements.define("i-ruby", Ruby)
}
