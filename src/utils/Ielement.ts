class Ielement extends HTMLElement {
    static #idCount = 0
    styleElement = document.createElement("style")

    // キャメルケースをケバブケースに変換する関数
    #toKebabCase(str: string) {
        let s = str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()

        if (s.startsWith("webkit")) s = "-" + s

        return s
    }

    constructor(
        container: HTMLElement,
        options: {
            css?: NestedCSS
            className?: string
        } = {},
    ) {
        super()

        this.#setCSS(options.css)

        if (options.className) this.className += " " + options.className

        container.appendChild(this)
    }

    #setCSS(css?: NestedCSS) {
        // ユニークなクラス名を生成
        const uniqueClass = `i-element-${Ielement.#idCount++}`
        this.classList.add(uniqueClass)

        if (css) {
            let style = `.${uniqueClass} {\n`
            style += this.#createStyleString(1, css)
            this.styleElement.textContent = style + "}"
            document.head.appendChild(this.styleElement)
        }
    }

    #createStyleString(depth: number, css: NestedCSS) {
        let style = ""

        Object.entries(css).forEach(([property, value], i, list) => {
            if (typeof value == "string") {
                style += " ".repeat(4 * depth) + `${this.#toKebabCase(property)}: ${value};`
                if (i != list.length - 1) style += "\n"
                return
            }

            style +=
                "\n" +
                " ".repeat(4 * depth) +
                `&${property} {\n${this.#createStyleString(depth + 1, value as NestedCSS)}` +
                "\t".repeat(depth) +
                `}`
        })

        return style + "\n"
    }

    remove(): void {
        ;[...this.children].forEach((c) => c.remove())
        super.remove()
        this.styleElement.remove()
    }

    fadeOut(ms: number) {
        this.addEventListener("transitionend", () => {
            this.remove()
        })

        this.style.transition = `opacity ${ms}ms`
        this.style.opacity = "0"
    }
}

customElements.define("i-element", Ielement)

class Iimage extends Ielement {
    ready: Promise<void>

    constructor(container: HTMLElement, path: string, options: { css?: NestedCSS; className?: string } = {}) {
        super(container, options)

        this.ready = new Promise((resolve) => {
            const img = new Image()
            img.src = path
            img.onload = () => {
                this.appendChild(img)
                resolve()
            }
        })

        container.appendChild(this)
    }
}

customElements.define("i-image", Iimage)
