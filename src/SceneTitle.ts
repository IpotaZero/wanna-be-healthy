class SceneTitle extends Scene {
    constructor() {
        super()

        const title = new Itext(DOM.container, "けんこうになりたい!", {
            css: {
                fontSize: "12vh",
                backgroundColor: "#ffffff80",
                top: "8vh",
            },
        })

        const img = new Iimage(DOM.container, "assets/chara.png", {
            css: {
                top: "24vh",
                height: "72vh",
                cursor: "pointer",

                ":hover": {
                    opacity: "0.5",
                    " + .label": {
                        display: "flex",
                    },
                },
            },
        })

        const label = new Itext(DOM.container, "はじめる", {
            css: {
                display: "none",
                top: "56vh",
                padding: "2vh",
                backgroundColor: "#f4f4f4",
                border: "#111 solid 1vh",

                pointerEvents: "none",
            },
            className: "label",
        })

        const img2 = new Iimage(DOM.container, "assets/pill.png", {
            css: {
                left: "12vh",
                top: "24vh",
                height: "72vh",
                cursor: "pointer",

                ":hover": {
                    opacity: "0.5",
                    " + .label": {
                        display: "flex",
                    },
                },
            },
        })

        const label2 = new Itext(DOM.container, "あらすじ", {
            css: {
                display: "none",
                left: "32vh",
                top: "56vh",
                padding: "2vh",
                backgroundColor: "#f4f4f4",
                border: "#111 solid 1vh",

                pointerEvents: "none",
            },
            className: "label",
        })

        const img3 = new Iimage(DOM.container, "assets/pill.png", {
            css: {
                right: "12vh",
                top: "24vh",
                height: "72vh",
                cursor: "pointer",

                ":hover": {
                    opacity: "0.5",
                    " + .label": {
                        display: "flex",
                    },
                },
            },
        })

        const label3 = new Itext(DOM.container, "くれじっと", {
            css: {
                display: "none",
                right: "32vh",
                top: "56vh",
                padding: "2vh",
                backgroundColor: "#f4f4f4",
                border: "#111 solid 1vh",

                pointerEvents: "none",
            },
            className: "label",
        })

        let clicked = false

        img.onclick = async () => {
            if (clicked) return
            clicked = true

            await Awaits.fade(1000)

            currentScene = new SceneDay()
        }

        img2.onclick = () => {
            document.querySelector(".arasuji")?.remove()

            const summaryText = new Itext(
                DOM.container,
                `
                    やみの じだいは おわり、 これからは けんこうの じだい。<br>
                    ははおやから くすねた みんざいが 1こだけ あるから、<br>
                    これを うまく つかって けんこうに いきよう。
                `,
                {
                    css: {
                        bottom: "4vh",
                        height: "4em",
                        padding: "0.5em",
                        backgroundColor: "#eee",
                        cursor: "pointer",
                    },
                    className: "arasuji",
                },
            )

            summaryText.ready.then(() => {
                summaryText.querySelector(".i-text-wrapper")?.classList.add("blink-triangle")
            })

            summaryText.onclick = () => {
                summaryText.remove()
            }
        }

        img3.onclick = () => {
            document.querySelector(".arasuji")?.remove()

            const summaryText = new Itext(
                DOM.container,
                `
                    きかく: いぽた、 まいまい<br>
                    せいさく: MCR
                `,
                {
                    css: {
                        bottom: "4vh",
                        height: "4em",
                        padding: "0.5em",
                        backgroundColor: "#eee",
                        cursor: "pointer",
                    },
                    className: "arasuji",
                },
            )

            summaryText.ready.then(() => {
                summaryText.querySelector(".i-text-wrapper")?.classList.add("blink-triangle")
            })

            summaryText.onclick = () => {
                summaryText.remove()
            }
        }

        this.#fade()
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
        })

        await Awaits.sleep(1000)

        fade.style.opacity = "0"

        fade.ontransitionend = () => {
            fade.remove()
        }

        fade.onclick = () => {
            fade.remove()
        }
    }
}
