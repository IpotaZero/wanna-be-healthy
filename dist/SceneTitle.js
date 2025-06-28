"use strict";
class SceneTitle extends Scene {
    constructor() {
        super();
        this.#start();
    }
    async #start() {
        const html = await (await fetch("title.html")).text();
        page(DOM.container, "normal", html);
        let clicked = false;
        const [button0, button1, button2] = document.querySelectorAll(".hantei");
        button1.onclick = async () => {
            if (clicked)
                return;
            clicked = true;
            await Awaits.fade(1000);
            currentScene = new SceneDay();
        };
        button0.onclick = () => {
            ;
            document.querySelector(".arasuji").restart();
            document.querySelector(".arasuji")?.classList.remove("hidden");
            document.querySelector(".credit")?.classList.add("hidden");
        };
        button2.onclick = () => {
            ;
            document.querySelector(".credit").restart();
            document.querySelector(".credit")?.classList.remove("hidden");
            document.querySelector(".arasuji")?.classList.add("hidden");
        };
        document.querySelectorAll("i-typing").forEach((elm) => {
            const text = elm;
            text.onclick = () => {
                text.classList.add("hidden");
            };
        });
        this.#fade();
    }
    async #fade() {
        const fade = new Ielement(DOM.container, {
            css: {
                position: "fixed",
                width: "100vw",
                height: "100vh",
                backgroundColor: "#111",
                transition: "opacity 6s ",
                opacity: "1",
            },
        });
        await Awaits.sleep(1000);
        fade.style.opacity = "0";
        fade.ontransitionend = () => {
            fade.remove();
        };
        fade.onclick = () => {
            fade.remove();
        };
    }
    loop() {
        if (keyboard.pressed.has("Enter") || keyboard.pressed.has("Space")) {
            SE.great.play();
        }
    }
}
