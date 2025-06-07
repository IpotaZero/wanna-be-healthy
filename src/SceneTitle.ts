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

                // " img:hover": {
                //     filter: "drop-shadow(0 0 1vh black)",
                // },

                ":hover": {
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

        const img2 = new Iimage(DOM.container, "assets/chara.png", {
            css: {
                left: "24vh",
                top: "24vh",
                height: "72vh",
                cursor: "pointer",

                // " img:hover": {
                //     filter: "drop-shadow(0 0 1vh black)",
                // },

                ":hover": {
                    " + .label": {
                        display: "flex",
                    },
                },
            },
        })

        let clicked = false

        img.onclick = async () => {
            if (clicked) return
            clicked = true

            await Awaits.fade(1000)

            currentScene = new SceneDay()
        }

        img2.onclick = () => {
            console.log(`
                やみの じだいは おわり、これからは けんこうの じだい。
                ははおやから くすねた みんざいが 1こだけ あるから、これを うまく つかって けんこうに いきよう。
            `)
        }
    }
}
