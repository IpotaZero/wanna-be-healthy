export class Pages {
    #history: string[] = []
    #container: HTMLElement
    #pages: Element[]

    #handlers: { [k: string]: () => void } = {}

    constructor(container: HTMLElement, firstPageSelector: string, html: string) {
        this.#container = container
        this.#container.innerHTML = html

        this.#pages = [...container.querySelectorAll(".page")]

        this.#setupFirstPage(firstPageSelector)
        this.#setupBackButtons()
        this.#setupLinkButtons()
    }

    on(selector: string, handler: () => void) {
        this.#handlers[selector] = handler
    }

    #setupFirstPage(firstPageSelector: string) {
        const currentPageSegments = firstPageSelector.split(" ")

        this.#history.push(...currentPageSegments.slice(0, -1))
        this.#history.push(currentPageSegments.at(-1)!)
        this.#changePage(currentPageSegments.at(-1)!, true)
    }

    #setupLinkButtons() {
        const linkButtons = this.#container.querySelectorAll("[data-link]")

        linkButtons.forEach((linkButton) => {
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
        const backButtons = this.#container.querySelectorAll("[data-back]")

        backButtons.forEach((backButton) => {
            const immediately = backButton.hasAttribute("data-immediately")
            const backAttr = backButton.getAttribute("data-back")!

            const backDepth = Number.parseInt(backAttr)

            if (Number.isNaN(backDepth) || backDepth <= 0) {
                console.warn("正しくないdata-back！", backButton)
                return
            }

            backButton.addEventListener("click", () => {
                if (this.#history.length <= backDepth) {
                    console.warn("戻る履歴がない", backButton)
                    return
                }

                let previousPageId = ""

                for (let i = 0; i < backDepth; i++) {
                    this.#history.pop()
                    previousPageId = this.#history[this.#history.length - 1]
                }

                this.#changePage(previousPageId, immediately)
            })
        })
    }

    async #changePage(pageSelector: string, immediately: boolean) {
        const targetPage = this.#container.querySelector(pageSelector)

        if (!targetPage) {
            throw new Error(`そんなpageは無い: ${pageSelector}`)
        }

        if (!immediately) {
            await new Promise((resolve) => {
                this.#container.style.transition = "opacity 200ms"
                this.#container.style.opacity = "0"
                this.#container.style.pointerEvents = "none"

                setTimeout(resolve, 200)
            })

            this.#container.style.opacity = "1"
            this.#container.style.pointerEvents = ""
        }

        this.#pages.forEach((page) => {
            page.classList.toggle("hidden", page !== targetPage)
        })

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                Object.entries(this.#handlers).forEach(([key, value]) => {
                    if (pageSelector.match(key)) {
                        value()
                    }
                })
            })
        })
    }
}
