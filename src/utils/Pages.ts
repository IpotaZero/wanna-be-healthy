type Handler = () => void

export class Pages {
    #history: string[] = []
    #container: HTMLElement
    #pages: Element[]
    #handlers: Record<string, Handler> = {}

    currentPage!: HTMLElement

    readonly ready: Promise<void>

    before: Handler = () => {}
    after: Handler = () => {}

    constructor(container: HTMLElement, firstPageSelector: string, html: string) {
        this.#container = container
        this.#container.innerHTML = html
        this.#pages = Array.from(container.querySelectorAll(".page"))
        this.ready = this.#init(firstPageSelector)
    }

    on(selector: string, handler: Handler) {
        this.#handlers[selector] = handler
    }

    async #init(firstPageSelector: string) {
        await this.#setupFirstPage(firstPageSelector)
        this.#setupBackButtons()
        this.#setupLinkButtons()
    }

    async #setupFirstPage(firstPageSelector: string) {
        const segments = firstPageSelector.split(" ")
        this.#history.push(...segments.slice(0, -1), segments.at(-1)!)
        await this.#changePage(segments.at(-1)!, true)
    }

    #setupLinkButtons() {
        this.#container.querySelectorAll<HTMLElement>("[data-link]").forEach((linkButton) => {
            const immediately = linkButton.hasAttribute("data-immediately")
            const sever = linkButton.hasAttribute("data-sever")
            const targetPageId = linkButton.getAttribute("data-link")!
            linkButton.addEventListener("click", () => {
                if (sever) this.#history = []
                this.#history.push(targetPageId)
                this.#changePage(targetPageId, immediately)
            })
        })
    }

    #setupBackButtons() {
        this.#container.querySelectorAll<HTMLElement>("[data-back]").forEach((backButton) => {
            const immediately = backButton.hasAttribute("data-immediately")
            const backDepth = Number.parseInt(backButton.getAttribute("data-back")!)
            if (isNaN(backDepth) || backDepth <= 0) {
                console.warn("正しくないdata-back！", backButton)
                return
            }
            backButton.addEventListener("click", () => {
                if (this.#history.length <= backDepth) {
                    console.warn("戻る履歴がない", backButton)
                    return
                }
                this.#history.splice(-backDepth)
                const previousPageId = this.#history[this.#history.length - 1]
                this.#changePage(previousPageId, immediately)
            })
        })
    }

    async #changePage(pageSelector: string, immediately: boolean) {
        const targetPage = this.#container.querySelector(pageSelector)

        if (!targetPage) throw new Error(`そんなpageは無い: ${pageSelector}`)

        this.#disableButtons()

        this.before()

        if (!immediately) {
            await this.#fadeOut()
        }

        this.#pages.forEach((page) => page.classList.toggle("hidden", page !== targetPage))

        this.currentPage = targetPage as HTMLElement

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                Object.entries(this.#handlers).forEach(([key, handler]) => {
                    if (pageSelector.match(key)) handler()
                })

                this.#ableButtons()
                this.after()
            })
        })
    }

    #disableButtons() {
        this.#container.querySelectorAll("button").forEach((b) => {
            b.disabled = true
        })
    }

    #ableButtons() {
        this.#container.querySelectorAll("button").forEach((b) => {
            b.disabled = false
        })
    }

    #fadeOut(): Promise<void> {
        return new Promise((resolve) => {
            this.#container.style.transition = "opacity 200ms"
            this.#container.style.opacity = "0"
            this.#container.style.pointerEvents = "none"

            setTimeout(() => {
                this.#container.style.opacity = "1"
                this.#container.style.pointerEvents = ""
                resolve()
            }, 200)
        })
    }
}
