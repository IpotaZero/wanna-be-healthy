class Itext extends Ielement {
    #interval!: ReturnType<typeof setTimeout>
    #originalHTML!: string
    #wrapper = document.createElement("div")

    #voice: HTMLAudioElement | null = null
    #frame = 0

    isEnd = false
    ready!: Promise<void>

    #resolve!: Function

    constructor(
        container: HTMLElement,
        text: string,
        options: {
            css?: NestedCSS
            className?: string
            speed?: number
            typing?: boolean
            voice?: HTMLAudioElement
        } = {},
    ) {
        super(container, options)

        this.#voice = options.voice ?? null

        this.#wrapper.className = "i-text-wrapper"
        this.appendChild(this.#wrapper)

        this.#setupText(String(text), options.typing ?? true)

        this.ready = new Promise((resolve) => {
            this.#resolve = resolve
        })

        // アニメーション開始
        this.#interval = setInterval(() => {
            this.#updateText()
        }, 1000 / (options.speed ?? 24))
    }

    #validationText(text: string) {
        return text.replace(/\s{2,}/g, " ").replace(/\n/g, "")
    }

    #setupText(text: string, typing: boolean) {
        if (!typing) {
            this.innerHTML = text
            return
        }

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
                    element.replaceChild(new Itext.Char(text), node)
                }
            } else if ((node as HTMLElement).tagName === "RUBY") {
                const temp = document.createElement("span")
                temp.innerHTML = (node as HTMLElement).innerHTML

                const rt = temp.querySelector("rt")!

                const ruby = rt.innerText

                rt.remove()

                const text = temp.innerText

                element.replaceChild(new Itext.Ruby(text, ruby), node)
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // 要素ノードの場合は、その子要素も処理
                this.#processTextNodes(node)
            }
        })
    }

    #updateText() {
        // ボイス再生
        this.#voice && this.#frame++ % 2 == 0 && this.#voice.play()

        const spans = ([...this.#wrapper.querySelectorAll(".i-text-component")] as (Itext.Char | Itext.Ruby)[]).filter(
            (ichar) => !ichar.isEnd,
        )

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
        this.#wrapper.innerHTML = this.#originalHTML
        this.isEnd = true
        this.#resolve()
    }

    override remove(): void {
        super.remove()
        clearInterval(this.#interval)
        this.#resolve()
        this.isEnd = true
    }
}

customElements.define("i-text", Itext)

namespace Itext {
    export class Char extends HTMLElement {
        isEnd = false

        #text: string
        #i = 0

        constructor(text: string) {
            super()
            this.#text = text

            this.className = "i-text-component"
        }

        update() {
            this.innerText = this.#text.slice(0, this.#i)

            this.#i++

            this.isEnd = this.#text.length === this.#i - 1
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

            this.className = "i-text-component"
        }

        update() {
            this.innerHTML = `<ruby>${this.#text.slice(0, this.#i)}<rt>${this.#ruby.slice(0, this.#i)}</rt></ruby>`

            this.#i++

            if (Math.max(this.#text.length, this.#ruby.length) === this.#i - 1) {
                this.isEnd = true
            }
        }
    }

    customElements.define("i-ruby", Ruby)
}
