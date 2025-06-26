interface SE {
    play: () => void
}

class Itext extends Ielement {
    isEnd = false
    ready!: Promise<void>

    #typing: Typing

    constructor(
        container: HTMLElement,
        text: string,
        options: {
            css?: NestedCSS
            className?: string
            speed?: number
            voice?: string
        } = {},
    ) {
        if (!container) {
            console.error("Container is not defined for Itext")
        }

        super(container, options)

        // console.log("Ielement created", this, container)

        this.#typing = new Typing(text, options.speed, options.voice)

        this.appendChild(this.#typing)

        this.ready = this.#typing.ready
        this.isEnd = this.#typing.isEnd
    }

    // アニメーションを即座に完了
    finish() {
        this.#typing.finish()
    }

    remove(): void {
        this.#typing.remove()
        super.remove()
    }
}

customElements.define("i-text", Itext)
