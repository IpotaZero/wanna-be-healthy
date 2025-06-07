class SceneNight extends Scene {
    #mode: "pause" | "stg" = "pause"

    ctx!: CanvasRenderingContext2D

    #awakeness = 100
    #time = 150
    #timeElement!: HTMLElement

    #enemy: Enemy

    #img = new Image()

    player = new Shooter()
    bullets: Bullet[] = []

    constructor(slept: boolean) {
        super()

        this.#img.src = ["assets/smartphone.png", "assets/energy.png", "assets/gamepad.png"][state.day]

        this.#enemy = new [Enemy0, Enemy1, Enemy2, Enemy3][state.day](this)

        this.#start(slept)
    }

    #initDOM(slept: boolean) {
        DOM.setParameter()

        this.#timeElement = new Ielement(DOM.container, {
            className: "time",
        })

        this.#awakeness = slept ? 100 : 50
        DOM.awakeness.style.width = this.#awakeness + "%"

        const cvs = document.createElement("canvas")
        cvs.width = 720
        cvs.height = 720
        cvs.className = "canvas"
        DOM.container.appendChild(cvs)

        this.ctx = cvs.getContext("2d")!
        this.ctx.imageSmoothingEnabled = false
    }

    #setupButton() {
        const text = new Itext(DOM.container, "みんざいを つかう?", {
            css: {
                color: "white",
            },
        })

        const button0 = new Itext(DOM.container, "つかう", {
            css: {
                padding: "1vh",
                top: "20vh",
                width: "24vh",
                backgroundColor: "#ccc",
                justifyContent: "center",

                cursor: "pointer",

                ":hover": {
                    boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.35)",
                },
            },
        })

        const button1 = new Itext(DOM.container, "つかわない", {
            css: {
                padding: "1vh",
                top: "32vh",
                width: "24vh",
                backgroundColor: "#ccc",
                justifyContent: "center",

                cursor: "pointer",

                ":hover": {
                    boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.35)",
                },
            },
        })

        let clicked = false

        let wannaMedicine = 0

        button0.onclick = async () => {
            if (state.usedSleepingMedicine) {
                wannaMedicine++
                button0.style.backgroundColor = `rgb(${255 * (1 - wannaMedicine / 10 + 0.5)},0,0)`

                document.querySelector(".never")?.remove()

                new Itext(DOM.container, "もう つかっては いけない", {
                    css: {
                        bottom: "16vh",
                        color: "white",
                    },
                    className: "never",
                })

                if (wannaMedicine === 10) {
                    state.OD = true

                    const black = new Ielement(document.body, {
                        css: {
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "black",
                        },
                    })

                    await Awaits.sleep(2000)
                    await Awaits.fade(1000)

                    black.remove()

                    DOM.container.style.transform = "rotate(3deg)"
                    currentScene = new SceneDay()
                }

                return
            }

            if (clicked) return
            clicked = true

            state.usedSleepingMedicine = true

            await Awaits.fade(1000)
            currentScene = new SceneDay()
        }

        button1.onclick = async () => {
            if (clicked) return
            clicked = true

            await Awaits.fade(1000)

            text.remove()
            button0.remove()
            button1.remove()

            new Itext(DOM.container, "しげきを さけて ねむりに つけ!", {
                css: {
                    top: "8vh",
                },
            })

            this.#mode = "stg"
        }
    }

    async #start(slept: boolean) {
        const text = new Itext(DOM.container, "よる", {
            css: {
                fontSize: "16vh",
            },
        })

        await Awaits.sleep(1000)
        await Awaits.fade(1000)

        text.remove()

        this.#initDOM(slept)

        if (state.OD) {
            this.#mode = "stg"
        } else {
            this.#setupButton()
        }
    }

    loop(elapsedTime: number) {
        if (this.#mode === "pause") {
        } else if (this.#mode === "stg") {
            this.#time -= elapsedTime / 200
            this.#timeElement.style.width = `${this.#time / 6}%`

            this.#awakeness -= elapsedTime / 200
            DOM.awakeness.style.width = `${this.#awakeness}%`

            this.#enemy.update()

            this.player.update(elapsedTime)

            this.bullets = this.bullets.filter((b) => {
                b.update(elapsedTime)

                const isHit = b.r + this.player.r >= b.p.sub(this.player.p).magnitude()
                if (isHit) {
                    b.life = 0
                    this.#awakeness = Math.min(100, this.#awakeness + 10)
                }

                return b.life > 0
            })

            if (this.#awakeness < 0) {
                this.#sleep()
            } else if (this.#time < 0) {
                this.#allNight()
            }

            this.#render()

            Input.update()
        }
    }

    #render() {
        this.ctx.clearRect(0, 0, 720, 720)

        this.ctx.strokeStyle = "white"
        this.ctx.lineWidth = 14
        this.ctx.strokeRect(180, 180, 360, 360)

        this.bullets.forEach((b) => b.render(this.ctx))

        this.#enemy.render(this.ctx)

        this.player.render(this.ctx)
    }

    async #sleep() {
        this.#mode = "pause"

        state.dark.push(0)

        const text = new Itext(DOM.container, "ねむれた......", {
            css: {
                bottom: "16vh",
                color: "white",
                backgroundColor: "#111c",
            },
        })

        new Iimage(DOM.container, "assets/bed.png", {
            css: {
                height: "20vh",
                backgroundColor: "#111c",
            },
        })

        text.ready.then(() => {
            text.classList.add("blink-triangle")
        })

        state.day++

        await Awaits.ok()

        await Awaits.fade(1000)
        currentScene = new SceneDay()
    }

    async #allNight() {
        this.#mode = "pause"

        state.dark.push(1)

        const p = state.dark.reduce((a, b) => a + b, 0) * 25

        DOM.dark.style.width = `${p}%`

        const text = new Itext(DOM.container, "てつや して しまった......", {
            css: {
                bottom: "16vh",
                color: "white",
                backgroundColor: "#111c",
            },
        })

        text.ready.then(() => {
            text.classList.add("blink-triangle")
        })

        state.day++

        await Awaits.ok()

        await Awaits.fade(1000)
        currentScene = new SceneDay()
    }
}

class Shooter {
    #image = new Image()

    readonly #SPEED = 3

    p = new Vec(360, 360)
    readonly r = 8

    constructor() {
        this.#image.src = "assets/pill.png"
    }

    update(elapsedTime: number) {
        if (keyboard.pressed.has("ArrowRight")) {
            this.p.x += this.#SPEED * (elapsedTime * (60 / 1000))
        } else if (keyboard.pressed.has("ArrowLeft")) {
            this.p.x -= this.#SPEED * (elapsedTime * (60 / 1000))
        }

        if (keyboard.pressed.has("ArrowUp")) {
            this.p.y -= this.#SPEED * (elapsedTime * (60 / 1000))
        } else if (keyboard.pressed.has("ArrowDown")) {
            this.p.y += this.#SPEED * (elapsedTime * (60 / 1000))
        }

        const gap = 7 + this.r

        if (this.p.x < 180 + gap) {
            this.p.x = 180 + gap
        } else if (this.p.x > 540 - gap) {
            this.p.x = 540 - gap
        }
        if (this.p.y < 180 + gap) {
            this.p.y = 180 + gap
        } else if (this.p.y > 540 - gap) {
            this.p.y = 540 - gap
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.fillStyle = "cyan"
        ctx.arc(this.p.x, this.p.y, this.r + 4, 0, Math.PI * 2)
        ctx.fill()

        // ctx.drawImage(this.#image, this.p.x - 32, this.p.y - 32, 64, 64)
    }
}

class Bullet {
    p: Vec
    #v: Vec
    r: number
    life = 1

    constructor(p: Vec, v: Vec) {
        this.p = p
        this.#v = v
        this.r = 12
    }

    update(elapsedTime: number) {
        this.p = this.p.add(this.#v.scale(elapsedTime * (60 / 1000)))
    }

    render(ctx: CanvasRenderingContext2D) {
        // ctx.drawImage(this.#image, 0, 0, 64, 64)

        ctx.beginPath()
        ctx.fillStyle = "white"
        ctx.arc(this.p.x, this.p.y, this.r, 0, Math.PI * 2)
        ctx.fill()
    }
}

class Enemy {
    protected p: Vec
    protected gs: Generator[] = []
    protected img = new Image()

    constructor(scene: SceneNight) {
        this.p = new Vec(360, 64)

        const generators = ["G", "H", "I", "J"] as const

        for (const generatorName of generators) {
            if (generatorName in this) {
                if (typeof (this as any)[generatorName] === "function") {
                    this.gs.push(((this as any)[generatorName] as GeneratorFunction)(scene))
                }
            }
        }
    }

    update() {
        this.gs = this.gs.filter((g) => !g.next().done)
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.p.x - 72, this.p.y - 72, 144, 144)
    }
}

class Enemy0 extends Enemy {
    constructor(scene: SceneNight) {
        super(scene)
        this.img.src = "assets/smartphone.png"
    }

    *G(scene: SceneNight) {
        yield* Yields.wait(500)

        while (1) {
            const v = scene.player.p.sub(this.p).normalize().scale(8)
            scene.bullets.push(
                new Bullet(this.p, v),
                new Bullet(this.p, v.rotate(Math.PI / 12)),
                new Bullet(this.p, v.rotate(-Math.PI / 12)),
            )
            yield* Yields.wait(1000)
        }
    }

    *H() {
        while (1) {
            const timer = new Yields.Timer(3000, (t) => t)

            while (timer.progress < 1) {
                this.p.x = Math.sin(timer.progress * Math.PI * 2) * 50 + 360
                yield
            }
        }
    }
}

class Enemy1 extends Enemy {
    constructor(scene: SceneNight) {
        super(scene)
        this.img.src = "assets/energy.png"
    }

    *G(scene: SceneNight) {
        yield* Yields.wait(500)

        while (1) {
            const v = scene.player.p
                .sub(this.p)
                .normalize()
                .scale(2 * Math.random() + 4)

            scene.bullets.push(
                new Bullet(this.p, v),
                new Bullet(this.p, v.rotate(Math.PI / 13)),
                new Bullet(this.p, v.rotate(-Math.PI / 13)),
            )

            yield* Yields.wait(500)

            const v2 = scene.player.p
                .sub(this.p)
                .normalize()
                .scale(2 * Math.random() + 4)

            scene.bullets.push(
                new Bullet(this.p, v2.rotate(Math.PI / 12)),
                new Bullet(this.p, v2.rotate(-Math.PI / 12)),
            )

            yield* Yields.wait(500)
        }
    }

    *H() {
        while (1) {
            const timer = new Yields.Timer(6000, (t) => t)

            while (timer.progress < 1) {
                this.p = Vec.arg(timer.progress * Math.PI * 2)
                    .scale(250)
                    .add(new Vec(360, 360))
                yield
            }
        }
    }
}

class Enemy2 extends Enemy {
    constructor(scene: SceneNight) {
        super(scene)
        this.img.src = "assets/gamepad.png"
    }

    *G(scene: SceneNight) {
        yield* Yields.wait(500)

        while (1) {
            const num = ~~(13 * Math.random() + 10)

            const v = scene.player.p.sub(this.p).normalize().scale(8)

            for (let i = 0; i < num; i++) {
                scene.bullets.push(
                    new Bullet(this.p, v.rotate(Math.PI * 2 * (i / num))),
                    new Bullet(this.p, v.rotate(-Math.PI * 2 * (i / num))),
                )
                yield* Yields.wait(10)
            }
        }
    }

    *H() {
        while (1) {
            const timer = new Yields.Timer(6000, (t) => t)

            while (timer.progress < 1) {
                this.p = Vec.arg(timer.progress * Math.PI * 2)
                    .scale(250)
                    .add(new Vec(360, 360))
                yield
            }
        }
    }
}

class Enemy3 extends Enemy {
    constructor(scene: SceneNight) {
        super(scene)
        this.img.src = "assets/heart.png"
    }

    *G(scene: SceneNight) {
        yield* Yields.wait(500)

        const left = new Vec(180, 64)
        const right = new Vec(540, 64)
        const num = 10 // Number of bullets in a spiral

        while (1) {
            const gap = ~~((Math.random() * num) / 2 + num / 4)

            for (let i = 0; i < num + 1; i++) {
                if (i === gap) continue
                scene.bullets.push(new Bullet(left.lerp(right, i / num), new Vec(0, 4)))
            }

            yield* Yields.wait(800)
        }
    }

    *H() {
        while (1) {
            const timer = new Yields.Timer(2000, (t) => t)

            while (timer.progress < 1) {
                this.p.y = Math.sin(Math.PI * 2 * timer.progress) * 48 + 96
                yield
            }
        }
    }
}
