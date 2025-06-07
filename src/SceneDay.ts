class SceneDay extends Scene {
    #awakeness = 100
    #mode: "main" | "game-over" = "game-over"

    #musicData
    #startTime = NaN

    #goalElement!: HTMLElement

    constructor() {
        super()
        this.#musicData = this.#createMusicData()
        this.#start()
    }

    loop(elapsedTime: number): void {
        if (this.#mode !== "main") return

        this.#musicData = this.#musicData.filter(this.#processMusicData.bind(this))

        // update awakeness
        this.#awakeness -= elapsedTime / 120
        DOM.awakeness.style.width = `${this.#awakeness}%`

        if (this.#musicData.length === 0) {
            this.#study()
        } else if (this.#awakeness < 0) {
            this.#sleep()
        }

        Input.update()
    }

    #processMusicData({ element, time }: { element: HTMLElement; time: number }) {
        const elapsed = performance.now() - this.#startTime

        const progress = (elapsed - time * 1000) / 15
        element.style.right = `${progress}%`

        const isHit =
            mouse.clicked.has("left") ||
            keyboard.pushed.has("KeyZ") ||
            keyboard.pushed.has("Enter") ||
            keyboard.pushed.has("Space")

        if (isHit) {
            const gap = Math.abs(100 - progress)

            if (2 <= gap && gap <= 4) {
                this.#goalElement.dataset.score = ""
                requestAnimationFrame(() => {
                    this.#goalElement.dataset.score = "good"
                })

                element.remove()
                return false
            }

            if (gap <= 2) {
                this.#awakeness = Math.min(100, this.#awakeness + 5)

                this.#goalElement.dataset.score = ""
                requestAnimationFrame(() => {
                    this.#goalElement.dataset.score = "great"
                })

                element.remove()
                return false
            }
        }

        if (progress > 105) {
            this.#awakeness = Math.max(0, this.#awakeness - 5)

            this.#goalElement.dataset.score = ""
            requestAnimationFrame(() => {
                this.#goalElement.dataset.score = "bad"
            })

            element.remove()
            return false
        }

        return true
    }

    async #start() {
        const loadBGM = BGM.fetch({ src: "assets/sounds/stage-0.mp3", loop: false })

        const text = new Itext(DOM.container, "ひる", {
            css: {
                fontSize: "16vh",
            },
        })

        await Awaits.sleep(2000)
        await Awaits.fade(1000)

        text.remove()

        this.#initDOM()

        await loadBGM
        await BGM.play()

        this.#startTime = performance.now()

        this.#mode = "main"
    }

    #createMusicData() {
        return musicDataList[0].notes.map((tick) => ({
            time: (tick / 480) * (60 / musicDataList[0].bpm) - 1.2755,
            element: document.createElement("span"),
        }))
    }

    #initDOM() {
        DOM.setParameter()
        DOM.awakeness.style.width = "100%"

        const layer = new Ielement(DOM.container, {
            css: {
                position: "absolute",
                right: "0",
                width: "85%",
                height: "24vh",
                // border: "#111 solid 0.4vh",
            },
        })

        this.#goalElement = document.createElement("span")
        this.#goalElement.id = "goal"
        this.#goalElement.className = "note"
        this.#goalElement.style.right = "100%"

        layer.appendChild(this.#goalElement)

        this.#musicData.forEach(({ element }) => {
            element.className = "note"
            element.style.right = "200%"
            layer.appendChild(element)
        })

        new Itext(DOM.container, "よき タイミングで クリック して いしきを たもて!", {
            css: {
                top: "20vh",
            },
        })
    }

    async #study() {
        this.#mode = "game-over"

        await Awaits.sleep(1000)

        const text = new Itext(DOM.container, "いねむりせず べんきょう した......!", {
            css: {
                bottom: "8vh",
            },
        })

        await text.ready
        text.classList.add("blink-triangle")

        await Awaits.ok()

        await Awaits.fade(1000)
        currentScene = new SceneNight(false)
    }

    async #sleep() {
        BGM.fadeOut(1)

        this.#mode = "game-over"

        await Awaits.sleep(1000)

        const text = new Itext(DOM.container, "いねむり して しまった......", {
            css: {
                bottom: "8vh",
            },
        })

        await text.ready
        text.classList.add("blink-triangle")

        await Awaits.ok()

        await Awaits.fade(1000)
        currentScene = new SceneNight(true)
    }
}

const musicDataList = [
    {
        bpm: 125,
        notes: [
            3840 + 0,
            3840 + 480,
            3840 + 960,
            3840 + 1200,
            3840 + 1680,
            //
            5760 + 240,
            5760 + 480,
            5760 + 960,
            5760 + 1440,
            //
            3840 * 2 + 3840 + 0,
            3840 * 2 + 3840 + 480,
            3840 * 2 + 3840 + 720,
            3840 * 2 + 3840 + 960,
            3840 * 2 + 3840 + 1200,
            3840 * 2 + 3840 + 1440,
            3840 * 2 + 3840 + 1680,
            //
            3840 * 2 + 5760 + 240,
            3840 * 2 + 5760 + 480,
            3840 * 2 + 5760 + 600,
            3840 * 2 + 5760 + 720,
            3840 * 2 + 5760 + 960,
            3840 * 2 + 5760 + 1200,
            3840 * 2 + 5760 + 1440,
        ],
    },
]
