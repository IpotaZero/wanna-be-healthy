"use strict";
class SceneNight extends Scene {
    #mode = "pause";
    #ctx;
    #awakeness = 100;
    #time = 150;
    #timeElement;
    #stage;
    #img = new Image();
    #frame = 0;
    constructor(slept) {
        super();
        this.#img.src = ["assets/smartphone.png", "assets/energy.png"][state.day];
        this.#stage = stages[state.day]();
        player = new Shooter();
        this.#start(slept);
    }
    #initDOM(slept) {
        DOM.setParameter();
        this.#timeElement = new Ielement(DOM.container, {
            className: "time",
        });
        this.#awakeness = slept ? 100 : 50;
        DOM.awakeness.style.width = this.#awakeness + "%";
        const cvs = document.createElement("canvas");
        cvs.width = 720;
        cvs.height = 720;
        cvs.className = "canvas";
        DOM.container.appendChild(cvs);
        this.#ctx = cvs.getContext("2d");
        this.#ctx.imageSmoothingEnabled = false;
    }
    #setupButton() {
        const text = new Itext(DOM.container, "みんざいを つかう?", {
            css: {
                color: "white",
            },
        });
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
        });
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
        });
        let clicked = false;
        let wannaMedicine = 0;
        button0.onclick = async () => {
            if (state.usedSleepingMedicine) {
                wannaMedicine++;
                button0.style.backgroundColor = `rgb(${255 * (1 - wannaMedicine / 10 + 0.5)},0,0)`;
                document.querySelector(".never")?.remove();
                new Itext(DOM.container, "もう つかっては いけない", {
                    css: {
                        bottom: "16vh",
                        color: "white",
                    },
                    className: "never",
                });
                if (wannaMedicine === 10) {
                    state.OD = true;
                    const black = new Ielement(document.body, {
                        css: {
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "black",
                        },
                    });
                    await Awaits.sleep(2000);
                    await Awaits.fade(1000);
                    black.remove();
                    DOM.container.style.transform = "rotate(3deg)";
                    currentScene = new SceneDay();
                }
                return;
            }
            if (clicked)
                return;
            clicked = true;
            state.usedSleepingMedicine = true;
            await Awaits.fade(1000);
            currentScene = new SceneDay();
        };
        button1.onclick = async () => {
            if (clicked)
                return;
            clicked = true;
            await Awaits.fade(1000);
            text.remove();
            button0.remove();
            button1.remove();
            new Itext(DOM.container, "しげきを さけて ねむりに つけ!", {
                css: {
                    top: "8vh",
                },
            });
            this.#mode = "stg";
        };
    }
    async #start(slept) {
        const text = new Itext(DOM.container, "よる", {
            css: {
                fontSize: "16vh",
            },
        });
        await Awaits.sleep(1000);
        await Awaits.fade(1000);
        text.remove();
        this.#initDOM(slept);
        if (state.OD) {
            this.#mode = "stg";
        }
        else {
            this.#setupButton();
        }
    }
    loop(elapsedTime) {
        if (this.#mode === "pause") {
        }
        else if (this.#mode === "stg") {
            this.#time -= elapsedTime / 200;
            this.#timeElement.style.width = `${this.#time / 6}%`;
            this.#awakeness -= elapsedTime / 200;
            DOM.awakeness.style.width = `${this.#awakeness}%`;
            this.#stage.next();
            player.update(elapsedTime);
            bullets = bullets.filter((b) => {
                b.update(elapsedTime);
                const isHit = b.r + player.r >= b.p.sub(player.p).magnitude();
                if (isHit) {
                    b.life = 0;
                    this.#awakeness = Math.min(100, this.#awakeness + 10);
                }
                return b.life > 0;
            });
            if (this.#awakeness < 0) {
                this.#sleep();
            }
            else if (this.#time < 0) {
                this.#allNight();
            }
            this.#render();
            Input.update();
        }
    }
    #render() {
        this.#ctx.clearRect(0, 0, 720, 720);
        this.#ctx.strokeStyle = "white";
        this.#ctx.lineWidth = 14;
        this.#ctx.strokeRect(180, 180, 360, 360);
        bullets.forEach((b) => b.render(this.#ctx));
        this.#ctx.drawImage(this.#img, 360 - 96 + 48 * Math.sin(this.#frame++ / 24), 24, 144, 144);
        player.render(this.#ctx);
    }
    async #sleep() {
        this.#mode = "pause";
        state.dark.push(0);
        const text = new Itext(DOM.container, "ねむれた......", {
            css: {
                bottom: "16vh",
                color: "white",
                backgroundColor: "#111c",
            },
        });
        new Iimage(DOM.container, "assets/bed.png", {
            css: {
                height: "20vh",
                backgroundColor: "#111c",
            },
        });
        text.ready.then(() => {
            text.classList.add("blink-triangle");
        });
        state.day++;
        await Awaits.ok();
        await Awaits.fade(1000);
        currentScene = new SceneDay();
    }
    async #allNight() {
        this.#mode = "pause";
        state.dark.push(1);
        const p = state.dark.reduce((a, b) => a + b, 0) * 25;
        DOM.dark.style.width = `${p}%`;
        const text = new Itext(DOM.container, "てつや して しまった......", {
            css: {
                bottom: "16vh",
                color: "white",
                backgroundColor: "#111c",
            },
        });
        text.ready.then(() => {
            text.classList.add("blink-triangle");
        });
        state.day++;
        await Awaits.ok();
        await Awaits.fade(1000);
        currentScene = new SceneDay();
    }
}
class Shooter {
    #image = new Image();
    #SPEED = 3;
    p = new Vec(360, 360);
    r = 8;
    constructor() {
        this.#image.src = "assets/pill.png";
    }
    update(elapsedTime) {
        if (keyboard.pressed.has("ArrowRight")) {
            this.p.x += this.#SPEED * (elapsedTime * (60 / 1000));
        }
        else if (keyboard.pressed.has("ArrowLeft")) {
            this.p.x -= this.#SPEED * (elapsedTime * (60 / 1000));
        }
        if (keyboard.pressed.has("ArrowUp")) {
            this.p.y -= this.#SPEED * (elapsedTime * (60 / 1000));
        }
        else if (keyboard.pressed.has("ArrowDown")) {
            this.p.y += this.#SPEED * (elapsedTime * (60 / 1000));
        }
        const gap = 7 + this.r;
        if (this.p.x < 180 + gap) {
            this.p.x = 180 + gap;
        }
        else if (this.p.x > 540 - gap) {
            this.p.x = 540 - gap;
        }
        if (this.p.y < 180 + gap) {
            this.p.y = 180 + gap;
        }
        else if (this.p.y > 540 - gap) {
            this.p.y = 540 - gap;
        }
    }
    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "cyan";
        ctx.arc(this.p.x, this.p.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        // ctx.drawImage(this.#image, this.p.x - 32, this.p.y - 32, 64, 64)
    }
}
let player = new Shooter();
let bullets = [];
class Bullet {
    p;
    #v;
    r;
    life = 1;
    constructor(p, v) {
        this.p = p;
        this.#v = v;
        this.r = 12;
    }
    update(elapsedTime) {
        this.p = this.p.add(this.#v.scale(elapsedTime * (60 / 1000)));
    }
    render(ctx) {
        // ctx.drawImage(this.#image, 0, 0, 64, 64)
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.p.x, this.p.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}
const stages = [
    function* () {
        bullets = [];
        yield* wait(500);
        const p = new Vec(360, 64);
        while (1) {
            const v = player.p.sub(p).normalize().scale(8);
            bullets.push(new Bullet(p, v));
            yield* wait(1000);
        }
    },
    function* () {
        bullets = [];
        yield* wait(500);
        const p = new Vec(360, 64);
        while (1) {
            const v = player.p.sub(p).normalize().scale(8);
            bullets.push(new Bullet(p, v), new Bullet(p, v.rotate(Math.PI / 13)), new Bullet(p, v.rotate(-Math.PI / 13)));
            yield* wait(250);
            const v2 = player.p.sub(p).normalize().scale(8);
            bullets.push(new Bullet(p, v2.rotate(Math.PI / 12)), new Bullet(p, v2.rotate(-Math.PI / 12)));
            yield* wait(250);
        }
    },
];
function* wait(ms) {
    const startTime = performance.now();
    yield;
    while (performance.now() - startTime < ms) {
        yield;
    }
}
